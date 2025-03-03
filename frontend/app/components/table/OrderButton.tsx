import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { IQueryPaginationParams, Order } from "@/app/interfaces/pagination";
import { ReactNode, useEffect, useState } from "react";
import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";
import { IQueryParams } from "@/app/interfaces/fetch";

export function OrderButton({
  columnName,
  fieldName,
  query,
  refresh,
  children,
}: {
  columnName?: string;
  fieldName: string;
  query: IQueryPaginationParams;
  refresh: (newParams: Partial<IQueryParams>) => void;
  children?: ReactNode;
}) {
  const [order, setOrder] = useState<Order>(query.order || "desc");
  const [orderBy, setOrderBy] = useState(query.orderBy || "id");

  useEffect(() => {
    setOrderBy(query.orderBy);
  }, [query.orderBy]);

  const toggleSorting = () => {
    setOrder(
      (prevOrder: Order) => (prevOrder === "asc" ? "desc" : "asc") as Order
    );
    setOrderBy(fieldName);

    refresh({
      orderBy: fieldName,
      order: order === "asc" ? "desc" : "asc",
    });
  };

  return (
    <div className={cn("flex items-center")}>
      <Button
        variant="ghost"
        size="sm"
        className="-ml-1 h-8 p-0"
        onClick={toggleSorting}
      >
        {columnName && <span>{columnName}</span>}

        {children && children}

        {orderBy !== fieldName ? (
          <ChevronsUpDown className="ml-2 h-4 w-4" />
        ) : order === "asc" ? (
          <ChevronUp className="ml-2 h-4 w-4" />
        ) : (
          <ChevronDown className="ml-2 h-4 w-4" />
        )}
      </Button>
    </div>
  );
}
