"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { IPaginationResponse } from "../../../interfaces/pagination";
import {
  ISubdivision,
  IQuerySubdivisionParams,
} from "../interfaces/subdivisions";
import SubdivisionTable from "./SubdivisionTable";
import UserHeadSearch from "./SubdivisionHeadSearch";
import Pagination from "@/app/components/Pagination";
import { useCallback, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import useSubdivisionsService from "../service/use-subdivisions-service";

export default function SubdivisionContent({
  initialData,
  initialQuery,
}: {
  initialData: IPaginationResponse<ISubdivision>;
  initialQuery: IQuerySubdivisionParams;
}) {
  const {
    subdivisions,
    setSubdivisions,
    isLoading,
    error,
    queryParams,
    fetchSubdivisions,
    updateQueryParams,
    createSubdivision,
    updateSubdivision,
  } = useSubdivisionsService({
    initialData,
    initialQuery,
  });
  const { toast } = useToast();

  const refresh = useCallback(
    (newParams: Partial<IQuerySubdivisionParams>) => {
      updateQueryParams(newParams);
      fetchSubdivisions();
    },
    [updateQueryParams, fetchSubdivisions]
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

  if (!subdivisions || !initialData) return <p>Api indisponível.</p>;
  //if (isLoading) return <p>Loading...</p>;
  //if (error) return <p>Error: {error}</p>;
  return (
    <Card className="w-full bg-white p-2">
      <CardHeader>
        <UserHeadSearch
          query={{ ...queryParams.current } as IQuerySubdivisionParams}
          updateQueryParams={refresh}
          createSubdivision={createSubdivision}
          setSubdivisions={setSubdivisions}
        />
      </CardHeader>
      <CardContent className="flex justify-between">
        <SubdivisionTable
          subdivisions={subdivisions ? subdivisions : initialData}
          isLoading={isLoading}
          updateSubdivision={updateSubdivision}
          query={queryParams.current as IQuerySubdivisionParams}
          refresh={refresh}
          setSubdivisions={setSubdivisions}
        />
      </CardContent>
      <CardFooter className="w-full justify-center">
        <Pagination meta={subdivisions.meta} updateQueryParams={refresh} />
      </CardFooter>
    </Card>
  );
}
