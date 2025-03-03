import { IQueryParams } from "./fetch";

export interface IMeta {
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
  firstPage: number;
  lastPage: number;
}

export enum Order {
  ASC = "asc",
  DESC = "desc",
}

export interface IQueryPaginationParams extends IQueryParams {
  page: number; // Número da página
  perPage: number; // Número de itens por página
  orderBy: string; // Campo para ordenação
  order: Order; // Ordem decrescente ou não
}

export interface IPaginationResponse<T> {
  data: T[];
  meta: IMeta;
};
