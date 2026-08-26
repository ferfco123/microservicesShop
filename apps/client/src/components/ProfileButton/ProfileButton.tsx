import { UserButton } from "@clerk/clerk-react";
import { ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router";

const ProfileButton = () => {
  const navigate = useNavigate();
  return (
    <div>
      <UserButton>
        <UserButton.MenuItems>
          <UserButton.Action
            label="Orders"
            labelIcon={<ShoppingBag />}
            onClick={() => navigate("/orders")}
          />
        </UserButton.MenuItems>
      </UserButton>
    </div>
  );
};

export default ProfileButton;
