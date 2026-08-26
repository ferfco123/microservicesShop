import { SheetDescription, SheetHeader, SheetTitle } from "../ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { Controller, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { CategoryFormSchema } from "@repo/types";
import z from "zod";
import { useMutation } from "@tanstack/react-query";
import { useAuth, useUser } from "@clerk/react";
import { toast } from "react-toastify";
import { useState } from "react";
import RequireAdmin from "../RequireAdmin/RequireAdmin";
import { apiProductsPublic } from "@/api/api";

export type AddCategoryFormValues = z.infer<typeof CategoryFormSchema>;

const AddCategory = () => {
  const form = useForm<AddCategoryFormValues>({
    resolver: zodResolver(CategoryFormSchema),
    defaultValues: {
      name: "",
      slug: "",
    },
  });

  const { getToken } = useAuth();
  const { user } = useUser();
  const role = user?.publicMetadata.role !== "admin";
  const [notAdmin, setNotAdmin] = useState(false);
  const { mutate, isPending } = useMutation({
    mutationFn: async (data: z.infer<typeof CategoryFormSchema>) => {
      const token = await getToken();
      await apiProductsPublic.post(
        `/category`,
        { data },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
    },
    onSuccess: () => toast.success("Category has been created"),
    onError: (error: AxiosError) => {
      if (error.response?.status === 401) {
        return setNotAdmin(true);
      }

      toast.error(`Something went wrong ${error?.message}`);
    },
  });

  function onSubmit(data: AddCategoryFormValues) {
    if (role) {
      return setNotAdmin(true);
    }
    mutate(data);
  }

  return (
    <div className="overflow-y-auto p-2">
      {notAdmin && <RequireAdmin setState={setNotAdmin} />}
      <SheetHeader>
        <SheetTitle className="mb-1">Add New Category</SheetTitle>
        <SheetDescription>Fill the form</SheetDescription>
      </SheetHeader>
      <form id="form-add-category" onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="category">Category</FieldLabel>
                <Input
                  {...field}
                  id="category"
                  placeholder="Category name"
                  aria-invalid={fieldState.invalid}
                  autoComplete="off"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="slug"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="slug">Slug</FieldLabel>
                <Input
                  {...field}
                  id="slug"
                  placeholder="slug"
                  aria-invalid={fieldState.invalid}
                  autoComplete="off"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>
        <Field orientation="horizontal" className="mt-5">
          <Button
            type="button"
            variant="destructive"
            onClick={() => form.reset()}
          >
            Reset
          </Button>
          <Button
            type="submit"
            form="form-add-category"
            disabled={isPending}
            className="disabled:cursor-not-allowed"
          >
            {isPending ? "Submitting..." : "Submit"}
          </Button>
        </Field>
      </form>
    </div>
  );
};

export default AddCategory;
