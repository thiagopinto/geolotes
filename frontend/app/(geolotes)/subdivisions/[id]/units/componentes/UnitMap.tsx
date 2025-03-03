"use client";
import React, { useEffect, useRef, useState } from "react";
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Draw, { DrawEvent } from "ol/interaction/Draw";
import Modify from "ol/interaction/Modify";
import Select, { SelectEvent } from "ol/interaction/Select";
import GeoJSON from "ol/format/GeoJSON";
import FullScreen from "ol/control/FullScreen.js";
import { defaults as defaultControls } from "ol/control/defaults.js";
import * as dotEnv from "dotenv";
import DrawControl from "@/app/components/ol/DrawControl";
import { Input } from "@/components/ui/input";
import { IGeometry } from "@/app/interfaces/geojson";
import { getCenter } from "ol/extent";
import { ISubdivision } from "../../../interfaces/subdivisions";
import { IUnit } from "../interfaces/unit";
import { createFeatureFromGeometry } from "@/app/(geolotes)/lib/geo";
import Fill from "ol/style/Fill";
import Style from "ol/style/Style";
import Stroke from "ol/style/Stroke";
import Text from "ol/style/Text";
import { Feature, Overlay } from "ol";
import { Geometry } from "ol/geom";
import { doubleClick, pointerMove } from "ol/events/condition";
import UnitMapPopup from "./UnitMapPopup";
import { Button } from "@/components/ui/button";

dotEnv.config();

interface UnitMapProps {
  subdivision?: ISubdivision;
  handleChangeGeoJson: (value: IUnit[]) => void;
  units?: IUnit[];
  deleteUnit: (id: string | number) => void;
}

