import React from "react";
import "./sortItems.css";
import { useNavigate } from "react-router";

type SortItemsProps = {
  searchParams: URLSearchParams;
  setSearchParams: (nextInit: URLSearchParams | Record<string, string>) => void;
};
const SortItems = ({ searchParams, setSearchParams }: SortItemsProps) => {
  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams);
    params.set("sort", e.target.value);

    setSearchParams(params);
  };
  const navigate = useNavigate();
  return (
    <div className="sortItems">
      <button className="si-btn" onClick={() => navigate("/")}>
        Back
      </button>
      <div
        className="
      si-container"
      >
        <p
          className="
        sortItems-title"
        >
          Sort by
        </p>

        <select
          className="sortItems-select"
          onChange={(e) => {
            handleSelect(e);
          }}
        >
          <option value="Newest" className="sortItmes-option">
            Newest
          </option>
          <option value="Oldest" className="sortItmes-option">
            Oldest
          </option>
          <option value="lowToHigh" className="sortItmes-option">
            Price: Low to High
          </option>
          <option value="HighToLow" className="sortItmes-option">
            Price: High to Low
          </option>
        </select>
      </div>
    </div>
  );
};

export default SortItems;
