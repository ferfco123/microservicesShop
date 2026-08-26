import { useNavigate } from "react-router";
import "./tablerow.css";
interface ProductType {
  name: string;
  quantity: number;
  price: number;
  _id?: string;
}
type RowType = {
  createdAt: string;
  ammount: number;
  totalProducts: number;
  status?: "delivered" | "pending" | "paid" | null | undefined;
  id: string;
  shippingAddress: string;
  email: string;
  products: ProductType[];
  color?: string;
  size?: string;
};
const TableRow = ({
  createdAt,
  ammount,
  totalProducts,
  status,
  products,
  email,
  color,

  size,
  shippingAddress,
  id,
}: RowType) => {
  const navigate = useNavigate();
  return (
    <tr
      className="row"
      onClick={() => {
        navigate("/singleOrder/", {
          state: {
            createdAt,
            ammount,
            totalProducts,
            status,
            products,
            email,
            color,
            size,
            shippingAddress,
            id,
          },
        });
      }}
    >
      <td>{createdAt}</td>
      <td>{ammount}</td>
      <td>{totalProducts}</td>

      <td>{status}</td>
    </tr>
  );
};

export default TableRow;
