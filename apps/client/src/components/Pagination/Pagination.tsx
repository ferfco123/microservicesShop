import { useSearchParams } from "react-router";
import "./pagination.css";
type PaginationTypes = {
  totalPages: number;
};
const Pagination = ({ totalPages }: PaginationTypes) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;

  const handleClick = (action: string) => {
    const currentPage = Number(searchParams.get("page")) || 1;
    if (action === "inc") {
      if (currentPage < totalPages) {
        const params = new URLSearchParams(searchParams);
        params.set("page", String(currentPage + 1));
        setSearchParams(params);
      }
    } else {
      if (currentPage > 1) {
        const params = new URLSearchParams(searchParams);
        params.set("page", String(currentPage - 1));
        setSearchParams(params);
      }
    }
  };
  return (
    <div
      className="pagination
  "
    >
      <button
        className="
      pagination-btn"
        onClick={() => handleClick("dec")}
      >
        Back
      </button>
      <div>
        {`Page ${page} of ${totalPages} ${totalPages < 1 ? "Page" : "Pages"}`}
      </div>
      <button
        className="
      pagination-btn"
        onClick={() => handleClick("inc")}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
