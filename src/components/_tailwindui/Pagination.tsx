import { Button } from "../ui/button";

interface Props {
  currentPage: number;
  totalPage: number;
  setPage: (page: number) => void;
  limit: number;
  totalDocument: number;
}

export default function Pagination({
  currentPage,
  totalPage,
  setPage,
  limit,
  totalDocument,
}: Props) {
  return (
    <nav
      className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4 "
      aria-label="Pagination"
    >
      <div className="hidden sm:block">
        <p className="text-sm text-gray-700">
          Showing{" "}
          <span className="font-medium">{(currentPage - 1) * limit + 1}</span>{" "}
          to <span className="font-medium">{currentPage * limit}</span> of{" "}
          <span className="font-medium">{totalDocument}</span> results
        </p>
      </div>
      <div className="flex flex-1 gap-4 justify-between sm:justify-end">
        <Button
          variant={"outline"}
          disabled={currentPage === 1}
          onClick={() => {
            setPage(currentPage - 1);
          }}
        >
          Previous
        </Button>
        <Button
          variant={"outline"}
          disabled={currentPage === totalPage}
          onClick={() => {
            setPage(currentPage + 1);
          }}
        >
          Next
        </Button>
      </div>
    </nav>
  );
}
