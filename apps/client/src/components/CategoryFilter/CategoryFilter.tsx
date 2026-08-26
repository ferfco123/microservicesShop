import "./categoryFilter.css";
import type { CategoryFilterProps } from "./data.categoryFilter";

const CategoryFilter = ({
  data,
  searchParams,
  setSearchParams,
}: CategoryFilterProps) => {
  const active: string = searchParams.get("category") || "all";

  const handleClick = (item: string) => {
    const params = new URLSearchParams(searchParams);

    params.set("category", item.toLowerCase());
    if (params.get("category") !== "all") {
      params.set("sort", "Newest");
    } else {
      params.delete("sort");
    }

    setSearchParams(params);
  };
  return (
    <div className="cf">
      {data.map((item, i) => {
        const Icon = item.icon;

        return (
          <div
            key={i}
            className={
              active === item.title.toLowerCase()
                ? "cf-item cf-active"
                : "cf-item "
            }
            onClick={() => handleClick(item.title)}
          >
            <Icon className="cf-icon" />
            {item?.title}
          </div>
        );
      })}
    </div>
  );
};

export default CategoryFilter;
