"use client";

import { useEffect, useState, useCallback } from "react";
import { IUnit, IQueryUnitParams } from "../interfaces/unit";
import { fetchAuth } from "@/app/lib/fetchAuth";
import useQueryParams from "@/hooks/use-query-params";
import { isEqual } from "@/app/lib/utils";
import { toast } from "@/hooks/use-toast";

const env = process.env;
const apiUrl = env.API_URL ? env.API_URL : env.NEXT_PUBLIC_API_URL;
const urn = "/unit";
const baseUrl = `${apiUrl}${urn}`;

const useUnitsService = ({
  initialData,
  initialQuery,
}: {
  initialData: IUnit[];
  initialQuery: Record<string, unknown>;
}) => {
  // Usa o hook de query params
  const { queryParams, setQueryParams } = useQueryParams(initialQuery);

  // Estados locais para controle de usuários e status da requisição
  const [units, setUnits] = useState<IUnit[] | null>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Função para buscar usuários
  const fetchUnits = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchAuth<IUnit[]>(baseUrl, {
        query: queryParams.current, // Busca com os parâmetros atuais da URL
      });

      setUnits(result);
    } catch (err) {
      setError("Ocorreu um erro inesperado.");
      setError(JSON.stringify(err));
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [queryParams]);

  // Chama `fetchUnits` sempre que `queryParams` mudar
  useEffect(() => {
    if (!isEqual(initialQuery, queryParams.current)) {
      fetchUnits();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Atualiza os query params e dispara o fetch
  const updateQueryParams = (newParams: Partial<IQueryUnitParams>) => {
    setQueryParams(newParams);
  };

  // Funções auxiliares para CRUD de usuários
  const createUnit = async (unit: IUnit) => {
    try {
      const newUnit = await fetchAuth<IUnit>(`${baseUrl}`, {
        method: "POST",
        body: JSON.stringify(unit),
      });

      setUnits((prev) => {
        if (!prev) return null;
        return [...prev, newUnit];
      });

      toast({
        title: "Sucesso",
        description: "Unidade salva!",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: `${error}`,
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateUnit = async (unit: IUnit) => {
    try {
      const updateUnit = await fetchAuth<IUnit>(`${baseUrl}/${unit.id}`, {
        method: "PATCH",
        body: JSON.stringify(unit),
      });

      setUnits((prev) => {
        if (!prev) return null;
        return prev.map((u) => {
          if (u.id === updateUnit.id) {
            return updateUnit;
          }
          return u;
        });
      });

      toast({
        title: "Sucesso",
        description: "Unidade atualizada!",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: `${error}`,
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteUnit = async (id: string | number) => {
    try {
      await fetchAuth(`${baseUrl}/${id}`, {
        method: "DELETE",
      });
      setUnits((prev) => {
        if (!prev) return null;
        return prev.filter((u) => u.id !== id);
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: `${error}`,
        variant: "destructive",
      });
      throw error;
    }
  };

  // Retorna os dados e funções para o componente
  return {
    units,
    setUnits,
    isLoading,
    error,
    queryParams,
    fetchUnits,
    updateQueryParams,
    createUnit,
    updateUnit,
    deleteUnit
  };
};

export default useUnitsService;