export default function UnitMap({
  subdivision,
  handleChangeGeoJson,
  units,
  deleteUnit,
}: UnitMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<Map | null>(null);
  const vectorSource = useRef<VectorSource | null>(null);
  const vectorLayer = useRef<VectorLayer | null>(null);
  const selectedFeature = useRef<Feature<Geometry>>(null);
  const isDrawing = useRef(false);
  const container = useRef<HTMLDivElement>(null);
  const [popupCoordinate, setPopupCoordinate] = useState<
    [number, number] | null
  >(null);
  const draw = useRef<Draw | null>(null);
  const modify = useRef<Modify | null>(null);
  const select = useRef<Select | null>(null);
  const overlayRef = useRef<Overlay>(null);
  const drawControl = useRef<DrawControl | null>(null);

  const longitude = process.env.NEXT_PUBLIC_LONGITUDE
    ? parseFloat(process.env.NEXT_PUBLIC_LONGITUDE)
    : 0;
  const latitude = process.env.NEXT_PUBLIC_LATITUDE
    ? parseFloat(process.env.NEXT_PUBLIC_LATITUDE)
    : 0;
  const zoom = process.env.NEXT_PUBLIC_ZOOM
    ? parseFloat(process.env.NEXT_PUBLIC_ZOOM)
    : 2;

  const initialCenter: [number, number] = [longitude, latitude];

  useEffect(() => {
    if (!mapRef.current) return;

    const style = new Style({
      fill: new Fill({ color: "rgba(0, 0, 255, 0)" }), // Azul translúcido
      stroke: new Stroke({ color: "rgba(144, 144, 145, 0.53)", width: 2 }),
    });
    const source = new VectorSource();
    const layer = new VectorLayer({
      source: source,
      style: style,
    });

    let feature = null;
    let center = null;
    let extent = null;

    if (subdivision) {
      if (typeof subdivision.geojson === "string") {
        const geojson = JSON.parse(subdivision.geojson);
        feature = createFeatureFromGeometry(geojson);
      } else {
        feature = createFeatureFromGeometry(subdivision.geojson);
      }

      if (feature) {
        source.addFeature(feature);

        const polygon = feature.getGeometry();
        if (polygon) {
          extent = polygon.getExtent();
          center = getCenter(extent);
        }
      }
    }

    const newMap = new Map({
      controls: defaultControls().extend([new FullScreen()]),
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        layer,
      ],
      view: new View({
        center: center ? center : initialCenter,
        zoom,
        projection: "EPSG:4326",
      }),
    });

    setMap(newMap);

    if (extent) {
      newMap.getView().fit(extent, {
        padding: [50, 50, 50, 50],
        duration: 1000,
      });
    }

    return () => newMap.setTarget(undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!map) return;
    if (vectorLayer.current) map.removeLayer(vectorLayer.current);
    if (vectorLayer.current) map.addLayer(vectorLayer.current);

    console.log("Map initialized");

    initializeUnitLayer();

    const interactions = initializeInteractions();

    if (!interactions) return;

    /*     if (isDrawing) {
      enableDrawing();
    } else {
      disableDrawing();
    } */

    if (modify.current) map.addInteraction(modify.current);
    if (select.current) map.addInteraction(select.current);

    drawControl.current = new DrawControl({
      onToggle: () => {
        if (!isDrawing.current) {
          enableDrawing();
        } else {
          disableDrawing();
        }
        isDrawing.current = !isDrawing.current;
      },
      initialActive: isDrawing.current, // Passa o valor inicial de isDrawing
    });

    map.addControl(drawControl.current);

    if (units && vectorSource.current) {
      units.forEach((unit) => {
        let feature = null;
        if (typeof unit.geojson === "string") {
          const geojson = JSON.parse(unit.geojson);
          feature = createFeatureFromGeometry(geojson);
        } else {
          feature = createFeatureFromGeometry(unit.geojson);
        }

        if (!feature) return;
        feature.setId(unit.id);
        feature.set("name", unit.identifier);
        feature.setProperties({
          name: unit.identifier,
          id: unit.id,
        });

        feature.setStyle(
          new Style({
            fill: new Fill({ color: "rgba(0, 255, 0, 0.3)" }),
            stroke: new Stroke({ color: "green", width: 2 }),
            text: new Text({
              text: feature.get("name"),
              font: "14px Arial",
              fill: new Fill({ color: "#000" }),
              stroke: new Stroke({ color: "#fff", width: 2 }),
            }),
          })
        );

        if (feature && vectorSource.current) {
          vectorSource.current.addFeature(feature);
        }
      });
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Delete") {
        removeSelectedPolygon();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      disableDrawing();
      document.removeEventListener("keydown", handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map]);

  const initializeInteractions = () => {
    if (!vectorSource.current || !vectorLayer.current) return;

    draw.current = new Draw({
      source: vectorSource.current,
      type: "Polygon",
    });

    modify.current = new Modify({
      source: vectorSource.current,
    });

    select.current = new Select({
      condition: (event) => {
        return (
          doubleClick(event) && // Apenas no duplo clique
          !pointerMove(event) // Evita seleção ao passar o mouse
        );
      },
      layers: [vectorLayer.current],
      hitTolerance: 0,
    });

    draw.current.on("drawend", (event: DrawEvent) => {
      if (!map) return;

      disableDrawing();
      drawControl.current?.setActive(false);

      const feature = event.feature;
      feature.setStyle(
        new Style({
          fill: new Fill({ color: "rgba(0, 0, 255, 0)" }), // Azul translúcido
          stroke: new Stroke({ color: "rgba(144, 144, 145, 0.53)", width: 2 }),
        })
      );
      const geometry = feature.getGeometry();
      if (!geometry || geometry.getType() !== "Polygon") return;

      // Obtém o ponto central do polígono
      const extent = geometry.getExtent();
      const center = getCenter(extent);
      selectedFeature.current = feature;
      setPopupCoordinate(center as [number, number]);
      overlayRef.current?.setPosition(center as [number, number]);
    });
    modify.current.on("modifyend", () => {
      if (!map) return;
      if (vectorLayer.current) map.removeLayer(vectorLayer.current);
      if (vectorLayer.current) map.addLayer(vectorLayer.current);
    });

    select.current.on("select", (event: SelectEvent) => {
      const features = event.selected;
      console.log(features);
      if (features.length > 0) {
        const feature = features[0];

        feature.setStyle(
          new Style({
            stroke: new Stroke({
              color: "blue",
              width: 3,
            }),
            fill: new Fill({
              color: "rgba(0, 0, 255, 0.3)",
            }),
            text: new Text({
              text: feature.get("name"),
              font: "12px Calibri,sans-serif",
              fill: new Fill({
                color: "#000000",
              }),
              stroke: new Stroke({
                color: "#ffffff",
                width: 3,
              }),
            }),
          })
        );
        const geometry = feature.getGeometry();
        if (!geometry || geometry.getType() !== "Polygon") return;
        // Obtém o ponto central do polígono
        const extent = geometry.getExtent();
        const center = getCenter(extent);
        selectedFeature.current = feature;
        setPopupCoordinate(center as [number, number]);
        overlayRef.current?.setPosition(center as [number, number]);
      } else {
        selectedFeature.current = null;
        if (!map) return;
        if (vectorLayer.current) map.removeLayer(vectorLayer.current);
        if (vectorLayer.current) map.addLayer(vectorLayer.current);
      }
    });

    return { draw, modify, select };
  };

  const initializeUnitLayer = () => {
    if (!map) return;
    if (!vectorSource.current) {
      vectorSource.current = new VectorSource();
    }
    if (!vectorLayer.current) {
      vectorLayer.current = new VectorLayer({
        source: vectorSource.current,
      });
      map.addLayer(vectorLayer.current);
    }

    if (container.current) {
      overlayRef.current = new Overlay({
        element: container.current,
        autoPan: {
          animation: {
            duration: 250,
          },
        },
      });
      map.addOverlay(overlayRef.current);
    } else {
      console.error("Container element not found.");
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const geojsonText = e.target?.result as string;
        const format = new GeoJSON();

        const features = format.readFeatures(JSON.parse(geojsonText));

        if (!Array.isArray(features) || features.length === 0) {
          throw new Error("Invalid GeoJSON: No features found.");
        }

        vectorSource.current?.clear();
        vectorSource.current?.addFeatures(features);
      } catch (error: unknown) {
        console.error("Erro ao carregar GeoJSON:");
        console.error(error);
        alert(`Erro ao carregar GeoJSON:`);
      }
    };

    reader.readAsText(file);
  };

  const removeSelectedPolygon = () => {
    if (selectedFeature.current && vectorSource.current) {
      const id = selectedFeature.current.getId();
      if (!id) return;
      deleteUnit(id);
      vectorSource.current.removeFeature(selectedFeature.current);
      selectedFeature.current = null;
    } else {
      alert("Nenhum polígono selecionado!");
    }
  };

  const enableDrawing = () => {
    if (!map) return;
    if (draw.current) map.addInteraction(draw.current);
    if (modify.current) map.removeInteraction(modify.current);
    if (select.current) map.removeInteraction(select.current);
    isDrawing.current = true;
    drawControl.current?.setActive(true);
  };
  const disableDrawing = () => {
    if (!map) return;
    if (draw.current) map.removeInteraction(draw.current);
    if (modify.current) map.addInteraction(modify.current);
    if (select.current) map.addInteraction(select.current);
    isDrawing.current = false;
    drawControl.current?.setActive(false);
  };

  const handleSave = () => {
    if (!vectorSource.current) return;
    const features = vectorSource.current.getFeatures();
    if (features.length === 0) {
      alert("Nenhum polígono selecionado!");
      return;
    }

    const units = features.map((feature) => {
      const geometry = feature.getGeometry();
      if (!geometry) return;
      const geojson = new GeoJSON().writeGeometryObject(geometry);
      const id = feature.getId();
      return {
        id: id,
        identifier: feature.get("name"),
        geojson: geojson as IGeometry,
      };
    });

    if (!units) return;
    handleChangeGeoJson(units as IUnit[]);
  };

  return (
    <div className="w-full">
      <div className="mb-4 flex">
        <Input
          type="file"
          accept=".geojson"
          onChange={handleFileChange}
          className="mr-4"
        />
        <Button onClick={handleSave}>Salvar</Button>
      </div>
      <div ref={mapRef} style={{ width: "100%", height: "60vh" }} />

      <div ref={container}>
        <UnitMapPopup
          feature={selectedFeature.current}
          coordinate={popupCoordinate}
          onClose={() => {
            setPopupCoordinate(null);
            overlayRef.current?.setPosition(undefined);
          }}
          position={"right"}
        />
      </div>
    </div>
  );
}
