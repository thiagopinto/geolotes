import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Search } from "lucide-react";
import { IQueryUserParams } from "../interfaces/user";
import UserDialog from "./UserDialog";
import { IUser } from "@/app/interfaces/auth";
import { IPaginationResponse } from "@/app/interfaces/pagination";
import { Dispatch, SetStateAction } from "react";

export default function UserHeadSearch({
  query,
  updateQueryParams,
  createUser,
  setUsers,
}: {
  query: IQueryUserParams;
  updateQueryParams: (newParams: Partial<IQueryUserParams>) => void;
  createUser: (user: IUser) => Promise<IUser>;
  setUsers: Dispatch<SetStateAction<IPaginationResponse<IUser> | null>>
}){
  const handleKeywordChange = (value: string) => {
    updateQueryParams({ keyword: value, page: 1 });
  };

  const handleKeywordColumnChange = (value: string) => {
    updateQueryParams({ keywordColumn: value, page: 1 });
  };

  return (
    <div className="flex items-center justify-between p-4">
      <div>
        <h2 className="text-2xl font-semibold text-gray-700">Usuários</h2>
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
        <RadioGroup
          defaultValue={query.keywordColumn}
          className="ml-4 flex space-x-2"
          onValueChange={handleKeywordColumnChange}
        >
          <div className="flex items-center space-x-1">
            <RadioGroupItem value="name" id="name" />
            <Label htmlFor="name">Nome</Label>
          </div>
          <div className="flex items-center space-x-1">
            <RadioGroupItem value="email" id="email" />
            <Label htmlFor="email">Email</Label>
          </div>
        </RadioGroup>
        <UserDialog createUser={createUser} setUsers={setUsers} />
      </div>
    </div>
  );
};

