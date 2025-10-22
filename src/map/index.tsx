import React, { useRef, useEffect, useState, useMemo, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import MapboxLanguage from "@mapbox/mapbox-gl-language";
import "mapbox-gl/dist/mapbox-gl.css";
import { Box } from "@mui/material";
import PropertiesMarker from "./marker";
import { customLayers, mapboxStyleURL, tokyoStationGeo, osakaStationGeo } from "./constants";
import LayerClickHandler from "./layerClickHandler";
import type { LandProperty, MapLayers } from "../types";

const mapPrototype = mapboxgl.Map.prototype as {
  _queryFogOpacity?: (lngLat: mapboxgl.LngLat) => number;
  __patchedFogGuard?: boolean;
};

if (mapPrototype && !mapPrototype.__patchedFogGuard && typeof mapPrototype._queryFogOpacity === "function") {
  const originalQueryFogOpacity = mapPrototype._queryFogOpacity;
  mapPrototype._queryFogOpacity = function patchedQueryFogOpacity(this: mapboxgl.Map, ...args) {
    try {
      return originalQueryFogOpacity.apply(this, args);
    } catch (error) {
      return 0;
    }
  };
  mapPrototype.__patchedFogGuard = true;
}

const markerPrototype = mapboxgl.Marker.prototype as {
  _evaluateOpacity?: (map: mapboxgl.Map) => void;
  __patchedOpacityGuard?: boolean;
};

if (markerPrototype && !markerPrototype.__patchedOpacityGuard && typeof markerPrototype._evaluateOpacity === "function") {
  const originalEvaluateOpacity = markerPrototype._evaluateOpacity;
  markerPrototype._evaluateOpacity = function patchedEvaluateOpacity(this: mapboxgl.Marker, map: mapboxgl.Map) {
    try {
      return originalEvaluateOpacity.call(this, map);
    } catch (error) {
      // Mapbox GL JS v3.0+ has known cases where fog state is unset; fall back to visible markers.
      const element = this.getElement();
      if (element) {
        element.style.opacity = "1";
        element.style.pointerEvents = "auto";
      }
      return undefined;
    }
  };
  markerPrototype.__patchedOpacityGuard = true;
}

interface Props {
  currentStore: LandProperty[];
  isSample: boolean;
  privacyLevel?: "最小公開" | "限定公開" | "フル公開";
  mapMode?: "map" | "sat";
  mapLayers?: Partial<MapLayers>;
  initialCenter?: [number, number];
  onMapReady?: (map: mapboxgl.Map) => void;
}

const Map: React.FC<Props> = ({
  currentStore,
  isSample,
  privacyLevel = "限定公開",
  mapMode = "sat",
  mapLayers,
  initialCenter,
  onMapReady,
}) => {
  const mapContainer = useRef(null);
  const [map, setMap] = useState<mapboxgl.Map>();
  const [pitch] = useState<number>(0);
  const languageControlRef = useRef<MapboxLanguage | null>(null);
  // 現在のベーススタイルURLを保持
  const currentBaseStyleRef = useRef<string | null>(null);
  
  // コンポーネントアンマウント時のクリーンアップ
  useEffect(() => {
    return () => {
      if (map) {
        // 言語コントロールを削除
        const languageControl = languageControlRef.current;
        if (languageControl) {
          try {
            map.removeControl(languageControl);
          } catch (e) {
            // エラーを無視
          }
        }
        // マップを削除
        try {
          map.remove();
          setMap(undefined);
        } catch (e) {
          // エラーを無視
        }
        languageControlRef.current = null;
      }
    };
  }, [map]);
  const targetGeo = useMemo<[number, number]>(() => {
    if (initialCenter) {
      return initialCenter;
    }

    if (currentStore && currentStore.length > 0) {
      const firstStation = currentStore[0]?.nearStation?.[0];
      if (firstStation?.geometry) {
        return [firstStation.geometry.lng, firstStation.geometry.lat] as [number, number];
      }
    }

    const fallbackCenter = (isSample ? osakaStationGeo : tokyoStationGeo) as [number, number];
    return [fallbackCenter[0], fallbackCenter[1]] as [number, number];
  }, [initialCenter, currentStore, isSample]);

  useEffect(() => {
    // 既にマップが存在する場合は何もしない
    if (map) return;
    
    // コンテナが存在しない場合は何もしない
    if (!mapContainer.current) return;
    
    console.log("Creating new map");
    console.log("Initial mapMode:", mapMode);
    
    // 初期スタイルは常にカスタムスタイル（レイヤーデータが含まれているため）
    const initialStyle = mapboxStyleURL;
    
    try {
      const newMap = new mapboxgl.Map({
        container: mapContainer.current,
        style: initialStyle,
        zoom: 12,
        pitch: pitch,
        center: targetGeo as [number, number],
        accessToken: process.env.REACT_APP_MAPBOX_TOKEN || process.env.REACT_APP_MAPBOX_ACCESS_TOKEN,
      });
      
      // 初期スタイルを記録
      currentBaseStyleRef.current = initialStyle;
      setMap(newMap);
    } catch (error) {
      console.error("Error creating map:", error);
    }
  }, [map, mapMode, pitch, targetGeo]);

  useEffect(() => {
    if (!map || !onMapReady) {
      return;
    }

    if (map.isStyleLoaded()) {
      onMapReady(map);
      return;
    }

    const handleLoad = () => {
      onMapReady(map);
    };

    map.once("load", handleLoad);
    return () => {
      map.off("load", handleLoad);
    };
  }, [map, onMapReady]);

  useEffect(() => {
    if (!map || !initialCenter) {
      return;
    }

    const applyCenter = () => {
      const currentCenter = map.getCenter();
      if (currentCenter.lng === initialCenter[0] && currentCenter.lat === initialCenter[1]) {
        return;
      }
      map.setCenter(initialCenter);
    };

    if (map.isStyleLoaded()) {
      applyCenter();
      return;
    }

    map.once("load", applyCenter);
    return () => {
      map.off("load", applyCenter);
    };
  }, [map, initialCenter]);

  const applyLayerVisibility = useCallback(() => {
    if (!map || !map.isStyleLoaded()) {
      console.log('Map not ready for layer visibility');
      return;
    }

    if (!mapLayers) {
      console.log('No mapLayers provided');
      return;
    }

    console.log('==== applyLayerVisibility called ====');
    console.log('Applying layer visibility:', mapLayers);
    console.log('Current mapMode:', mapMode);

    const currentLayers = map.getStyle()?.layers || [];
    console.log('Total layers in current style:', currentLayers.length);

    Object.keys(customLayers).forEach((layerCategory) => {
      const layerId = layerCategory as keyof typeof customLayers;
      const layers = customLayers[layerId];
      const layerValue = mapLayers[layerId as keyof MapLayers];
      const shouldShow = mapMode === 'sat' && layerId === 'height' ? false : Boolean(layerValue);

      console.log(`Category ${layerId}: value=${layerValue}, shouldShow=${shouldShow}`);

      for (const city in layers) {
        const mapLayerId = (layers as any)[city];
        if (map.getLayer(mapLayerId)) {
          const currentVisibility = map.getLayoutProperty(mapLayerId, "visibility");
          const newVisibility = shouldShow ? "visible" : "none";

          if (currentVisibility !== newVisibility) {
            map.setLayoutProperty(mapLayerId, "visibility", newVisibility);
            console.log(`✓ Changed ${mapLayerId} visibility to: ${newVisibility}`);
          }

          if (mapMode === 'map' && newVisibility === 'visible') {
            const layer = map.getLayer(mapLayerId);
            const source = layer && 'source' in layer ? layer.source : undefined;
            const sourceData = source ? map.getSource(source as string) : undefined;

            if (!sourceData) {
              console.error(`⚠️ Source '${source}' not found for layer ${mapLayerId}!`);
            }
          }
        } else {
          console.log(`✗ Layer ${mapLayerId} not found in current style`);
        }
      }
    });
  }, [map, mapLayers, mapMode]);

  const applySatelliteForMode = useCallback(async () => {
    if (!map) return;
    console.log('Switching map mode to:', mapMode);
    
    // モードに応じたスタイルを選択
    let newStyle: string;
    
    if (mapMode === "sat") {
      // 衛星モード：カスタムスタイル
      newStyle = mapboxStyleURL;
    } else {
      // 地図モード：別のアプローチを試す
      // 1. light-v11 (シンプルで軽量なstreetスタイル)
      // newStyle = "mapbox://styles/mapbox/light-v11";
      
      // 2. streets-v11 (v12より古いが互換性が高い可能性)
      // newStyle = "mapbox://styles/mapbox/streets-v11";
      
      // 3. カスタムスタイルを使用し、見た目を調整
      newStyle = mapboxStyleURL;
    }
    
    // 現在のビュー状態を保持
    const center = map.getCenter();
    const zoom = map.getZoom();
    const pitch = map.getPitch();
    const bearing = map.getBearing();
    
    // スタイルを更新
    currentBaseStyleRef.current = newStyle;
    
    // スタイルを変更
    map.once('style.load', async () => {
      // ビュー状態を復元
      map.setCenter(center);
      map.setZoom(zoom);
      map.setPitch(pitch);
      map.setBearing(bearing);
      
      if (mapMode !== "map" && languageControlRef.current) {
        try {
          map.removeControl(languageControlRef.current);
        } catch (e) {
          console.log('Failed to remove language control:', e);
        }
        languageControlRef.current = null;
      }

      // 地図モードの場合、言語プラグインを追加
      if (mapMode === "map" && !languageControlRef.current) {
        try {
          const language = new MapboxLanguage({ defaultLanguage: "ja" });
          map.addControl(language);
          languageControlRef.current = language;
        } catch (e) {
          console.log('Failed to add language control:', e);
        }
      }
      
      if (mapMode === "sat") {
        // 地図モードのレイヤーをクリーンアップ
        ['carto-base-layer', 'osm-base-layer'].forEach(layerId => {
          if (map.getLayer(layerId)) {
            map.removeLayer(layerId);
          }
        });
        
        // ソースも削除
        ['carto-light', 'osm-tiles'].forEach(sourceId => {
          if (map.getSource(sourceId)) {
            try {
              map.removeSource(sourceId);
            } catch (e) {
              console.log(`Could not remove source ${sourceId}:`, e);
            }
          }
        })
        
        // 衛星モードの場合、衛星レイヤーを追加
        if (!map.getSource('mapbox-satellite')) {
          map.addSource('mapbox-satellite', {
            type: 'raster',
            url: 'mapbox://mapbox.satellite',
            tileSize: 512,
            maxzoom: 22
          });
        }
        
        if (!map.getLayer('satellite-layer')) {
          const firstLayerId = map.getStyle().layers?.[0]?.id;
          map.addLayer({
            id: 'satellite-layer',
            type: 'raster',
            source: 'mapbox-satellite',
            layout: { visibility: 'visible' },
            paint: {
              'raster-opacity': 1,
              'raster-resampling': 'nearest'
            }
          }, firstLayerId);
        }
        
        // 衛星レイヤーを表示
        if (map.getLayer('satellite-layer')) {
          map.setLayoutProperty('satellite-layer', 'visibility', 'visible');
        }
      } else {
        // 地図モードの場合、衛星レイヤーを非表示にする
        if (map.getLayer('satellite-layer')) {
          map.setLayoutProperty('satellite-layer', 'visibility', 'none');
        }
        
        // 地図モード：OSMまたはCartoタイルを追加してstreetテイストを実現
        
        // Option 1: OpenStreetMapタイルを使用（無料、安定）
        if (!map.getSource('osm-tiles')) {
          map.addSource('osm-tiles', {
            type: 'raster',
            tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
            tileSize: 256,
            attribution: '© OpenStreetMap contributors'
          });
        }
        
        // Option 2: Cartoタイル（よりクリーンなデザイン）
        if (!map.getSource('carto-light')) {
          map.addSource('carto-light', {
            type: 'raster',
            tiles: ['https://basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png'],
            tileSize: 256,
            attribution: '© CARTO'
          });
        }
        
        // OSMタイルレイヤーを追加（安定性重視）
        if (!map.getLayer('osm-base-layer')) {
          // 最初のレイヤーとして追加（背景として）
          const firstLayerId = map.getStyle().layers?.[0]?.id;
          map.addLayer({
            id: 'osm-base-layer',
            type: 'raster',
            source: 'osm-tiles',
            layout: { visibility: 'visible' },
            paint: {
              'raster-opacity': 0.9, // 少し透過させて用途地域レイヤーを見やすくする
              'raster-brightness-max': 1,
              'raster-brightness-min': 0
            }
          }, firstLayerId);
        }
        
        // Cartoタイルレイヤー（代替オプション、デフォルトは非表示）
        if (!map.getLayer('carto-base-layer')) {
          const firstLayerId = map.getStyle().layers?.[0]?.id;
          map.addLayer({
            id: 'carto-base-layer',
            type: 'raster',
            source: 'carto-light',
            layout: { visibility: 'none' }, // デフォルトは非表示、OSMを優先
            paint: {
              'raster-opacity': 0.9,
              'raster-brightness-max': 1,
              'raster-brightness-min': 0
            }
          }, firstLayerId);
        }
        
        // OSMレイヤーを表示
        if (map.getLayer('osm-base-layer')) {
          map.setLayoutProperty('osm-base-layer', 'visibility', 'visible');
        }
        
        // 背景色を調整（タイルの下に表示される場合のため）
        const backgroundLayer = map.getStyle()?.layers?.find(l => l.type === 'background');
        if (backgroundLayer && backgroundLayer.id) {
          map.setPaintProperty(backgroundLayer.id, 'background-color', '#f0f0f0');
        }
      }
      
      // 両モードで可視性を適用（カスタムスタイルに既にレイヤーが含まれている）
      // レイヤーが完全にロードされるまで少し待つ
      window.setTimeout(() => {
        console.log('Applying layer visibility after style switch, mapLayers:', mapLayers);
        applyLayerVisibility();
      }, 200);
    });

    map.setStyle(newStyle);
  }, [map, mapMode, mapLayers, applyLayerVisibility]);

  // カスタムスタイルからレイヤー情報を取得して追加（現在未使用）
  /*
  const addCustomLayersFromStyle = async (currentMapLayers?: typeof mapLayers) => {
    if (!map) {
      console.error('Map is not available');
      return;
    }
    
    // style.loadイベント内で呼ばれるため、isStyleLoadedチェックは不要
    const layersToUse = currentMapLayers || mapLayers;
    
    try {
      console.log('==== Starting addCustomLayersFromStyle ====');
      console.log('Map is available:', !!map);
      console.log('Style is loaded:', map.isStyleLoaded());
      console.log('Current mapLayers:', layersToUse);
      
      // カスタムスタイルを取得
      const token = process.env.REACT_APP_MAPBOX_TOKEN || process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;
      if (!token) {
        console.error('Mapbox token not found!');
        return;
      }
      
      const styleId = mapboxStyleURL.replace('mapbox://styles/', '');
      const styleUrl = `https://api.mapbox.com/styles/v1/${styleId}?access_token=${token}`;
      console.log('Fetching style from:', styleUrl);
      
      const response = await fetch(styleUrl);
      
      if (!response.ok) {
        console.error('Failed to fetch custom style:', response.status, response.statusText);
        const errorText = await response.text();
        console.error('Error details:', errorText);
        return;
      }
      
      const customStyle = await response.json();
      console.log('Custom style fetched, sources:', Object.keys(customStyle.sources || {}));
      console.log('Custom style layers count:', customStyle.layers?.length || 0);
      console.log('Looking for layers:', Object.values(customLayers).flatMap(group => Object.values(group)));
      
      // まず必要なソースを全て追加
      const sourcesToAdd = new Set<string>();
      Object.values(customLayers).forEach((layerGroup: any) => {
        Object.values(layerGroup).forEach((layerId: any) => {
          const layerDef = customStyle.layers?.find((l: any) => l.id === layerId);
          if (layerDef && layerDef.source) {
            sourcesToAdd.add(layerDef.source);
            console.log(`Found layer definition for ${layerId}, source: ${layerDef.source}`);
          } else {
            console.log(`WARNING: Layer definition NOT found for ${layerId}`);
          }
        });
      });
      
      // ソースを追加
      console.log('Sources to add:', Array.from(sourcesToAdd));
      sourcesToAdd.forEach(sourceId => {
        if (!map.getSource(sourceId)) {
          const source = customStyle.sources[sourceId];
          if (source) {
            console.log(`Adding source: ${sourceId}`, source);
            try {
              map.addSource(sourceId, source);
              console.log(`✓ Successfully added source: ${sourceId}`);
            } catch (e) {
              console.error(`Failed to add source ${sourceId}:`, e);
            }
          } else {
            console.error(`Source definition not found for: ${sourceId}`);
          }
        } else {
          console.log(`Source ${sourceId} already exists`);
        }
      });
      
      // レイヤーを追加
      Object.values(customLayers).forEach((layerGroup: any) => {
        Object.entries(layerGroup).forEach(([, layerId]: [string, any]) => {
          const layerDef = customStyle.layers?.find((l: any) => l.id === layerId);
          if (layerDef) {
            if (!map.getLayer(layerId)) {
              console.log(`Adding layer: ${layerId}, source: ${layerDef.source}`);
              
              try {
                // 現在のmapLayersから初期可視性を決定
                const layerCategory = Object.keys(customLayers).find(key => 
                  Object.values((customLayers as any)[key]).includes(layerId)
                );
                const shouldBeVisible = layerCategory && layersToUse && (layersToUse as any)[layerCategory];
                
                // レイヤー定義をコピー
                const newLayerDef = { ...layerDef };
                
                // compositeソースを使用している場合、正しいソースIDがあるか確認
                if (layerDef.source === 'composite') {
                  // compositeソースの場合、source-layerが必要
                  if (!layerDef['source-layer']) {
                    console.error(`Layer ${layerId} uses composite source but has no source-layer`);
                    return;
                  }
                  // ソースが追加されているか確認
                  const actualSourceId = Array.from(sourcesToAdd).find(sid => 
                    sid.includes(layerId.split('-')[0]) // tokyo-youto -> tokyo を含むソースを探す
                  );
                  if (!actualSourceId) {
                    console.error(`No source found for layer ${layerId}`);
                    return;
                  }
                }
                
                // レイヤー定義を設定
                newLayerDef.id = layerId;
                newLayerDef.layout = {
                  ...layerDef.layout,
                  visibility: shouldBeVisible ? 'visible' : 'none'
                };
                newLayerDef.paint = {
                  ...layerDef.paint,
                  // fillレイヤーの場合、透明度を確保
                  ...(layerDef.type === 'fill' && {
                    'fill-opacity': layerDef.paint?.['fill-opacity'] || 0.7
                  })
                };
                
                // 重要: レイヤーを適切な位置に配置
                // fill系のレイヤーは道路の下に配置
                let beforeLayerId: string | undefined;
                
                if (layerDef.type === 'fill' || layerDef.type === 'fill-extrusion') {
                  // fillレイヤーは道路レイヤーの前（下）に配置
                  const roadLayer = map.getStyle()?.layers?.find(l => 
                    l.id.includes('road') || l.id.includes('street') || l.id.includes('highway')
                  );
                  beforeLayerId = roadLayer?.id;
                } else {
                  // その他のレイヤーはPOIラベルの前に配置
                  const poiLayer = map.getStyle()?.layers?.find(l => l.id.includes('poi'));
                  beforeLayerId = poiLayer?.id;
                }
                
                // beforeLayerIdが見つからない場合は、最上部に配置
                try {
                  map.addLayer(newLayerDef, beforeLayerId);
                  console.log(`✓ Successfully added layer: ${layerId} (type: ${layerDef.type}, visible: ${shouldBeVisible}, before: ${beforeLayerId || 'top'}`);
                } catch (addError) {
                  console.error(`Failed to add layer ${layerId}:`, addError);
                  // beforeLayerIdなしで再試行
                  try {
                    map.addLayer(newLayerDef);
                    console.log(`✓ Added layer ${layerId} at top (fallback)`);
                  } catch (fallbackError) {
                    console.error(`Failed to add layer ${layerId} even without beforeLayerId:`, fallbackError);
                  }
                }
              } catch (e) {
                console.error(`Unexpected error for layer ${layerId}:`, e);
              }
            } else {
              console.log(`Layer ${layerId} already exists`);
            }
          } else {
            console.log(`Layer definition not found for: ${layerId}`);
          }
        });
      });
      
      console.log('==== Custom layers addition complete ====');
      
      // デバッグ: 追加されたレイヤーを確認
      const addedLayers: Array<{id: string, visibility: string}> = [];
      Object.values(customLayers).forEach((layerGroup: any) => {
        Object.values(layerGroup).forEach((layerId: any) => {
          if (map.getLayer(layerId)) {
            const visibility = map.getLayoutProperty(layerId, 'visibility');
            addedLayers.push({ id: layerId, visibility });
          }
        });
      });
      console.log('Added layers status:', addedLayers);
      
      // レイヤー追加後、即座に可視性を再適用
      applyLayerVisibility();
    } catch (error) {
      console.error('Error adding custom layers:', error);
    }
  };
  */

  // mapMode が変わったら適用（シンプルに1回だけ）
  useEffect(() => {
    if (!map) return;
    applySatelliteForMode();
  }, [map, applySatelliteForMode]);


  
  // mapLayers が変わったら適用（即時適用のみ）
  useEffect(() => {
    if (!map) return;
    console.log('mapLayers changed:', mapLayers);

    if (!map.isStyleLoaded()) {
      console.log('Waiting for style to load before applying layer visibility');
      const handler = () => {
        applyLayerVisibility();
      };
      map.once('style.load', handler);
      return () => {
        map.off('style.load', handler);
      };
    }

    applyLayerVisibility();
  }, [map, mapLayers, applyLayerVisibility]);
  
  // 公開範囲に応じたレイヤー制御（互換性保持）
  useEffect(() => {
    if (!map || !map.isStyleLoaded() || mapLayers) return; // mapLayersが指定されている場合はスキップ

    Object.keys(customLayers).forEach((layerCategory) => {
      const layerId = layerCategory as keyof typeof customLayers;
      const layers = customLayers[layerId];
      
      const shouldHide =
        (privacyLevel === "最小公開" && (layerId === "koudo" || layerId === "bouka")) ||
        (privacyLevel === "限定公開" && layerId === "bouka");
      
      for (const city in layers) {
        const mapLayerId = layers[city as keyof typeof layers];
        if (map.getLayer(mapLayerId)) {
          map.setLayoutProperty(mapLayerId, "visibility", shouldHide ? "none" : "visible");
        }
      }
    });
  }, [map, privacyLevel, mapLayers]);

  useEffect(() => {
    if (!map) {
      return;
    }

    const resizeTimeout = window.setTimeout(() => {
      map.resize();
    }, 100);

    const handleInitialStyleLoad = () => {
      console.log('Initial style loaded, applying layer visibility');
      window.setTimeout(() => {
        applyLayerVisibility();
      }, 300);
    };

    map.once('style.load', handleInitialStyleLoad);

    return () => {
      window.clearTimeout(resizeTimeout);
      map.off('style.load', handleInitialStyleLoad);
    };
  }, [map, applyLayerVisibility]);

  return (
    <>
      <LayerClickHandler map={map} />
      <Box sx={{ height: "100%", width: "100%", position: "absolute", top: 0, left: 0, zIndex: 0 }} ref={mapContainer}>
        <PropertiesMarker map={map} currentStore={currentStore} />
      </Box>
    </>
  );
};

export default Map;
