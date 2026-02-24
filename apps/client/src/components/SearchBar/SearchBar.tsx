import { Search } from "lucide-react";
import "./searchBar.css";

const SearchBar = () => {
  return (
    <div className="searchBar">
      <Search className="sb-icon" />
      <input type="text" placeholder="Search..." className="sb-input" />
    </div>
  );
};

export default SearchBar;
