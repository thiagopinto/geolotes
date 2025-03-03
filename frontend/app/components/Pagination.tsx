import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { IMeta } from "../interfaces/pagination";
import { IQueryParams } from "../interfaces/fetch";

const Pagination = ({
  meta,
  updateQueryParams,
}: {
  meta?: IMeta;
  updateQueryParams: (newParams: Partial<IQueryParams>) => void;
}) => {
  if (!meta) {
    return null;
  }

  const page = parseInt(`${meta.page}`);
  const totalPages = parseInt(`${meta.totalPages}`);
  const firstPage = parseInt(`${meta.firstPage}`);
  const lastPage = parseInt(`${meta.lastPage}`);

  if (totalPages <= 1) {
    return null;
  }

  const visiblePages = 5;

  const onPageChange = (page: number) => {
    updateQueryParams({ page });
  };

  const renderPageNumbers = () => {
    if (totalPages <= visiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1).map(
        (pageNumber) => (
          <button
            key={pageNumber}
            onClick={() => handlePageClick(pageNumber)}
            className="px-3 py-2 rounded-md mx-1 bg-background hover:bg-secondary/10 transition-colors duration-200"
          >
            <span
              className={
                page == pageNumber ? "bg-secondary/20 font-bold underline" : ""
              }
            >
              {pageNumber}
            </span>
          </button>
        )
      );
    } else {
      const pages = [];
      const middlePage = Math.floor(visiblePages / 2);

      if (page <= middlePage) {
        for (let i = 1; i <= visiblePages; i++) {
          pages.push(i);
        }
      } else if (page >= totalPages - middlePage) {
        for (let i = totalPages - visiblePages + 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        for (let i = page - middlePage; i <= page + middlePage; i++) {
          pages.push(i);
        }
      }

      return (
        <>
          {pages[0] !== 1 && (
            <>
              <button onClick={() => handlePageClick(1)}>1</button>
              <span>...</span>
            </>
          )}
          {pages.map((pageNumber) => (
            <button
              key={pageNumber}
              onClick={() => handlePageClick(pageNumber)}
              className={cn(
                "px-3 py-2 rounded-md mx-1 bg-background hover:bg-secondary/10 transition-colors duration-200",
                page === pageNumber && "bg-secondary/20 font-bold"
              )}
            >
              <span
                className={
                  page == pageNumber
                    ? "bg-secondary/20 font-bold underline"
                    : ""
                }
              >
                {pageNumber}
              </span>
            </button>
          ))}
          {pages[pages.length - 1] !== totalPages && (
            <>
              <span>...</span>
              <button onClick={() => handlePageClick(totalPages)}>
                {totalPages}
              </button>
            </>
          )}
        </>
      );
    }
  };

  const handlePageClick = (page: number) => {
    onPageChange(page);
  };

  return (
    <div className="flex items-center justify-center mt-4">
      {page !== firstPage && (
        <button
          onClick={() => handlePageClick(page - 1)}
          disabled={page === firstPage}
          className={cn(
            "p-2 rounded-md bg-background hover:bg-secondary/10 transition-colors duration-200 disabled:opacity-50",
            page === firstPage && "cursor-not-allowed"
          )}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      )}

      <div className="flex items-center mx-2">{renderPageNumbers()}</div>

      {page !== lastPage && (
        <button
          onClick={() => handlePageClick(page + 1)}
          disabled={page === lastPage}
          className={cn(
            "p-2 rounded-md bg-background hover:bg-secondary/10 transition-colors duration-200 disabled:opacity-50",
            page === lastPage && "cursor-not-allowed"
          )}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default Pagination;
