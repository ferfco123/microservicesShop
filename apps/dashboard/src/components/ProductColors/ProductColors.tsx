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
    <div className="flex gap-3 mb-5">
      <span className="text-x font-bold">Colors :</span>
      {colors.map((c) => (
        <div className={colorActive === c ? " scale-130" : ""} key={c}>
          <div
            className="h-5 w-5 cursor-pointer"
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
