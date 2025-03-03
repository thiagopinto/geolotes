"use client";

import { useEffect, useState, useCallback } from "react";
import { ISubdivision, IQuerySubdivisionParams} from "../interfaces/subdivisions";
import { IPaginationResponse } from "@/app/interfaces/pagination";
import { fetchAuth } from "@/app/lib/fetchAuth";
import useQueryParams from "@/hooks/use-query-params";
import { isEqual } from "@/app/lib/utils";

const env = process.env;
const apiUrl = env.API_URL ? env.API_URL : env.NEXT_PUBLIC_API_URL;
const urn = "/subdivision";
const baseUrl = `${apiUrl}${urn}`;

const useSubdivisionsService = ({
  initialData,
  initialQuery,
}: {
  initialData: IPaginationResponse<ISubdivision>;
  initialQuery: IQuerySubdivisionParams;
}) => {
  // Usa o hook de query params
  const { queryParams, setQueryParams } = useQueryParams(initialQuery);

  // Estados locais para controle de usuários e status da requisição
  const [subdivisions, setSubdivisions] = useState<IPaginationResponse<ISubdivision> | null>(
    initialData
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Função para buscar usuários
  const fetchSubdivisions = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchAuth<IPaginationResponse<ISubdivision>>(baseUrl, {
        query: queryParams.current, // Busca com os parâmetros atuais da URL
      });

      setSubdivisions(result);
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
      fetchSubdivisions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Atualiza os query params e dispara o fetch
  const updateQueryParams = (newParams: Partial<IQuerySubdivisionParams>) => {
    setQueryParams(newParams);
  };

  // Funções auxiliares para CRUD de usuários
  const createSubdivision = async (customer: ISubdivision) => {
    try {
      return await fetchAuth<ISubdivision>(`${baseUrl}`, {
        method: "POST",
        body: JSON.stringify(customer),
      });
    } catch (error) {
      throw error;
    }
  };

  const updateSubdivision = async (customer: ISubdivision) => {
    try {
      return await fetchAuth<ISubdivision>(`${baseUrl}/${customer.id}`, {
        method: "PATCH",
        body: JSON.stringify(customer),
      });
    } catch (error) {
      throw error;
    }
  };

  // Retorna os dados e funções para o componente
  return {
    subdivisions,
    setSubdivisions,
    isLoading,
    error,
    queryParams,
    fetchSubdivisions,
    updateQueryParams,
    createSubdivision,
    updateSubdivision,
  };
};

export default useSubdivisionsService;
