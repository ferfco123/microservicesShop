import React from "react";
import "./sortItems.css";

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
  return (
    <div className="sortItems">
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
  );
};

export default SortItems;
