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
import Modify, { ModifyEvent } from "ol/interaction/Modify";
import GeoJSON from "ol/format/GeoJSON";
import FullScreen from "ol/control/FullScreen.js";
import { defaults as defaultControls } from "ol/control/defaults.js";
import * as dotEnv from "dotenv";
import DrawControl from "@/app/components/ol/DrawControl";
import { Input } from "@/components/ui/input";
import { IGeometry } from "@/app/interfaces/geojson";
import { ISubdivision } from "../interfaces/subdivisions";
import { createFeatureFromGeometry } from "../../lib/geo";
import { getCenter } from "ol/extent";

dotEnv.config();

interface SubdivisionMapProps {
  handleChangeGeoJson: (value: IGeometry) => void;
  subdivision?: ISubdivision;
}

export default function SubdivisionMap({
  handleChangeGeoJson,
  subdivision,
}: SubdivisionMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<Map | null>(null);
  const [geojson, setGeojson] = useState<IGeometry | null>(null); // Tipo 'any' para GeoJSON, mas considere um tipo mais específico
  const vectorSource = useRef<VectorSource | null>(null);
  const vectorLayer = useRef<VectorLayer | null>(null);
  const isDrawing = useRef(false);

  const longitude = process.env.NEXT_PUBLIC_LONGITUDE
    ? parseFloat(process.env.NEXT_PUBLIC_LONGITUDE)
    : 0;
  const latitude = process.env.NEXT_PUBLIC_LATITUDE
    ? parseFloat(process.env.NEXT_PUBLIC_LATITUDE)
    : 0;
  const zoom = process.env.NEXT_PUBLIC_ZOOM
    ? parseFloat(process.env.NEXT_PUBLIC_ZOOM)
    : 2;

  const center: [number, number] = [longitude, latitude];

  useEffect(() => {
    if (!mapRef.current) return;

    const newMap = new Map({
      controls: defaultControls().extend([new FullScreen()]),
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center,
        zoom,
        projection: "EPSG:4326",
      }),
    });

    setMap(newMap);

    return () => newMap.setTarget(undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (map) {
      if (!vectorSource.current && !vectorLayer.current) {
        vectorSource.current = new VectorSource();
        vectorLayer.current = new VectorLayer({
          source: vectorSource.current,
        });
        map.addLayer(vectorLayer.current);
      }

      if (!vectorSource.current || !vectorLayer.current) return;
      //map.addLayer(vectorLayer.current);

      const draw = new Draw({
        source: vectorSource.current,
        type: "Polygon",
      });

      const modify = new Modify({
        source: vectorSource.current,
      });

      map.addInteraction(draw);
      map.addInteraction(modify);

      draw.on("drawstart", () => {
        vectorSource.current?.clear();
      });

      draw.on("drawend", (event: DrawEvent) => {
        const feature = event.feature;
        const geometry = feature.getGeometry();
        if (!geometry) return;
        const geojson = new GeoJSON().writeGeometryObject(geometry);
        console.log(geojson);
        setGeojson(geojson);

        // Aguarda 10ms (ajuste este valor conforme necessário)
      });

      modify.on("modifyend", (event: ModifyEvent) => {
        const features = event.features.getArray(); // Converte a Collection em um array
        if (features.length === 0) return;
        const feature = features[0];
        const geometry = feature.getGeometry();
        if (!geometry) return;
        const geojson = new GeoJSON().writeGeometryObject(geometry);
        setGeojson(geojson);
      });

      const drawControl = new DrawControl({
        onToggle: () => {
          if (!isDrawing.current) {
            map.addInteraction(draw);
            map.removeInteraction(modify);
          } else {
            map.removeInteraction(draw);
            map.addInteraction(modify);
          }
          isDrawing.current = !isDrawing.current;
        },
        initialActive: isDrawing.current, // Passa o valor inicial de isDrawing
      });

      map.addControl(drawControl);

      if (subdivision && vectorSource.current) {
        let feature = null;

        if (typeof subdivision.geojson === "string") {
          const geojson = JSON.parse(subdivision.geojson);
          feature = createFeatureFromGeometry(geojson);
        } else {
          feature = createFeatureFromGeometry(subdivision.geojson);
        }

        if (feature) {
          vectorSource.current.addFeature(feature);
        }

        const polygon = feature?.getGeometry();
        if (polygon) {
          const extent = polygon.getExtent();
          const center = getCenter(extent);
          map.getView().setCenter(center);
          map.getView().fit(extent, {
            padding: [50, 50, 50, 50], // Adiciona um espaço extra ao redor
            duration: 1000, // Animação de 1 segundo
          });
        }
      }

      return () => {
        map.removeInteraction(draw);
        map.removeInteraction(modify);
      };
    }
  }, [map, subdivision]); // Remova vectorSource daqui, pois ele é definido dentro do efeito

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return; // Sai da função se nenhum arquivo foi selecionado
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const geojsonText = e.target?.result as string; // Texto do arquivo GeoJSON
        const format = new GeoJSON();

        // Tenta ler as features. Se houver erro, lança exceção.
        const features = format.readFeatures(JSON.parse(geojsonText));

        if (!Array.isArray(features) || features.length === 0) {
          throw new Error("Invalid GeoJSON: No features found.");
        }

        vectorSource.current?.clear(); // Limpa as features existentes
        vectorSource.current?.addFeatures(features); // Adiciona as novas features

        // Se precisar do objeto GeoJSON, parse *depois* de ler as features
        const geojson = JSON.parse(geojsonText);
        setGeojson(geojson);
      } catch (error: unknown) {
        console.error("Erro ao carregar GeoJSON:");
        console.error(error);
        alert(`Erro ao carregar GeoJSON:`); // Exemplo: exibir um alerta
      }
    };
  };

  useEffect(() => {
    if (geojson) {
      handleChangeGeoJson(geojson);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geojson]);

  return (
    <div>
      <div className="mb-4">
        <Input type="file" accept=".geojson" onChange={handleFileChange} />
      </div>
      <div ref={mapRef} style={{ width: "100%", height: "60vh" }} />
    </div>
  );
}
