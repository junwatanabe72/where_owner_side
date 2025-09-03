import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import MapboxLanguage from "@mapbox/mapbox-gl-language";
import "mapbox-gl/dist/mapbox-gl.css";
import { Box } from "@mui/material";
import PropertiesMarker from "./marker";
import { customLayers, mapboxStyleURL, tokyoStationGeo, osakaStationGeo } from "./constants";
import LayerClickHandler from "./layerClickHandler";

interface Props {
  currentStore: LandProperty[];
  isSample: boolean;
  privacyLevel?: "最小公開" | "限定公開" | "フル公開";
  mapMode?: "map" | "sat";
  mapLayers?: {
    youto: boolean;
    koudo: boolean;
    bouka: boolean;
    height: boolean;
  };
}

const Map: React.FC<Props> = ({ currentStore, isSample, privacyLevel = "限定公開", mapMode = "sat", mapLayers }) => {
  const mapContainer = useRef(null);
  const [map, setMap] = useState<mapboxgl.Map>();
  const [pitch] = useState<number>(0);
  const [isSatellite, setIsSatellite] = useState<boolean>(mapMode === "sat");
  const targetGeo =
    currentStore && currentStore.length > 0
      ? [
          currentStore[0].nearStation[0].geometry.lng,
          currentStore[0].nearStation[0].geometry.lat,
        ]
      : isSample
      ? osakaStationGeo
      : tokyoStationGeo;


  useEffect(() => {
    if (!map && mapContainer.current !== null) {
      console.log("mapfetch");
      console.log(pitch);
      setMap(
        new mapboxgl.Map({
          container: mapContainer.current,
          style: mapboxStyleURL, // カスタムスタイルを使用
          zoom: 12,
          pitch: pitch,
          center: targetGeo as [number, number],
          accessToken: process.env.REACT_APP_MAPBOX_TOKEN || process.env.REACT_APP_MAPBOX_ACCESS_TOKEN,
        })
      );
      return;
    }
  }, [map, targetGeo, pitch]);

  // 公開範囲が変更されたときにレイヤーの表示を更新
  // mapModeが変更されたときに衛星写真を切り替え
  useEffect(() => {
    if (!map || !map.isStyleLoaded()) return;
    
    if (mapMode === "sat" && !isSatellite) {
      // 衛星写真レイヤーを追加
      if (!map.getSource('mapbox-satellite')) {
        map.addSource('mapbox-satellite', {
          type: 'raster',
          url: 'mapbox://mapbox.satellite',
          tileSize: 256
        });
        
        const firstLayerId = map.getStyle().layers?.[0]?.id;
        map.addLayer({
          id: 'satellite-layer',
          type: 'raster',
          source: 'mapbox-satellite',
          layout: {
            visibility: 'visible'
          },
          paint: {
            'raster-opacity': 1
          }
        }, firstLayerId);
      } else {
        map.setLayoutProperty('satellite-layer', 'visibility', 'visible');
      }
      setIsSatellite(true);
    } else if (mapMode === "map" && isSatellite) {
      // 衛星写真レイヤーを非表示
      if (map.getLayer('satellite-layer')) {
        map.setLayoutProperty('satellite-layer', 'visibility', 'none');
      }
      setIsSatellite(false);
    }
  }, [map, mapMode, isSatellite]);

  // mapLayersが変更されたときにレイヤーの表示/非表示を制御
  useEffect(() => {
    if (!map || !map.isStyleLoaded() || !mapLayers) return;

    Object.keys(customLayers).forEach((layerCategory) => {
      const layerId = layerCategory as keyof typeof customLayers;
      const layers = customLayers[layerId];
      
      // mapLayersの状態に応じて表示/非表示を切り替え
      const shouldShow = mapLayers[layerId as keyof typeof mapLayers] || false;
      
      // 各都市のレイヤーを制御
      for (const city in layers) {
        const mapLayerId = layers[city as keyof typeof layers];
        if (map.getLayer(mapLayerId)) {
          map.setLayoutProperty(mapLayerId, "visibility", shouldShow ? "visible" : "none");
        }
      }
    });
  }, [map, mapLayers]);
  
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
    if (!map || map === null) {
      return;
    }
    const language = new MapboxLanguage({ defaultLanguage: "ja" });
    map.addControl(language);
    
    // マップのサイズを強制的に更新
    setTimeout(() => {
      map.resize();
    }, 100);
    
    // マップのスタイルがロードされたら、利用可能なレイヤーを確認
    map.on("style.load", () => {
      console.log("Map style loaded");
      
      // すべての利用可能なレイヤーをリストアップ
      const style = map.getStyle();
      if (style && style.layers) {
        console.log("Available layers in the map:");
        style.layers.forEach((layer) => {
          console.log(`- ${layer.id} (type: ${layer.type})`);
        });
        
        // カスタムレイヤーの存在確認
        console.log("\nChecking for custom layers:");
        Object.entries(customLayers).forEach(([category, layers]) => {
          console.log(`Category: ${category}`);
          Object.entries(layers).forEach(([city, layerId]) => {
            const exists = map.getLayer(layerId);
            console.log(`  ${layerId}: ${exists ? 'EXISTS' : 'NOT FOUND'}`);
          });
        });
      }
    });
  }, [map]);

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
