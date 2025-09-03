import React, { useState, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import { customLayers } from "../constants";
import CustomButton from "../../components/atoms/CustomButton";
import { Box ,Button} from "@mui/material";

const visibility = "visibility";

interface UseMapLayerToggleProps {
  map: mapboxgl.Map | undefined;
  id: keyof typeof customLayers;
  disabled?: boolean;
}

const texts = {
  youto: "用途地域",
  bouka: "防火指定",
  koudo: "高度地区",
  height: "建物高度",
};

const properties = {
  youto: { color: "error", text: texts.youto },
  koudo: { color: "warning", text: texts.koudo },
  bouka: { color: "info", text: texts.bouka },
  height: { color: "primary", text: texts.height },
} as const;

export const MapLayerToggleButton: React.FC<UseMapLayerToggleProps> = ({
  map,
  id,
  disabled = false,
}) => {
  const [buttonState, setButtonState] = useState(false);

  // マップがロードされたら、レイヤーの初期状態を確認
  useEffect(() => {
    if (!map) return;

    const checkMapReady = () => {
      // 初期状態を確認
      const layers = customLayers[id];
      let foundAnyLayer = false;
      
      for (const city in layers) {
        const layerId = layers[city as keyof typeof layers];
        if (map.getLayer(layerId)) {
          foundAnyLayer = true;
          const currentVisibility = map.getLayoutProperty(layerId, visibility);
          console.log(`Initial state of ${layerId}: ${currentVisibility || 'visible (default)'}`);
          // 初期状態がvisibleまたはundefinedの場合
          if (currentVisibility === "visible" || currentVisibility === undefined) {
            setButtonState(false); // visibleの時はcontainedボタン（押されていない状態）
          } else {
            setButtonState(true); // noneの時はoutlinedボタン（押された状態）
          }
          break; // 最初に見つかったレイヤーの状態を使用
        }
      }
      
      if (!foundAnyLayer) {
        console.log(`No layers found for category ${id} during initialization`);
      }
    };

    // style.loadイベントを使用
    const handleStyleLoad = () => {
      checkMapReady();
    };

    if (map.isStyleLoaded()) {
      checkMapReady();
    } else {
      map.on("style.load", handleStyleLoad);
    }

    return () => {
      map.off("style.load", handleStyleLoad);
    };
  }, [map, id]);

  const toggleLayers = (category: keyof typeof customLayers) => {
    if (!map) return;
    
    const layers = customLayers[category];
    const newVisibility = buttonState ? "visible" : "none";
    
    console.log(`Toggling ${category} layers to ${newVisibility}`);
    
    // すべてのレイヤーを同じ状態に設定
    let foundAnyLayer = false;
    for (const city in layers) {
      const layerId = layers[city as keyof typeof layers];
      // レイヤーが存在するか確認
      if (map.getLayer(layerId)) {
        console.log(`Setting layer ${layerId} to ${newVisibility}`);
        map.setLayoutProperty(layerId, visibility, newVisibility);
        foundAnyLayer = true;
      } else {
        console.log(`Layer ${layerId} not found in map`);
      }
    }
    
    // レイヤーが見つからなくてもボタンの状態は切り替える（デモ用）
    if (!foundAnyLayer) {
      console.warn(`No layers found for category ${category}. This is likely because the custom style layers are not loaded.`);
    }
    
    // ボタンの状態を反転
    setButtonState(!buttonState);
  };

  return (
    <Box>
      <CustomButton
        onClick={() => toggleLayers(id)}
        variant={buttonState ? "outlined" : "contained"}
        color={properties[id]["color"]}
        text={properties[id]["text"]}
        disabled={disabled}
      />
    </Box>
  );
};

export default MapLayerToggleButton;