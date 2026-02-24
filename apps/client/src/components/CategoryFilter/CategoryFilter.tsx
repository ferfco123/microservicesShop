import "./categoryFilter.css";
import type { CategoryFilterProps } from "./data.categoryFilter";

const CategoryFilter = ({
  data,
  searchParams,
  setSearchParams,
}: CategoryFilterProps) => {
  const active: string = searchParams.get("cat") || "all";

  const handleClick = (item: string) => {
    const params = new URLSearchParams(searchParams);

    params.set("cat", item.toLowerCase());
    params.set("sort", "Newest");

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
