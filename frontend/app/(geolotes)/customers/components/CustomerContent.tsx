"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { IPaginationResponse } from "../../../interfaces/pagination";
import { ICustomer, IQueryCustomerParams } from "../interfaces/customer";
import CustomerTable from "./CustomerTable";
import UserHeadSearch from "./CustomerHeadSearch";
import Pagination from "@/app/components/Pagination";
import { useCallback, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import useCustomersService from "../service/use-customers-service";

export default function CustomerContent({
  initialData,
  initialQuery,
}: {
  initialData: IPaginationResponse<ICustomer>;
  initialQuery: IQueryCustomerParams;
}) {
  const {
    customers,
    setCustomers,
    updateQueryParams,
    isLoading,
    error,
    queryParams,
    fetchCustomers,
    createCustomer,
    updateCustomer,
  } = useCustomersService({
    initialData,
    initialQuery,
  });
  const { toast } = useToast();

  const refresh = useCallback(
    (newParams: Partial<IQueryCustomerParams>) => {
      updateQueryParams(newParams);
      fetchCustomers();
    },
    [updateQueryParams, fetchCustomers]
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

  if (!customers || !initialData) return null;
  //if (isLoading) return <p>Loading...</p>;
  //if (error) return <p>Error: {error}</p>;
  return (
    <Card className="w-full bg-white p-2">
      <CardHeader>
        <UserHeadSearch
          query={{ ...queryParams.current } as IQueryCustomerParams}
          updateQueryParams={refresh}
          createCustomer={createCustomer}
          setCustomers={setCustomers}
        />
      </CardHeader>
      <CardContent className="flex justify-between">
        <CustomerTable
          customers={customers ? customers : initialData}
          isLoading={isLoading}
          updateCustomer={updateCustomer}
          query={queryParams.current as IQueryCustomerParams}
          refresh={refresh}
          setCustomers={setCustomers}
        />
      </CardContent>
      <CardFooter className="w-full justify-center">
        <Pagination meta={customers.meta} updateQueryParams={refresh} />
      </CardFooter>
    </Card>
  );
}
