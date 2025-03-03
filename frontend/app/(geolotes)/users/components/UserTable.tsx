import TableSkeleton from "@/app/components/TableSkeleton";
import { IUser } from "@/app/interfaces/auth";
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
import UserDialog from "./UserDialog";
import UserPasswordDialog from "./UserPasswordDialog";
import { OrderButton } from "@/app/components/table/OrderButton";
import { Dispatch, SetStateAction } from "react";
import { formatarFone } from "@/app/lib/utils";

export default function UserTable({
  users,
  isLoading,
  updateUser,
  query,
  refresh,
  setUsers,
}: {
  users?: IPaginationResponse<IUser>;
  isLoading: boolean;
  updateUser: (user: IUser) => Promise<IUser>;
  query: IQueryPaginationParams;
  refresh: (newParams: Partial<IQueryParams>) => void;
  setUsers: Dispatch<SetStateAction<IPaginationResponse<IUser> | null>>;
}) {
  if (!users) return <div>Api indisponivel</div>;
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
                  fieldName="isActive"
                  columnName="Ativo"
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
            {users?.data.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{formatarFone(user.phone)}</TableCell>
                <TableCell>{user.isActive ? "Yes" : "No"}</TableCell>
                <TableCell>
                  {new Date(user.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {new Date(user.updatedAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <UserDialog
                    user={user}
                    updateUser={updateUser}
                    setUsers={setUsers}
                  />
                  <UserPasswordDialog user={user} updateUser={updateUser} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  );
}
