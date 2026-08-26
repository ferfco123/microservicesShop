import { SheetHeader, SheetTitle } from "../ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { zodResolver } from "@hookform/resolvers/zod";

import { Controller, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import z from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import {
  AddProductFormValues,
  AddProductSchema,
  CategoryType,
  colors,
  sizes,
} from "@repo/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useAuth, useUser } from "@clerk/react";
import { toast } from "react-toastify";
import { apiProductsPublic } from "@/api/api";
import { useState } from "react";
import RequireAdmin from "../RequireAdmin/RequireAdmin";

const AddProduct = () => {
  const { getToken } = useAuth();
  const [uploadingColor, setUploadingColor] = useState<string | null>(null);
  const { user } = useUser();
  const role = user?.publicMetadata.role !== "admin";
  const [notAdmin, setNotAdmin] = useState(false);

  const { data: category } = useQuery<CategoryType[]>({
    queryKey: ["categories"],
    queryFn: async (): Promise<CategoryType[]> => {
      const token = await getToken();
      const res = await apiProductsPublic.get(`/category`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
  });

  const form = useForm<AddProductFormValues>({
    resolver: zodResolver(AddProductSchema),
    defaultValues: {
      name: "",
      shortDescription: "",
      description: "",
      price: 0,
      category: undefined,
      sizes: [],
      colors: [],
      images: {},
    },
  });

  const selectedColors = form.watch("colors") || [];

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof AddProductSchema>) => {
      const token = await getToken();
      console.log("token addproduct", token);

      await apiProductsPublic.post(`/products`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    onSuccess: () => {
      toast.success("Producto creado con éxito");
      form.reset();
    },
    onError: (error: AxiosError) => {
      if (error.response?.status === 401) {
        return setNotAdmin(true);
      }

      toast.error(`Error: ${error.message}`);
    },
  });

  function onSubmit(data: z.infer<typeof AddProductSchema>) {
    if (role) {
      return setNotAdmin(true);
    }
    mutation.mutate(data);
  }

  return (
    <div className="overflow-y-auto p-3 w-full">
      {notAdmin && <RequireAdmin setState={setNotAdmin} />}
      <SheetHeader>
        <SheetTitle className="mb-1">Add New Product</SheetTitle>
      </SheetHeader>

      <form
        id="form-rhf-demo"
        onSubmit={form.handleSubmit(onSubmit, (errors) =>
          console.log("⚠️ ERRORES DE VALIDACIÓN ZOD:", errors),
        )}
      >
        <FieldGroup>
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <Input
                  {...field}
                  id="name"
                  placeholder="Name"
                  autoComplete="off"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="shortDescription"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="shortDescription">
                  Short description
                </FieldLabel>
                <Input
                  {...field}
                  id="shortDescription"
                  placeholder="Short description"
                  autoComplete="off"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="description"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="description">Description</FieldLabel>
                <Textarea
                  {...field}
                  id="description"
                  placeholder="Description"
                  autoComplete="off"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="price"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="price">Price</FieldLabel>
                <Input
                  {...field}
                  id="price"
                  type="number"
                  placeholder="Price"
                  autoComplete="off"
                  onChange={(e) =>
                    field.onChange(
                      e.target.value === "" ? "" : Number(e.target.value),
                    )
                  }
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="category"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="category">Category</FieldLabel>
                <Select
                  name={field.name}
                  defaultValue={field.value}
                  value={field.value || ""}
                  onValueChange={(val) => {
                    field.onChange(val);
                  }}
                >
                  <SelectTrigger onBlur={field.onBlur}>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {category?.map((cat: CategoryType) => {
                      return (
                        <SelectItem key={cat.id} value={cat.slug}>
                          {cat.name}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="sizes"
            control={form.control}
            render={({ field, fieldState }) => {
              const currentValues: string[] = field.value ?? [];

              return (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="sizes">Sizes</FieldLabel>
                  <div className="flex gap-3 flex-wrap">
                    {sizes.map((s) => {
                      const checked = currentValues.includes(s);
                      return (
                        <label
                          key={s}
                          className="flex items-center gap-1 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={(e) => {
                              const nextValues = e.target.checked
                                ? [...currentValues, s]
                                : currentValues.filter((v) => v !== s);

                              field.onChange(nextValues);
                              field.onBlur();
                            }}
                          />
                          {s}
                        </label>
                      );
                    })}
                  </div>

                  {fieldState.error?.message && (
                    <p className="text-xs text-destructive mt-1">
                      {fieldState.error.message}
                    </p>
                  )}
                </Field>
              );
            }}
          />

          <Controller
            name="colors"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="colors">Colors</FieldLabel>
                <div className="flex gap-3 flex-wrap">
                  {colors.map((c) => {
                    const checked = field.value?.includes(c);
                    return (
                      <label
                        key={c}
                        className="flex items-center gap-1 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) => {
                            const updatedColors = e.target.checked
                              ? [...(field.value ?? []), c]
                              : field.value.filter((v) => v !== c);

                            field.onChange(updatedColors);

                            if (!e.target.checked) {
                              const currentImages = {
                                ...form.getValues("images"),
                              };
                              delete currentImages[c];
                              form.setValue("images", currentImages, {
                                shouldValidate: true,
                              });
                            }
                          }}
                        />
                        {c}
                      </label>
                    );
                  })}
                </div>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="images"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="images">
                  Upload Images (one per selected color)
                </FieldLabel>
                {selectedColors.length === 0 ? (
                  <p className="text-xs text-muted-foreground">
                    Select at least one color first.
                  </p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {selectedColors.map((color) => (
                      <div key={color} className="flex items-center gap-2">
                        {color}:
                        <input
                          id={`file-input-${color}`}
                          type="file"
                          accept="image/*"
                          disabled={uploadingColor === color}
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;

                            try {
                              setUploadingColor(color);
                              const formData = new FormData();
                              formData.append("file", file);
                              formData.append(
                                "upload_preset",
                                import.meta.env.VITE_CLOUDINARY_PRESET_NAME,
                              );
                              formData.append("folder", "products");

                              const res = await fetch(
                                `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
                                { method: "POST", body: formData },
                              );

                              const data = await res.json();
                              if (data.secure_url) {
                                const currentImg =
                                  form.getValues("images") || {};
                                form.setValue(
                                  "images",
                                  { ...currentImg, [color]: data.secure_url },
                                  { shouldValidate: true, shouldDirty: true },
                                );
                              }
                            } catch (error) {
                              toast.error(`Upload failed for ${color}`);
                            } finally {
                              setUploadingColor(null);
                            }
                          }}
                        />
                        <label
                          htmlFor={`file-input-${color}`}
                          className="cursor-pointer inline-flex items-center justify-center rounded-md text-xs font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 h-8 px-3 py-1"
                        >
                          {field.value?.[color]
                            ? "Chamge image"
                            : "Upload image"}
                        </label>
                        {uploadingColor === color && (
                          <span className="text-xs text-amber-500">
                            Uploading...
                          </span>
                        )}
                        {field.value?.[color] && (
                          <span className="text-xs text-green-600 truncate ">
                            ✓ Uploaded
                          </span>
                        )}
                        {field.value?.[color] && (
                          <span className="text-xs text-green-600 font-medium truncate ">
                            ✓ Image ready
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>
      </form>

      <Field orientation="horizontal" className="mt-5">
        <Button
          type="button"
          variant="destructive"
          onClick={() => form.reset()}
          disabled={mutation.isPending}
        >
          Reset
        </Button>
        <Button
          type="submit"
          form="form-rhf-demo"
          disabled={mutation.isPending || uploadingColor !== null}
        >
          {mutation.isPending ? "Creating..." : "Submit"}
        </Button>
      </Field>
    </div>
  );
};

export default AddProduct;
