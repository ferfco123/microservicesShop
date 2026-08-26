import { useLocation, useNavigate } from "react-router";
import "./singleOrder.css";

const SingleOrder = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state;

  return (
    <div>
      <button onClick={() => navigate("/")} className="o-btn">
        Home
      </button>
      <h3>Order Id:{order.id}</h3>
      <div className="o-title">
        Email :<span className="o-inner">{order.email}</span>
      </div>

      <div className="o-title">
        Total Products:
        <span className="o-inner">{order.totalProducts}</span>
      </div>
      <div className="o-title">Products:</div>
      {order.products.map((o: any) => (
        <div key={o.id}>
          <div className="o-title">
            Product name :<span className="o-inner">{o.name}</span>
          </div>
          <div className="o-title">
            Product color :<span className="o-inner">{o.color}</span>
          </div>
          <div className="o-title">
            Product size :<span className="o-inner">{o.size}</span>
          </div>
          <div className="o-title">
            Quantity: <span className="o-inner">{o.quantity}</span>
          </div>
          <div className="o-title">
            Price: <span className="o-inner">{o.price}</span>
          </div>
        </div>
      ))}

      <div className="o-title">
        Shipping Address:{" "}
        <span className="o-inner">{order.shippingAddress}</span>
      </div>
    </div>
  );
};

export default SingleOrder;
