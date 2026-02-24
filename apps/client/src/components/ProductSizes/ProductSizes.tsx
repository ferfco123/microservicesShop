import "./productSizes.css";

const ProductSizes = ({
  sizes,
  sizeActive,
  setSizeActive,
}: {
  sizes: string[];
  sizeActive: string | undefined;
  setSizeActive: React.Dispatch<React.SetStateAction<string | undefined>>;
}) => {
  return (
    <div className="sp-sizes">
      {sizes.map((s) => (
        <div className="sp-size-container" key={s}>
          <div
            className="sp-size"
            style={
              sizeActive === s
                ? { backgroundColor: "black", color: "white" }
                : {}
            }
            onClick={() => setSizeActive(s)}
          >
            {s}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductSizes;
