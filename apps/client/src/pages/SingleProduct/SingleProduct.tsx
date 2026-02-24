import { useParams } from "react-router";
import "./singleProduct.css";
import { products } from "../Home/data.home";
import { useEffect, useState } from "react";
import QuantityCounter from "../../components/QuantityCounter/QuantityCounter";
import ProductSizes from "../../components/ProductSizes/ProductSizes";
import ProductColors from "../../components/ProductColors/ProductColors";
import useCart from "../../Zustand/useCart";
import { toast } from "react-toastify";
type CartProduct = {
  id: string;
  size: string;
  color: string;
  quantity: number;
  price: number;
  img: string;
  name: string;
};
const SingleProduct = () => {
  const { id } = useParams();
  const product = products.find((p) => p.id === id);
  const [sizeActive, setSizeActive] = useState(product?.sizes[0] ?? "");
  const [colorActive, setColorActive] = useState<string>(
    product?.colors[0] ?? "",
  );
  if (!product) return;
  const [quantity, setQuantity] = useState(1);
  const [img, setImg] = useState("gray");
  const { addToCart } = useCart();

  const handleQuantity = (action: string) => {
    if (action === "dec") {
      if (quantity > 1) setQuantity((prev) => prev - 1);
    } else {
      setQuantity((prev) => prev + 1);
    }
  };
  useEffect(() => {
    document.title = product.name;
  }, []);
  const handleCart = () => {
    const cartProduct: CartProduct = {
      name: product.name,
      id: product.id,
      quantity,
      price: product.price,
      img: product.images[img],
      color: colorActive,
      size: sizeActive,
    };
    addToCart(cartProduct);
    toast.success("product added to cart");
  };

  return (
    <div className="singleProduct">
      <div className="sp-top">
        <img src={product?.images[img]} alt="" className="sp-img" />
      </div>
      <div className="sp-bottom">
        <h4>{product?.name}</h4>
        <span className="sp-desc">{product?.description}</span>
        <div className="sp-price">$ {product?.price.toFixed(2)}</div>
        <div className="sp-option">Size</div>

        <ProductSizes
          sizes={product?.sizes}
          sizeActive={sizeActive}
          setSizeActive={setSizeActive}
        />
        <div className="sp-option">color</div>

        <ProductColors
          colors={product.colors}
          colorActive={colorActive}
          setColorActive={setColorActive}
          setImg={setImg}
        />
        <div className="sp-option">quantity</div>
        <QuantityCounter quantity={quantity} handleQuantity={handleQuantity} />

        <div className="sp-btn-container">
          <button className="sp-btn" onClick={handleCart}>
            Add to cart
          </button>
          <button className="sp-btn-buy">By this now</button>
          <div>
            <div className="sp-img-container">
              <img src="/klarna.png" alt="" className="sp-img-card" />
              <img src="/cards.png" alt="" className="sp-img-card" />
              <img src="/stripe.png" alt="" className="sp-img-card" />
            </div>
          </div>
        </div>
        <span className="sp-policy">
          By clicking buy now you agree to our terms and conditions and privacy
          policy. You authorize us to charge your selected payment method for
          total ammount shown. All sales are subject to our return and refund
          policies
        </span>
      </div>
    </div>
  );
};

export default SingleProduct;
