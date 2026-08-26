export type User = {
  id: string;
  avatar: string;
  fullname: string;
  email: string;
  status: "active" | "inactive";
};

export const data: User[] = [
  {
    id: "1234",
    avatar: "avatarssss",
    fullname: "juan 23",
    email: "juan23@gmail.com",
    status: "active",
  },
];
