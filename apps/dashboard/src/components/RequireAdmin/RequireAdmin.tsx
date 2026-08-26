type requireAdmineType = {
  setState: (e: boolean) => void;
};

const RequireAdmin = ({ setState }: requireAdmineType) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className=" bg-red-500 w-[70%] h-[70%] border border-yellow-500 flex flex-col items-center justify-around">
        <div className="text-2xl  text-white  ">
          You have to be logged to create edit o delete
        </div>
        <button
          className="border-none rounded-[7px] p-1.75 bg-black text-white cursor-pointer"
          onClick={() => setState(false)}
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default RequireAdmin;
