import CustomerContent from "./components/CustomerContent";
import { IPaginationResponse, Order } from "@/app/interfaces/pagination";
import { ICustomer, IQueryCustomerParams } from "./interfaces/customer";
import { fetchCustomers } from "./service/customers-services";

let customers: IPaginationResponse<ICustomer> | null = null;
const initialQuery: IQueryCustomerParams = {
  page: 1,
  perPage: 10,
  orderBy: "id",
  order: Order.DESC,
  keywordColumn: "name",
};

export default async function CustomersPage() {
  if (!customers) customers = await fetchCustomers(initialQuery);

  if (!customers)
    return (
      <div className="w-full h-full">
        <span>Api indisponivel</span>
      </div>
    );
  return (
    <div className="w-full h-full">
      <CustomerContent initialData={customers} initialQuery={initialQuery} />
    </div>
  );
}
