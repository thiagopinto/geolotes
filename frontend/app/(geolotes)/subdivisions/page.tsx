import SubdivisionContent from "./components/SubdivisionContent";
import { IPaginationResponse, Order } from "@/app/interfaces/pagination";
import { ISubdivision, IQuerySubdivisionParams } from "./interfaces/subdivisions";
import { fetchAuth } from "@/app/lib/fetchAuth";
const env = process.env;

const apiUrl = env.API_URL
    ? env.API_URL
    : env.NEXT_PUBLIC_API_URL;

let subdivisions: IPaginationResponse<ISubdivision> | null = null;
const initialQuery: IQuerySubdivisionParams = {
  page: 1,
  perPage: 10,
  orderBy: "id",
  order: Order.DESC,
  keywordColumn: "name",
};

const urn = "/subdivision";
const baseUrl = `${apiUrl}${urn}`;

export const fetchSubdivisions = async (initialQuery: IQuerySubdivisionParams) => {
    try {
        const result = await fetchAuth<IPaginationResponse<ISubdivision>>(`${baseUrl}`, {
            query: initialQuery,
        });
        return result;
    } catch (error) {
        throw error;
    }
}

export default async function SubdivisionPage() {
  if (!subdivisions) subdivisions = await fetchSubdivisions(initialQuery);

  if (!subdivisions)
    return (
      <div className="w-full h-full">
        <span>Api indisponível</span>
      </div>
    );
  return (
    <div className="w-full h-full">
      <SubdivisionContent initialData={subdivisions} initialQuery={initialQuery} />
    </div>
  );
}
