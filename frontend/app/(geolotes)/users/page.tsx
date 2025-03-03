import UserContent from "./components/UserContent";
import { fetchUsers } from "./service/users-services";
import { IPaginationResponse, Order } from "@/app/interfaces/pagination";
import { IUser } from "@/app/interfaces/auth";
import { IQueryUserParams } from "./interfaces/user";

let users: IPaginationResponse<IUser> | null = null;
const initialQuery: IQueryUserParams = {
  page: 1,
  perPage: 10,
  orderBy: "id",
  order: Order.DESC,
  status: "true",
  keywordColumn: "name",
};

export default async function ClientsPage() {
  if (!users) users = await fetchUsers(initialQuery);

  if (!users)
    return (
      <div className="w-full h-full">
        <span>Api indisponivel</span>
      </div>
    );
  return (
    <div className="w-full h-full">
      <UserContent initialData={users} initialQuery={initialQuery} />
    </div>
  );
}
