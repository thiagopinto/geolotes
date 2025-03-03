import { IGeometry } from "@/app/interfaces/geojson";
import { Feature } from "ol";
import { GeoJSON } from "ol/format";
import { Geometry } from "ol/geom";

/**
 * Converte uma geometria GeoJSON em uma OpenLayers Feature.
 * @param {GeoJSON.GeometryObject} geometry - Objeto GeoJSON da geometria (Point, LineString, Polygon, etc.).
 * @returns {Feature<Geometry> | null} - Feature do OpenLayers ou null se a geometria for inválida.
 */
export function createFeatureFromGeometry(
  geometry: IGeometry
): Feature<Geometry> | null {
  if (!geometry || !geometry.type) {
    console.error("A geometria fornecida é inválida:", geometry);
    return null;
  }

  return new GeoJSON().readFeature({
    type: "Feature",
    geometry: geometry,
  }) as Feature<Geometry>;
}
