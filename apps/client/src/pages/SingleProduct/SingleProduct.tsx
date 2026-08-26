import { useNavigate, useParams } from "react-router";
import "./singleProduct.css";
import { useEffect, useState } from "react";
import QuantityCounter from "../../components/QuantityCounter/QuantityCounter";
import ProductSizes from "../../components/ProductSizes/ProductSizes";
import ProductColors from "../../components/ProductColors/ProductColors";
import useCart from "../../Zustand/useCart";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import type { cartItemType, ProductType } from "@repo/types";
import { apiProductsPublic } from "../../api/api";

const SingleProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    data: product,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: async (): Promise<ProductType> => {
      const res = await apiProductsPublic.get(`/products/singleProduct/${id}`);
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
  });
  const [sizeActive, setSizeActive] = useState<string | undefined>(undefined);
  const [colorActive, setColorActive] = useState<string | undefined>(undefined);

  const images =
    typeof product?.images === "object" && product?.images !== null
      ? (product.images as Record<string, string>)
      : undefined;
  const [quantity, setQuantity] = useState(1);
  const [img, setImg] = useState<string | undefined>(undefined);
  const { addToCart } = useCart();

  const handleQuantity = (action: string) => {
    if (action === "dec") {
      if (quantity > 1) setQuantity((prev) => prev - 1);
    } else {
      setQuantity((prev) => prev + 1);
    }
  };

  useEffect(() => {
    if (product) {
      document.title = product.name;
      if (!colorActive && product.colors?.length > 0) {
        const defaultColor = product.colors[0];
        setColorActive(defaultColor);

        if (images && images[defaultColor]) {
          setImg(defaultColor);
        }
      }
      if (!sizeActive && product.sizes?.length > 0) {
        setSizeActive(product.sizes[0]);
      }
    }
  }, [product, colorActive, sizeActive, images]);

  const handleCart = () => {
    const cartProduct: cartItemType = {
      name: product?.name,
      id: Number(product?.id),
      quantity,
      price: product?.price,
      img: product?.images
        ? product.images[img as keyof typeof product.images]
        : undefined,
      selectedColor: colorActive,
      selectedSize: sizeActive,
    };
    addToCart(cartProduct);
    toast.success("product added to cart");
  };
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Something went wrong</div>;
  }

  return (
    <div className="singleProduct">
      <div className="sp-top">
        <img
          src={
            product?.images
              ? product.images[img as keyof typeof product.images]
              : undefined
          }
          alt=""
          className="sp-img"
        />
      </div>
      <div className="sp-bottom">
        <h4>{product?.name}</h4>
        <span className="sp-desc">{product?.description}</span>
        <div className="sp-price">$ {product?.price.toFixed(2)}</div>
        <div className="sp-option">Size</div>

        {product && (
          <ProductSizes
            sizes={product?.sizes}
            sizeActive={sizeActive}
            setSizeActive={setSizeActive}
          />
        )}

        <div className="sp-option">color</div>

        {product && (
          <ProductColors
            colors={product?.colors}
            colorActive={colorActive}
            setColorActive={setColorActive}
            setImg={setImg}
          />
        )}
        <div className="sp-option">quantity</div>
        <QuantityCounter quantity={quantity} handleQuantity={handleQuantity} />

        <div className="sp-btn-container">
          <button className="sp-btn" onClick={handleCart}>
            Add to cart
          </button>
          <button className="sp-btn-buy" onClick={() => navigate(-1)}>
            Back
          </button>
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
