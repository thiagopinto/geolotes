import { IGeometry } from "@/app/interfaces/geojson";
import { IQueryPaginationParams } from "@/app/interfaces/pagination";

export interface IQuerySubdivisionParams extends IQueryPaginationParams {
  keyword?: string; // Palavra-chave de busca
  keywordColumn?: string; // Coluna específica para busca (ou null)
}

export interface ISubdivision {
  id: string;
  name: string;
  geojson: IGeometry | string;
  createdAt: string;
  updatedAt: string;
}