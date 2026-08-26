import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroupLabel,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";
import {
  Calendar1,
  Home,
  Inbox,
  Plus,
  ShoppingCart,
  UsersRound,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import AddProduct from "../AddProduct/AddProduct";
import AddCategory from "../AddCategory/AddCategory";
import AddUser from "../AddUser/AddUser";

const AppSidebar = () => {
  const items = [
    { title: "Home", url: "/", icon: Home },
    { title: "Inbox", url: "#", icon: Inbox },

    { title: "Payments", url: "/payments", icon: Calendar1 },
    { title: "Users", url: "/users", icon: UsersRound },
    { title: "Products", url: "/products", icon: ShoppingCart },
    { title: "Add Products", url: "", icon: Plus },
  ];
  return (
    <SidebarInset>
      <Sidebar>
        <SidebarHeader>
          <SidebarGroupLabel>Application</SidebarGroupLabel>

          <SidebarMenuItem>
            <SidebarMenuButton>
              <Link to="/" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                <span>FERFCO Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarHeader>
        <SidebarSeparator />
        <SidebarContent>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarMenu>
            {items.map((i) => {
              if (i.title === "Add Products") {
                return (
                  <SidebarMenuItem key={i.title}>
                    <div className="flex flex-col gap-2 w-full px-2 py-1">
                      <Sheet>
                        <SheetTrigger>
                          <div className="flex items-center gap-2 mb-3 text-l font-bold cursor-pointer">
                            <Plus />
                            Add Product
                          </div>
                        </SheetTrigger>
                        <SheetContent className="max-w-md sm:max-w-2xl">
                          <AddProduct />
                        </SheetContent>
                      </Sheet>
                      <Sheet>
                        <SheetTrigger>
                          <div className="flex items-center gap-2 mb-3 text-l font-bold cursor-pointer">
                            <Plus className="h-4 w-4" />
                            Add Category
                          </div>
                        </SheetTrigger>
                        <SheetContent className="max-w-md sm:max-w-2xl">
                          <AddCategory />
                        </SheetContent>
                      </Sheet>
                    </div>
                  </SidebarMenuItem>
                );
              } else if (i.title === "Users") {
                return (
                  <SidebarMenuItem key={i.title}>
                    <SidebarMenuButton>
                      <Link
                        to={i.url}
                        className="flex items-center gap-2 mb-3 text-l font-bold"
                      >
                        <i.icon className="h-4 w-4" />
                        <span>{i.title}</span>
                      </Link>
                    </SidebarMenuButton>
                    <Sheet>
                      <SheetTrigger>
                        <div className="flex items-center gap-2 mb-3 text-l font-bold cursor-pointer">
                          <Plus className="h-4 w-4" />
                          Add User
                        </div>
                      </SheetTrigger>
                      <SheetContent className="max-w-md sm:max-w-2xl">
                        <AddUser />
                      </SheetContent>
                    </Sheet>
                  </SidebarMenuItem>
                );
              } else {
                return (
                  <SidebarMenuItem key={i.title}>
                    <SidebarMenuButton>
                      <Link
                        to={i.url}
                        className="flex items-center gap-2 mb-3 text-l font-bold"
                      >
                        <i.icon className="h-4 w-4" />
                        <span>{i.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              }
            })}
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter className="text-xs text-muted-foreground">
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex items-center gap-2 w-full px-4 py-3 text-sm text-muted-foreground rounded-md hover:bg-accent hover:text-accent-foreground">
                    <button className="flex items-center gap-2 w-full px-4 py-3 text-sm text-muted-foreground rounded-md hover:bg-accent hover:text-accent-foreground">
                      <Home className="h-4 w-4 flex-shrink-0" />
                      <span>FERFCO Dashboard</span>
                    </button>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Account</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuItem>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    </SidebarInset>
  );
};

export default AppSidebar;
