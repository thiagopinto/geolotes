import { IQueryPaginationParams } from "@/app/interfaces/pagination";

export interface IQueryCustomerParams extends IQueryPaginationParams {
  keyword?: string; // Palavra-chave de busca
  keywordColumn?: string; // Coluna específica para busca (ou null)
}

export interface ICustomer {
  id: string;
  name: string;
  document: string;
  email: string;
  phone: string;
  address: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  postalCode: string;
  createdAt: string;
  updatedAt: string;
}