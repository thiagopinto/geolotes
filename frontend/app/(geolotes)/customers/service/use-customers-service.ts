"use client";

import { useEffect, useState, useCallback } from "react";
import { ICustomer, IQueryCustomerParams } from "../interfaces/customer";
import { IPaginationResponse } from "@/app/interfaces/pagination";
import { fetchAuth } from "@/app/lib/fetchAuth";
import useQueryParams from "@/hooks/use-query-params";
import { isEqual } from "@/app/lib/utils";

const env = process.env;
const apiUrl = env.API_URL ? env.API_URL : env.NEXT_PUBLIC_API_URL;
const urn = "/customer";
const baseUrl = `${apiUrl}${urn}`;

const useCustomersService = ({
  initialData,
  initialQuery,
}: {
  initialData: IPaginationResponse<ICustomer>;
  initialQuery: IQueryCustomerParams;
}) => {
  // Usa o hook de query params
  const { queryParams, setQueryParams } = useQueryParams(initialQuery);

  // Estados locais para controle de usuários e status da requisição
  const [customers, setCustomers] = useState<IPaginationResponse<ICustomer> | null>(
    initialData
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Função para buscar usuários
  const fetchCustomers = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchAuth<IPaginationResponse<ICustomer>>(baseUrl, {
        query: queryParams.current, // Busca com os parâmetros atuais da URL
      });

      setCustomers(result);
    } catch (err) {
      setError("Ocorreu um erro inesperado.");
      setError(JSON.stringify(err));
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [queryParams]);

  // Chama `fetchCustomers` sempre que `queryParams` mudar
  useEffect(() => {
    if (!isEqual(initialQuery, queryParams.current)) {
      fetchCustomers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Atualiza os query params e dispara o fetch
  const updateQueryParams = (newParams: Partial<IQueryCustomerParams>) => {
    setQueryParams(newParams);
  };

  // Funções auxiliares para CRUD de usuários
  const createCustomer = async (customer: ICustomer) => {
    try {
      return await fetchAuth<ICustomer>(`${baseUrl}`, {
        method: "POST",
        body: JSON.stringify(customer),
      });
    } catch (error) {
      throw error;
    }
  };

  const updateCustomer = async (customer: ICustomer) => {
    try {
      return await fetchAuth<ICustomer>(`${baseUrl}/${customer.id}`, {
        method: "PATCH",
        body: JSON.stringify(customer),
      });
    } catch (error) {
      throw error;
    }
  };

  // Retorna os dados e funções para o componente
  return {
    customers,
    setCustomers,
    isLoading,
    error,
    queryParams,
    fetchCustomers,
    updateQueryParams,
    createCustomer,
    updateCustomer,
  };
};

export default useCustomersService;
