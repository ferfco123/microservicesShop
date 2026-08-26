import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React, { useState } from "react";
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

import { columns } from "./Columns.products";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { productsType, ProductType } from "@repo/types";
import { apiProductsPublic } from "@/api/api";
import { getToken, useUser } from "@clerk/react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { SearchBar } from "@/components/SearchBar/SearchBar";
import RequireAdmin from "@/components/RequireAdmin/RequireAdmin";
import { AxiosError } from "axios";

const Products = () => {
  const [sorting, setSorting] = React.useState<any>([]);

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [rowSelection, setRowSelection] = useState({});
  const navigate = useNavigate();
  const [notAdmin, setNotAdmin] = useState(false);
  const queryClient = useQueryClient();
  const { user } = useUser();
  const role = user?.publicMetadata.role !== "admin";
  const [searchParams] = useSearchParams();
  const stringParams = searchParams.toString();
  const { data = [], isLoading } = useQuery<productsType>({
    queryKey: ["products", stringParams],
    queryFn: async (): Promise<productsType> => {
      const res = await apiProductsPublic.get(`/products?${stringParams}`);
      return res.data;
    },
  });
  const deleteMutation = useMutation({
    mutationFn: async (ids: number[]) => {
      const token = await getToken();

      await apiProductsPublic.delete(`/products`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { ids: ids },
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      navigate("/products");
      toast.success("Product has been deleted");
    },
    onError: (error: AxiosError) => {
      if (error.response?.status === 401) {
        return setNotAdmin(true);
      }
      console.log("errorrrrrr", error);
      toast.error("Something went wrong");
    },
  });
  const table = useReactTable<ProductType>({
    data,
    columns,
    getRowId: (row) => row.id.toString(),
    getCoreRowModel: getCoreRowModel(),

    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelection,
    enableRowSelection: true,

    state: {
      pagination,
      sorting,
      rowSelection,
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (!data || !columns) return <div>Loading...</div>;

  return (
    <div className="overflow-hidden rounded-md border">
      {notAdmin && <RequireAdmin setState={setNotAdmin} />}
      <SearchBar placeholder="Search product by name..." state="search" />
      {Object.keys(rowSelection).length > 0 && (
        <div className="flex">
          <div className="ml-auto flex items-center gap-2 bg-red-500 text-white p-2 rounded-md mr-1 text-sm ">
            <button
              className={`flex gap-2 border-none rounded-[7px] pt-0.75 pb-1.25 pr-2.5 pl-2.5 bg-red-500 text-white text-xl items-center ${
                deleteMutation.isPending
                  ? "cursor-not-allowed opacity-50"
                  : "cursor-pointer"
              }`}
              disabled={deleteMutation.isPending}
              onClick={() => {
                if (role) {
                  return setNotAdmin(true);
                }
                const selectedIds = Object.keys(rowSelection).map(Number);
                deleteMutation.mutate(selectedIds);
              }}
            >
              <Trash />
              <p>Delete products</p>
            </button>
          </div>
        </div>
      )}
      <Table className=" ">
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
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
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
  );
};

export default Products;
