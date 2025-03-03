import { IGeometry } from "@/app/interfaces/geojson";

export interface IQueryUnitParams extends Record<string, unknown> {
  subdivisionId?: string | number; // ID da subdivisão
}

export interface IUnit {
  id: string;
  identifier: string;
  subdivisionId: number | string;
  geojson: IGeometry | string;
  createdAt: string;
  updatedAt: string;
}
