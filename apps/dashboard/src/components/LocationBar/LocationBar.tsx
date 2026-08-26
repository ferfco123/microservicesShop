import { Link, useNavigate } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";

type locationProps = { type: string };
const LocationBar = ({ type }: locationProps) => {
  const navigate = useNavigate();
  const link = type.toLocaleLowerCase();

  return (
    <div>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to={`/${link}`}>{type}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Single {type.slice(0, -1)}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
        <button
          onClick={() => navigate(-1)}
          className="!border-none !px-[7px] !pt-[3px] !pb-[7px] !mt-2 !rounded-[7px] !cursor-pointer !text-black !bg-white"
        >
          Back
        </button>
      </Breadcrumb>
    </div>
  );
};

export default LocationBar;
