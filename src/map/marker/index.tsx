import React, { useEffect, useState, useCallback, useRef } from "react";
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
  const [isOpen, setDialog] = useState(false);
  const [targetProperty, setTargetProperty] = useState<LandProperty>();
  const [isMapReady, setIsMapReady] = useState(false);
  const markersRef = useRef<ClickableMarker[]>([]);

  useEffect(() => {
    if (!map) {
      setIsMapReady(false);
      return;
    }

    if (map.isStyleLoaded()) {
      setIsMapReady(true);
      return;
    }

    setIsMapReady(false);
    const handleLoad = () => {
      setIsMapReady(true);
    };

    map.once("load", handleLoad);
    return () => {
      map.off("load", handleLoad);
    };
  }, [map]);

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

  const handleMarkerClick = useCallback((property: LandProperty, geo: number[], idName: string) => {
    if (!map) return;
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
  }, [map]);

  const determineMarkerColor = (raito: number) => {
    if (raito >= 900) return "red";
    if (raito >= 850) return "orange";
    if (raito >= 800) return "yellow";
    if (raito >= 750) return "green";
    if (raito >= 700) return "blue";
    return "purple";
  };

  useEffect(() => {
    if (!map || !isMapReady) {
      return;
    }

    if (markersRef.current.length) {
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
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
        .onClick(() => handleMarkerClick(property, geo, idName))
        .addTo(map);
    });

    markersRef.current = currentMarkers;

    const handleMouseEnter = () => {
      map.getCanvas().style.cursor = "pointer";
    };
    const handleMouseLeave = () => {
      map.getCanvas().style.cursor = "";
    };

    map.on("mouseenter", "places", handleMouseEnter);
    map.on("mouseleave", "places", handleMouseLeave);

    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
      map.off("mouseenter", "places", handleMouseEnter);
      map.off("mouseleave", "places", handleMouseLeave);
    };
  }, [currentStore, isMapReady, map, handleMarkerClick]);

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
