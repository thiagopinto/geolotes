"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { IUser } from "../../../interfaces/auth";
import { IPaginationResponse } from "../../../interfaces/pagination";
import { IQueryUserParams } from "../interfaces/user";
import useUsersService from "../service/use-users-service";
import UserTable from "./UserTable";
import UserHeadSearch from "./UserHeadSearch";
import Pagination from "@/app/components/Pagination";
import { useCallback, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export default function UserContent({
  initialData,
  initialQuery,
}: {
  initialData: IPaginationResponse<IUser>;
  initialQuery: IQueryUserParams;
}) {
  const {
    users,
    setUsers,
    updateQueryParams,
    isLoading,
    error,
    queryParams,
    fetchUsers,
    createUser,
    updateUser,
  } = useUsersService({
    initialData,
    initialQuery,
  });
  const { toast } = useToast();

  const refresh = useCallback(
    (newParams: Partial<IQueryUserParams>) => {
      updateQueryParams(newParams);
      fetchUsers();
    },
    [updateQueryParams, fetchUsers]
  );

  useEffect(() => {
    if (error) {
      toast({
        title: "Erro",
        description: error,
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  if (!users || !initialData) return <p>Api indisponível.</p>;
  //if (isLoading) return <p>Loading...</p>;
  //if (error) return <p>Error: {error}</p>;
  return (
    <Card className="w-full bg-white p-2">
      <CardHeader>
        <UserHeadSearch
          query={{ ...queryParams.current } as IQueryUserParams}
          updateQueryParams={refresh}
          createUser={createUser}
          setUsers={setUsers}
        />
      </CardHeader>
      <CardContent className="flex justify-between">
        <UserTable
          users={users ? users : initialData}
          isLoading={isLoading}
          updateUser={updateUser}
          query={queryParams.current as IQueryUserParams}
          refresh={refresh}
          setUsers={setUsers}
        />
      </CardContent>
      <CardFooter className="w-full justify-center">
        <Pagination meta={users.meta} updateQueryParams={refresh} />
      </CardFooter>
    </Card>
  );
}
