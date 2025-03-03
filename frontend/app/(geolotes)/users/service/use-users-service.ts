"use client";

import { useEffect, useState, useCallback } from "react";
import { IUser } from "@/app/interfaces/auth";
import { IQueryUserParams } from "../interfaces/user";
import { IPaginationResponse } from "@/app/interfaces/pagination";
import { fetchAuth } from "@/app/lib/fetchAuth";
import useQueryParams from "@/hooks/use-query-params";
import { isEqual } from "@/app/lib/utils";

const env = process.env;
const apiUrl = env.API_URL ? env.API_URL : env.NEXT_PUBLIC_API_URL;
const urn = "/user";
const baseUrl = `${apiUrl}${urn}`;

const useUsersService = ({
  initialData,
  initialQuery,
}: {
  initialData: IPaginationResponse<IUser>;
  initialQuery: IQueryUserParams;
}) => {
  // Usa o hook de query params
  const { queryParams, setQueryParams } = useQueryParams(initialQuery);

  // Estados locais para controle de usuários e status da requisição
  const [users, setUsers] = useState<IPaginationResponse<IUser> | null>(
    initialData
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Função para buscar usuários
  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchAuth<IPaginationResponse<IUser>>(baseUrl, {
        query: queryParams.current, // Busca com os parâmetros atuais da URL
      });

      setUsers(result);
    } catch (err) {
      setError("Ocorreu um erro inesperado.");
      setError(JSON.stringify(err));
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [queryParams]);

  // Chama `fetchUsers` sempre que `queryParams` mudar
  useEffect(() => {
    if (!isEqual(initialQuery, queryParams.current)) {
      fetchUsers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Atualiza os query params e dispara o fetch
  const updateQueryParams = (newParams: Partial<IQueryUserParams>) => {
    setQueryParams(newParams);
  };

  // Funções auxiliares para CRUD de usuários
  const createUser = async (user: IUser) => {
    try {
      return await fetchAuth<IUser>(`${baseUrl}`, {
        method: "POST",
        body: JSON.stringify(user),
      });
    } catch (error) {
      throw error;
    }
  };

  const updateUser = async (user: IUser) => {
    try {
      return await fetchAuth<IUser>(`${baseUrl}/${user.id}`, {
        method: "PATCH",
        body: JSON.stringify(user),
      });
    } catch (error) {
      throw error;
    }
  };

  const updatePassword = async (user: IUser) => {
    try {
      return await fetchAuth<IUser>(`${baseUrl}/${user.id}`, {
        method: "PATCH",
        body: JSON.stringify(user),
      });
    } catch (error) {
      throw error;
    }
  };

  // Retorna os dados e funções para o componente
  return {
    users,
    setUsers,
    isLoading,
    error,
    queryParams,
    fetchUsers,
    updateQueryParams,
    createUser,
    updateUser,
    updatePassword,
  };
};

export default useUsersService;
