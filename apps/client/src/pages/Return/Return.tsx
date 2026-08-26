import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import "./return.css";
import confetti from "canvas-confetti";
import useCart from "../../Zustand/useCart";
const Return = () => {
  const [searchParams] = useSearchParams();
  const [data, setData] = useState<any>();
  const { resetCart } = useCart();
  const session_id = searchParams.get("session_id");
  const triggerFireworks = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;

    const interval: any = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      confetti({
        particleCount: 40,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
      });

      confetti({
        particleCount: 40,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
      });
    }, 250);
  };

  if (!session_id) return <div>No session id was found</div>;

  useEffect(() => {
    const getSession = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_PAYMENT_FORM}/session/${session_id}`,
        );
        const response = await res.json();
        setData(response);
        if (response.status === "complete") {
          triggerFireworks();
          resetCart();
        }
      } catch (error) {}
    };

    getSession();
  }, [session_id]);
  console.log("data", data);
  return (
    <div className="return">
      <h1>¡Thank you for your order, {data?.customerName || "Customer"}! 🎉</h1>
      <p>
        W'll send you an email with the order details to:{" "}
        <strong>{data?.customerEmail}</strong>
      </p>

      <h3>Payment resume:</h3>
      <p>
        <strong>Total:</strong> ${data?.amountTotal} {data?.currency}
      </p>
      <div className="return-links">
        <Link to="/orders">You can see your orders in the order page</Link>
        <Link to="/home">Click here to Keep shopping</Link>
      </div>
      <h4>Products:</h4>
      <ul>
        {data?.items?.map((item: any) => (
          <li key={item.id}>
            {item.description} x{item.quantity} - ${item.amount}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Return;
