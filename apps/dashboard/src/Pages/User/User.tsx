import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import React, { useEffect, useState } from "react";
import { Trash } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import AppPagination from "@/components/AppPagination/AppPagination";

import type { User } from "./Data.users.tsx";
import { columns } from "./Columns.users";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SimplifiedUser } from "@repo/types";

import { toast } from "react-toastify";
import { useAuth, useUser } from "@clerk/react";
import { apiUsersPrivate } from "@/api/api.tsx";
import { SearchBar } from "@/components/SearchBar/SearchBar.tsx";
import { useSearchParams } from "react-router-dom";
import RequireAdmin from "@/components/RequireAdmin/RequireAdmin.tsx";
import { AxiosError } from "axios";

const User = () => {
  const [sorting, setSorting] = React.useState<any>([]);
  const [{ pageIndex, pageSize }, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const { user } = useUser();
  const role = user?.publicMetadata.role !== "admin";
  const [notAdmin, setNotAdmin] = useState(false);
  const [rowSelection, setRowSelection] = useState({});
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  const [columnVisibility, setColumnVisibility] = useState({});
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 640;

      if (isMobile) {
        setColumnVisibility({
          avatar: false,
          fullName: false,
          email: true,
          status: true,
        });
      } else {
        setColumnVisibility({
          avatar: true,
          fullName: true,
          email: true,
          status: true,
        });
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const { data, isLoading } = useQuery<{
    data: SimplifiedUser[];
    totalCount: number;
  }>({
    queryKey: ["users", pageIndex, pageSize, search],
    queryFn: async () => {
      const token = await getToken();
      const offset = pageIndex * pageSize;

      const res = await apiUsersPrivate.get(
        `/users?limit=${pageSize}&offset=${offset}&search=${encodeURIComponent(search)}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      return res.data;
    },
  });

  const table = useReactTable<SimplifiedUser>({
    data: data?.data ?? [],
    columns: columns as ColumnDef<SimplifiedUser>[],

    pageCount: data ? Math.ceil(data.totalCount / pageSize) : 0,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    manualPagination: true,
    onRowSelectionChange: setRowSelection,
    enableRowSelection: true,

    state: {
      columnVisibility,
      pagination: { pageIndex, pageSize },
      sorting,
      rowSelection,
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      const token = await getToken();
      await apiUsersPrivate.post(
        "/users/bulk-delete",
        {
          ids,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });

      setRowSelection({});
      toast.success("Users have been deleted");
    },
    onError: (error: AxiosError) => {
      if (error.response?.status === 401) {
        return setNotAdmin(true);
      }
      toast.error("Something went wrong");
    },
  });
  const handleDelete = () => {
    if (role) {
      return setNotAdmin(true);
    }

    const selectedRows = table.getSelectedRowModel().rows;
    const idsToDelete = selectedRows.map((row) => row.original.id);

    deleteMutation.mutate(idsToDelete);
  };

  if (isLoading || !columns) return <div>Loading...</div>;
  return (
    <div>
      <SearchBar placeholder="Search by email..." state="search" />
      <div className="w-full rounded-md border">
        {notAdmin && <RequireAdmin setState={setNotAdmin} />}

        {Object.keys(rowSelection).length > 0 && (
          <div className="flex">
            <div className="ml-auto flex items-center gap-2 bg-red-500 text-white p-2 rounded-md mr-1 text-sm cursor-pointer">
              <button
                onClick={handleDelete}
                className={`flex gap-2 border-none rounded-[7px] pt-0.75 pb-1.25 pr-2.5 pl-2.5 bg-red-500 text-white text-xl items-center ${
                  deleteMutation.isPending
                    ? "cursor-not-allowed opacity-50"
                    : "cursor-pointer"
                }`}
                disabled={deleteMutation.isPending}
              >
                <Trash />
              </button>
              <p>Delete users</p>
            </div>
          </div>
        )}
        <div className="w-full  overflow-x-auto">
          <Table className="w-full min-w-full table-fixed">
            <TableHeader>
              {table?.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <div className="flex items-center justify-center space-x-2 py-4">
            <AppPagination table={table} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default User;
