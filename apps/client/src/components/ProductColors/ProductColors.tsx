import "./productColors.css";

const ProductColors = ({
  colors,
  colorActive,
  setColorActive,
  setImg,
}: {
  colors: string[];
  colorActive: string | undefined;
  setColorActive: React.Dispatch<React.SetStateAction<string | undefined>>;
  setImg: React.Dispatch<React.SetStateAction<string | undefined>>;
}) => {
  return (
    <div className="sp-sizes">
      {colors.map((c) => (
        <div className={colorActive === c ? "sp-color-container" : ""} key={c}>
          <div
            className="sp-size"
            style={{ backgroundColor: `${c}` }}
            onClick={() => {
              setImg(c);
              setColorActive(c);
            }}
          ></div>
        </div>
      ))}
    </div>
  );
};

export default ProductColors;
