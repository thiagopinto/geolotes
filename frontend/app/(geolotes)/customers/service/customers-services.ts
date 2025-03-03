import { ICustomer, IQueryCustomerParams } from "../interfaces/customer";
import { IPaginationResponse } from "@/app/interfaces/pagination";
import { fetchAuth } from "@/app/lib/fetchAuth";
const env = process.env;

const apiUrl = env.API_URL
    ? env.API_URL
    : env.NEXT_PUBLIC_API_URL;

const urn = "/customer";
const baseUrl = `${apiUrl}${urn}`;

export const fetchCustomers = async (initialQuery: IQueryCustomerParams) => {
    try {
        const result = await fetchAuth<IPaginationResponse<ICustomer>>(`${baseUrl}`, {
            query: initialQuery,
        });
        return result;
    } catch (error) {
        throw error;
    }
}