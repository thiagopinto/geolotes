import { Skeleton } from "@/components/ui/skeleton";

const TableSkeleton = ({ rows = 10 }) => {  // Default to 10 rows
  return (
    <div className="w-full border rounded-lg shadow-sm">
      {/* Cabeçalho da tabela */}
      <div className="flex bg-gray-100 p-3">
        <Skeleton className="w-1/4 h-6" />
        <Skeleton className="w-1/4 h-6 ml-4" />
        <Skeleton className="w-1/4 h-6 ml-4" />
        <Skeleton className="w-1/4 h-6 ml-4" />
      </div>

      {/* Linhas da tabela (simulação) */}
      <div className="space-y-2 p-3">
        {[...Array(rows)].map((_, i) => ( // Use the rows prop here
          <div key={i} className="flex items-center space-x-4">
            <Skeleton className="w-1/4 h-6" />
            <Skeleton className="w-1/4 h-6" />
            <Skeleton className="w-1/4 h-6" />
            <Skeleton className="w-1/4 h-6" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableSkeleton;