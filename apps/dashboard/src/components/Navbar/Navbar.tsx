import { LogIn, LogOut, Moon, Settings, Sun, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SignInButton, SignOutButton, useClerk, useUser } from "@clerk/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useTheme } from "../ThemeProvider/Themeprovider";
import { SidebarTrigger } from "../ui/sidebar";

const Navbar = () => {
  const { setTheme } = useTheme();
  const { user, isSignedIn } = useUser();

  return (
    <div className="flex  p-3 items-center justify-between w-full sticky top-0 bg-background z-10">
      <SidebarTrigger className=" md:hidden" />
      <div className="flex gap-4 items-center ml-auto">
        <Link to="/">Dashboard</Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>
              Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              Dark
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {isSignedIn ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Avatar>
                  <AvatarImage
                    src={user?.imageUrl || "https://github.com/shadcn.png"}
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent sideOffset={10}>
              <DropdownMenuGroup>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuItem>
                  <User className="h-[1.2rem] w-[1.2rem] mr-2" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="h-[1.2rem] w-[1.2rem] mr-2" />
                  Settings
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive">
                  <LogOut className="h-[1.2rem] w-[1.2rem] mr-2" />

                  <SignOutButton>LogOut</SignOutButton>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <SignInButton mode="modal">
            <Button>
              <LogIn className="h-4 w-4 mr-2" />
              Log In
            </Button>
          </SignInButton>
        )}
      </div>
    </div>
  );
};

export default Navbar;
