import { IUser } from "@/app/interfaces/auth";
import { IQueryUserParams } from "../interfaces/user";
import { IPaginationResponse } from "@/app/interfaces/pagination";
import { fetchAuth } from "@/app/lib/fetchAuth";
const env = process.env;

const apiUrl = env.API_URL
    ? env.API_URL
    : env.NEXT_PUBLIC_API_URL;

const urn = "/user";
const baseUrl = `${apiUrl}${urn}`;

export const fetchUsers = async (initialQuery: IQueryUserParams) => {
    try {
        const result = await fetchAuth<IPaginationResponse<IUser>>(`${baseUrl}`, {
            query: initialQuery,
        });
        return result;
    } catch (error) {
        throw error;
    }
}