import type { ColumnDef } from "@tanstack/react-table";
import { SimplifiedUser } from "@repo/types";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const columns: ColumnDef<SimplifiedUser>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        checked={
          table.getIsAllPageRowsSelected()
            ? true
            : table.getIsSomePageRowsSelected()
              ? "indeterminate"
              : false
        }
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        checked={row.getIsSelected()}
      />
    ),
  },
  {
    accessorKey: "avatar",
    header: "Avatar",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="h-9 w-9 bg-red-500 rounded-full flex items-center justify-center overflow-hidden">
          <img
            src={user.avatar}
            alt=""
            className="object-cover w-full h-full rounded-full"
          />
        </div>
      );
    },
  },
  {
    id: "fullName",
    accessorKey: "fullName",
    header: "User",
    cell: ({ row }) => (
      <span className="font-medium whitespace-nowrap block truncate">
        {row.getValue("fullName")}
      </span>
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="p-0 hover:bg-transparent h-8 font-semibold justify-start"
      >
        Email
        <ArrowUpDown className="ml-1 h-3.5 w-3.5 shrink-0" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="whitespace-nowrap text-left pr-2">
        {row.getValue("email")}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <span>{row.getValue("status")}</span>,
  },
  {
    id: "actions",
    size: 40,
    cell: ({ row }) => {
      const user = row.original;

      return (
        <div className="flex justify-end pr-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(user.id)}
              >
                Copy user ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link to={`/singleuser/${user.id}`}>View customer</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
