import { SignOutButton, useAuth } from "@clerk/react";
import { useEffect } from "react";

import { useNavigate } from "react-router-dom";

const NoAuthorized = () => {
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!isSignedIn) navigate("/signup");
  }, [isSignedIn]);
  return (
    <div
      className="mt-5 p-4
  "
    >
      You are not authorized
      <div className="p-5">
        <SignOutButton />
      </div>
    </div>
  );
};

export default NoAuthorized;
