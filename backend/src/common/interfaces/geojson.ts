// geojson.interfaces.ts

export interface ICoordinate {
  0: number; // Longitude
  1: number; // Latitude
}

export type IGeometry =
  | { type: 'Point'; coordinates: ICoordinate }
  | { type: 'MultiPoint'; coordinates: ICoordinate[] }
  | { type: 'LineString'; coordinates: ICoordinate[] }
  | { type: 'MultiLineString'; coordinates: ICoordinate[][] }
  | { type: 'Polygon'; coordinates: ICoordinate[][] } // Array of LinearRings (arrays of ICoordinates)
  | { type: 'MultiPolygon'; coordinates: ICoordinate[][][] } // Array of arrays of LinearRings
  | { type: 'GeometryCollection'; geometries: IGeometry[] }; // Array of IGeometry objects

export interface IFeature {
  type: 'Feature';
  geometry: IGeometry;
  properties: { [key: string]: unknown } | null;
  id?: string | number;
}

export interface IFeatureCollection {
  type: 'FeatureCollection';
  features: IFeature[];
}
