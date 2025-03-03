import { IQueryUnitParams, IUnit } from "./interfaces/unit";
import { fetchAuth } from "@/app/lib/fetchAuth";
import UnitContent from "./componentes/UnitContent";
import { ISubdivision } from "../../interfaces/subdivisions";
const env = process.env;

const apiUrl = env.API_URL ? env.API_URL : env.NEXT_PUBLIC_API_URL;

export const fetchUnits = async (initialQuery: IQueryUnitParams) => {
  try {
    const result = await fetchAuth<IUnit[]>(
      `${apiUrl}/unit`,
      {
        query: initialQuery,
      }
    );
    return result;
  } catch (error) {
    throw error;
  }
};

export const fetchSubdivision = async (id: number | string) => {
  try {
    const result = await fetchAuth<ISubdivision>(`${apiUrl}/subdivision/${id}`);
    return result;
  } catch (error) {
    throw error;
  }
};

let subdivision: ISubdivision | null = null;
let units: IUnit[] | null = null;
const initialQuery: IQueryUnitParams = {};

export default async function Page({ params }: { params: { id: string } }) {
  const id = (await params).id;
  subdivision = await fetchSubdivision(id);
  units = await fetchUnits({ ...initialQuery, subdivisionId: id });

  if (!units || !subdivision)
    return (
      <div className="w-full h-full">
        <span>Api indisponível</span>
      </div>
    );

  return (
    <div className="w-full h-full">
      <UnitContent
        subdivision={subdivision}
        initialData={units}
        initialQuery={{ ...initialQuery, subdivisionId: id }}
      />
    </div>
  );
}
