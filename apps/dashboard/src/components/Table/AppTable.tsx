import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import type { ColumnDef } from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import React, { useState } from "react";
import AppPagination from "../AppPagination/AppPagination";
import { Trash } from "lucide-react";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getToken, useUser } from "@clerk/react";
import { apiOrderPrivate } from "@/api/api";

import RequireAdmin from "../RequireAdmin/RequireAdmin";
import { AxiosError } from "axios";

interface DataTableProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
  getRowId?: (row: TData) => string;
}

export function AppTable<TData extends { _id?: string; id?: string }>({
  columns,
  data,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = React.useState<any>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const { user } = useUser();
  const role = user?.publicMetadata.role !== "admin";
  const [notAdmin, setNotAdmin] = useState(false);
  const queryClient = useQueryClient();

  const [rowSelection, setRowSelection] = useState({});
  const table = useReactTable<TData>({
    data,
    columns,
    getRowId: (row) => row._id || row.id || "",
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelection,
    state: {
      pagination,
      sorting,
      rowSelection,
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      const token = await getToken();
      await apiOrderPrivate.delete(`/orders`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { ids },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });

      setRowSelection({});

      toast.success("Orders have been deleted");
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
    const idsToDelete = selectedRows.map((row) => row.id);

    if (idsToDelete) deleteMutation.mutate(idsToDelete as string[]);
  };

  return (
    <div className="w-full rounded-md border">
      {notAdmin && <RequireAdmin setState={setNotAdmin} />}
      {Object.keys(rowSelection).length > 0 && (
        <div className="flex">
          <div
            className="ml-auto flex items-center gap-2 bg-red-500 text-white p-2 rounded-md mr-1 text-sm cursor-pointer"
            onClick={handleDelete}
          >
            <button
              className={`flex gap-2 border-none rounded-[7px] pt-[3px] pb-[5px] pr-[10px] pl-[10px] bg-red-500 text-white text-xl items-center ${
                deleteMutation.isPending
                  ? "cursor-not-allowed opacity-50"
                  : "cursor-pointer"
              }`}
              disabled={deleteMutation.isPending}
            >
              <Trash />
            </button>
            <p>Delete orders</p>
          </div>
        </div>
      )}
      <div className="w-full overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
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
  );
}
