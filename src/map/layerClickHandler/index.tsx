import React, { useEffect } from "react";
import mapboxgl from "mapbox-gl";
import { combineLayerProperties } from "../utils/layerDictionary";

interface LayerClickHandlerProps {
  map: mapboxgl.Map | undefined;
}

const LayerClickHandler: React.FC<LayerClickHandlerProps> = ({ map }) => {
  useEffect(() => {
    if (!map) return;

    const handleLayerClick = (e: mapboxgl.MapMouseEvent & mapboxgl.EventData) => {
      const features = map.queryRenderedFeatures(e.point);
      
      if (features.length > 0) {
        console.log("All features at click point:", features.map(f => ({
          layer: f.layer.id,
          props: f.properties
        })));
        
        // 複数のレイヤー情報を統合
        const htmlContent = combineLayerProperties(features);
        
        new mapboxgl.Popup({
          maxWidth: "450px",
        })
          .setLngLat(e.lngLat)
          .setHTML(htmlContent)
          .addTo(map);
      }
    };

    map.on("click", handleLayerClick);

    return () => {
      map.off("click", handleLayerClick);
    };
  }, [map]);

  return null;
};

export default LayerClickHandler;