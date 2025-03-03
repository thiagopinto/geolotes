import TableSkeleton from "@/app/components/TableSkeleton";
import { IQueryParams } from "@/app/interfaces/fetch";
import {
  IPaginationResponse,
  IQueryPaginationParams,
} from "@/app/interfaces/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { OrderButton } from "@/app/components/table/OrderButton";
import { Dispatch, SetStateAction } from "react";
import { ISubdivision } from "../interfaces/subdivisions";
import SubdivisionDialog from "./SubdivisionDialog";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function CustomerTable({
  subdivisions,
  isLoading,
  updateSubdivision,
  query,
  refresh,
  setSubdivisions,
}: {
  subdivisions?: IPaginationResponse<ISubdivision>;
  isLoading: boolean;
  updateSubdivision: (user: ISubdivision) => Promise<ISubdivision>;
  query: IQueryPaginationParams;
  refresh: (newParams: Partial<IQueryParams>) => void;
  setSubdivisions: Dispatch<
    SetStateAction<IPaginationResponse<ISubdivision> | null>
  >;
}) {
  if (!subdivisions) return <div>Api indisponível</div>;
  return (
    <>
      {isLoading ? (
        <TableSkeleton />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <OrderButton
                  fieldName="id"
                  columnName="Id"
                  query={query}
                  refresh={refresh}
                ></OrderButton>
              </TableHead>
              <TableHead>
                <OrderButton
                  fieldName="name"
                  columnName="Nome"
                  query={query}
                  refresh={refresh}
                ></OrderButton>
              </TableHead>
              <TableHead>
                <OrderButton
                  fieldName="createdAt"
                  columnName="Criado"
                  query={query}
                  refresh={refresh}
                ></OrderButton>
              </TableHead>
              <TableHead>
                <OrderButton
                  fieldName="updatedAt"
                  columnName="Atualizado"
                  query={query}
                  refresh={refresh}
                ></OrderButton>
              </TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subdivisions?.data.map((subdivision) => (
              <TableRow key={subdivision.id}>
                <TableCell>{subdivision.id}</TableCell>
                <TableCell>{subdivision.name}</TableCell>
                <TableCell>
                  {new Date(subdivision.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {new Date(subdivision.updatedAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <div>
                      <SubdivisionDialog
                        subdivision={subdivision}
                        updateSubdivision={updateSubdivision}
                        setSubdivisions={setSubdivisions}
                      />
                    </div>
                    <div>
                      <Link
                        href={`/subdivisions/${subdivision.id}/units`}
                        className={buttonVariants({ variant: "secondary" })}
                      >
                        Lotes
                      </Link>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  );
}
