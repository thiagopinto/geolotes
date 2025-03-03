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
import { formatarFone } from "@/app/lib/utils";
import { ICustomer } from "../interfaces/customer";
import CustomerDialog from "./CustomerDialog";

export default function CustomerTable({
  customers,
  isLoading,
  updateCustomer,
  query,
  refresh,
  setCustomers,
}: {
  customers?: IPaginationResponse<ICustomer>;
  isLoading: boolean;
  updateCustomer: (user: ICustomer) => Promise<ICustomer>;
  query: IQueryPaginationParams;
  refresh: (newParams: Partial<IQueryParams>) => void;
  setCustomers: Dispatch<SetStateAction<IPaginationResponse<ICustomer> | null>>;
}) {
  if (!customers) return <div>Api indisponivel</div>;
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
                  fieldName="document"
                  columnName="Documento"
                  query={query}
                  refresh={refresh}
                ></OrderButton>
              </TableHead>
              <TableHead>
                <OrderButton
                  fieldName="email"
                  columnName="Email"
                  query={query}
                  refresh={refresh}
                ></OrderButton>
              </TableHead>
              <TableHead>
                <OrderButton
                  fieldName="phone"
                  columnName="Telefone"
                  query={query}
                  refresh={refresh}
                ></OrderButton>
              </TableHead>
              <TableHead>
                <OrderButton
                  fieldName="address"
                  columnName="Endereço"
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
            {customers?.data.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>{customer.id}</TableCell>
                <TableCell>{customer.name}</TableCell>
                <TableCell>{customer.document}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{formatarFone(customer.phone)}</TableCell>
                <TableCell>{customer.address}</TableCell>
                <TableCell>
                  {new Date(customer.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {new Date(customer.updatedAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <CustomerDialog
                    customer={customer}
                    updateCustomer={updateCustomer}
                    setCustomers={setCustomers}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  );
}
