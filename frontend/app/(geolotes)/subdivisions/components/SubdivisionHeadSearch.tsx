import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { ISubdivision, IQuerySubdivisionParams } from "../interfaces/subdivisions";
import SubdivisionDialog from "./SubdivisionDialog";
import { IPaginationResponse } from "@/app/interfaces/pagination";
import { Dispatch, SetStateAction } from "react";

export default function CustomerHeadSearch({
  query,
  updateQueryParams,
  createSubdivision,
  setSubdivisions,
}: {
  query: IQuerySubdivisionParams;
  updateQueryParams: (newParams: Partial<IQuerySubdivisionParams>) => void;
  createSubdivision: (user: ISubdivision) => Promise<ISubdivision>;
  setSubdivisions: Dispatch<SetStateAction<IPaginationResponse<ISubdivision> | null>>
}) {
  const handleKeywordChange = (value: string) => {
    updateQueryParams({ keyword: value, page: 1 });
  };

  return (
    <div className="flex items-center justify-between p-4">
      <div>
        <h2 className="text-2xl font-semibold text-gray-700">Loteamentos</h2>
      </div>
      <div className="flex items-center">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            defaultValue={query.keyword}
            placeholder="Buscar"
            onChange={(e) => handleKeywordChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <SubdivisionDialog createSubdivision={createSubdivision} setSubdivisions={setSubdivisions} />
      </div>
    </div>
  );
};

