import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

import { BadgeCheck, Candy, Citrus, Shield } from "lucide-react";
import { Progress } from "@/components/ui/progress";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import EditUser from "@/components/EditUser/EditUser";
import LocationBar from "@/components/LocationBar/LocationBar";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import UserChart from "@/components/UserChart/UserChart";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { SafeUser } from "@repo/types";

import { useAuth, useUser } from "@clerk/react";
import { apiUsersPrivate } from "@/api/api";
import { toast } from "react-toastify";
import { useState } from "react";
import RequireAdmin from "@/components/RequireAdmin/RequireAdmin";
import { AxiosError } from "axios";

const SingleUser = () => {
  const { id } = useParams();
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useUser();
  const role = user?.publicMetadata.role !== "admin";
  const [notAdmin, setNotAdmin] = useState(false);
  const { data } = useQuery<SafeUser>({
    queryKey: ["user", id],
    queryFn: async (): Promise<SafeUser> => {
      const token = await getToken();
      const res = await apiUsersPrivate.get(`/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
  });
  const deleteMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      const token = await getToken();
      await apiUsersPrivate.post(`/users/bulk-delete`, ids, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["users"] });
      navigate("/users");
      toast.success("User has been deleted");
    },
    onError: (error: AxiosError) => {
      if (error.response?.status === 401) {
        return setNotAdmin(true);
      }

      toast.error("Something went wrong");
    },
  });
  const handleDelete = (id: any) => {
    if (role) {
      return setNotAdmin(true);
    }
    deleteMutation.mutate(id);
  };
  if (!data) return <div>User not found</div>;
  console.log("singleUser", data);
  return (
    <div>
      <LocationBar type="Users" />
      {notAdmin && <RequireAdmin setState={setNotAdmin} />}
      <div className="flex  flex-col xl:flex-row mt-4 gap-4">
        <div className="w-full xl:w-1/3 space-y-6">
          <div className="bg-primary-foreground p-2 rounded-lg flex flex-col ">
            <h3 className="text-xl font-semibold">User information</h3>
            <div className="bg-primary-foreground p-2 rounded-lg flex items-center gap-5">
              <HoverCard>
                <HoverCardTrigger>
                  <BadgeCheck className=" rounded-full bg-blue-300 border-l border-blue-500" />
                </HoverCardTrigger>
                <HoverCardContent>
                  <h1 className="font-bold mb-2">Verified user</h1>
                  <p className="text-muted-foreground text-sm">
                    This user has been verified
                  </p>
                </HoverCardContent>
              </HoverCard>
              <HoverCard>
                <HoverCardTrigger>
                  <Citrus className=" rounded-full bg-orange-300 border-l border-orenge-500" />
                </HoverCardTrigger>
                <HoverCardContent>
                  <h1 className="font-bold mb-2">Popular</h1>
                  <p className="text-muted-foreground text-sm">
                    This user has been popular in the community
                  </p>
                </HoverCardContent>
              </HoverCard>
              <HoverCard>
                <HoverCardTrigger>
                  <Shield className=" rounded-full bg-yellow-300 border-l border-yellow-500 " />
                </HoverCardTrigger>
                <HoverCardContent>
                  <h1 className="font-bold mb-2">Popular</h1>
                  <p className="text-muted-foreground text-sm">
                    This user has been popular in the community
                  </p>
                </HoverCardContent>
              </HoverCard>
              <HoverCard>
                <HoverCardTrigger>
                  <Candy className=" rounded-full bg-green-300 border-l border-green-500 " />
                </HoverCardTrigger>
                <HoverCardContent>
                  <h1 className="font-bold mb-2">Popular</h1>
                  <p className="text-muted-foreground text-sm">
                    This user has been popular in the community
                  </p>
                </HoverCardContent>
              </HoverCard>
            </div>
          </div>
          <div className="bg-primary-foreground p-4 rounded-lg">
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage
                  src={
                    data?.imageUrl ||
                    "https://img.freepik.com/premium-vector/bald-empty-face-icon-avatar-vector-illustration_601298-13391.jpg"
                  }
                />
                <AvatarFallback>
                  {data?.firstName?.charAt(0) || "*"}
                </AvatarFallback>
              </Avatar>
              <h1 className="text-sm font-semibold">{data?.username}</h1>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              User Id: {data.id}
            </p>
          </div>
          <div className="bg-primary-foreground p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">User information</h3>
              <Sheet>
                <Button asChild>
                  <SheetTrigger>Edit user</SheetTrigger>
                </Button>
                <button
                  className="border-none rounded-[7px] pt-[5px] pb-[7px] pr-[10px]  pl-[10px] bg-red-500 text-white cursor-pointer"
                  onClick={handleDelete}
                >
                  Delete user
                </button>
                <SheetContent className="max-w-md sm:max-w-2xl">
                  <EditUser />
                </SheetContent>
              </Sheet>
            </div>
            <div className="space-y-4 mt-4">
              <div className="flex flex-col gap-2 mb-8">
                <p className="text-sm text-muted-foreground ">
                  User completation
                </p>
                <Progress value={33} />
              </div>
              <div className="flex gap-2 text-sm">
                <span>Full name:</span>
                <span>{data?.firstName + " " + data?.lastName || "*"}</span>
              </div>
              <div className="flex gap-2 text-sm">
                <span>email:</span>
                <span>{data?.emailAddresses[0].emailAddress}</span>
              </div>
              <div className="flex gap-2 text-sm">
                <span>Username:</span>
                <span>{data.username}</span>
              </div>
              <div className="flex gap-2 text-sm">
                <span>Role</span>
                <span>{(data?.publicMetadata as any).role || "User"}</span>
              </div>
              <div className="flex gap-2 text-sm">
                <span>Status</span>
                <span>{data.banned ? "Banned" : "Active"}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full xl:w-2/3 space-y-6">
          <div className="bg-primary-foreground p-4 rounded-lg">
            <h1 className="text-lg font-semibold mb-2">User activity</h1>
            <UserChart />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleUser;
