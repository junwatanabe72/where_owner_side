import React, { useEffect, useState } from "react";
import * as turf from "@turf/turf";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import ClickableMarker from "./ClickableMarker";
import Popup from "../../components/atoms/Popup";

interface Props {
  map: mapboxgl.Map | undefined;
  currentStore: LandProperty[];
}

const mapSourceIdName = "property-";

const layerOption = {
  type: "line",
  layout: {
    "line-cap": "round",
    "line-join": "round",
  },
  paint: {
    "line-color": "#ed6498",
    "line-width": 5,
    "line-opacity": 0.8,
  },
};

const PropertiesMarker: React.FC<Props> = ({ currentStore, map }) => {
  const [markers, setMarkers] = useState<ClickableMarker[]>([]);
  const [isOpen, setDialog] = useState(false);
  const [targetProperty, setTargetProperty] = useState<LandProperty>();

  const handleChange = (value: boolean) => {
    setDialog(value);
  };

  const addCircleLayerToMap = (
    map: mapboxgl.Map,
    geo: number[],
    idName: string,
    min: number
  ) => {
    const walk = 55;
    const _center = turf.point(geo);
    const _radius = min * walk * 0.001;
    const kilometers = "kilometers" as const;
    const _options = {
      steps: 50,
      units: kilometers,
    };
    const _circle = turf.circle(_center, _radius, _options);
    map.addSource(idName, {
      type: "geojson",
      data: _circle,
    });
    map.addLayer({
      ...layerOption,
      id: idName,
      source: idName,
    } as mapboxgl.AnyLayer);
  };

  const toggleVisibilityOfExistingLayer = (
    map: mapboxgl.Map,
    idName: string
  ) => {
    if (map.getLayer(idName)) {
      map.removeLayer(idName);
      return;
    }
    map.addLayer({
      ...layerOption,
      id: idName,
      source: idName,
    } as mapboxgl.AnyLayer);
    return;
  };

  const onClick = (
    map: mapboxgl.Map,
    property: LandProperty,
    geo: number[],
    idName: string
  ) => {
    const { nearStation } = property;
    const { min } = nearStation[0];
    console.log("click");
    setDialog(true);
    setTargetProperty(property);
    map.flyTo({
      center: geo as mapboxgl.LngLatLike,
      zoom: 13,
      essential: true,
    });

    if (!map.getSource(idName)) {
      addCircleLayerToMap(map, geo, idName, min);
      return;
    }
    toggleVisibilityOfExistingLayer(map, idName);
    return;
  };

  const determineMarkerColor = (raito: number) => {
    if (raito >= 900) return "red";
    if (raito >= 850) return "orange";
    if (raito >= 800) return "yellow";
    if (raito >= 750) return "green";
    if (raito >= 700) return "blue";
    return "purple";
  };

  useEffect(() => {
    if (!map || map === null) {
      return;
    }
    if (markers.length) {
      markers.forEach((marker) => marker.remove());
      setMarkers([]);
    }
    const currentMarkers = currentStore.map((property, num) => {
      const {
        nearStation,
        wood: { originalRaito },
      } = property;
      const { geometry } = nearStation[0];
      const geo = Object.values(geometry as { lat: number; lng: number })
        .map((v) => v)
        .sort((a, b) => b - a);
      const idName = `${mapSourceIdName}${num}`;
      return new ClickableMarker({ color: determineMarkerColor(originalRaito) })
        .setLngLat(geo as mapboxgl.LngLatLike)
        .onClick(() => onClick(map, property, geo, idName))
        .addTo(map);
    });
    setMarkers(currentMarkers);
    map.on("mouseenter", "places", () => {
      map.getCanvas().style.cursor = "pointer";
    });
    map.on("mouseleave", "places", () => {
      map.getCanvas().style.cursor = "";
    });
  }, [currentStore, map]);

  return (
    <>
      {targetProperty && (
        <Popup
          isOpen={isOpen}
          handleChange={handleChange}
          property={targetProperty}
        />
      )}
    </>
  );
};

export default PropertiesMarker;