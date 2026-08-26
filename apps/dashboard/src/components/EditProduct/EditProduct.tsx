import { SheetDescription, SheetHeader, SheetTitle } from "../ui/sheet";
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

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth, useUser } from "@clerk/react";
import { apiProductsPublic } from "@/api/api";

import { toast } from "react-toastify";
import {
  AddProductFormValues,
  AddProductSchema,
  CategoryType,
  colors,
  ColorType,
  ProductType,
  sizes,
  SizeType,
} from "@repo/types";
import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import RequireAdmin from "../RequireAdmin/RequireAdmin";

type productType = { product: ProductType; onClose?: () => void };

const EditUser = ({ product, onClose }: productType) => {
  const { user } = useUser();
  const role = user?.publicMetadata.role !== "admin";
  const [notAdmin, setNotAdmin] = useState(false);
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  const [uploadingColor, setUploadingColor] = useState<string | null>(null);

  const { data: category } = useQuery<CategoryType[]>({
    queryKey: ["categories"],
    queryFn: async (): Promise<CategoryType[]> => {
      const token = await getToken();
      const res = await apiProductsPublic.get(`/products/category`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
  });

  const initialImages =
    (product?.images as Record<string, string> | undefined) || {};
  const form = useForm<AddProductFormValues>({
    resolver: zodResolver(AddProductSchema),
    defaultValues: {
      name: product?.name || "",
      shortDescription: product?.shortDescription || "",
      description: product?.description || "",
      price: product?.price || 0,
      category: product?.categorySlug || product?.categorySlug || "",
      sizes: (product?.sizes as SizeType[]) || [],
      colors: (product?.colors as ColorType[]) || [],
      images: initialImages,
    },
  });

  useEffect(() => {
    if (product) {
      form.reset({
        name: product.name || "",
        shortDescription: product.shortDescription || "",
        description: product.description || "",
        price: product.price || 0,
        category: product.categorySlug || product.categorySlug || "",
        sizes: (product?.sizes as SizeType[]) || [],
        colors: (product?.colors as ColorType[]) || [],
        images: (product.images as Record<string, string>) || {},
      });
    }
  }, [product, form]);
  const selectedColors = form.watch("colors") || [];
  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof AddProductSchema>) => {
      const token = await getToken();
      await apiProductsPublic.put(`/products/${product.id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    onSuccess: () => {
      toast.success("Product has been updated");
      queryClient.invalidateQueries({ queryKey: ["product", product.id] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      if (onClose) onClose();
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
    <div className="overflow-y-auto p-2">
      {notAdmin && <RequireAdmin setState={setNotAdmin} />}
      <SheetHeader>
        <SheetTitle className="mb-1">Edit Product</SheetTitle>
        <SheetDescription>Update product information</SheetDescription>
      </SheetHeader>

      <form id="form-edit-product" onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          {/* Name */}
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

          {/* Short Description */}
          <Controller
            name="shortDescription"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="shortdescription">
                  Short description
                </FieldLabel>
                <Input
                  {...field}
                  value={(field.value as string) ?? ""}
                  id="shortdescription"
                  placeholder="Short description"
                  autoComplete="off"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* Description */}
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

          {/* Price */}
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

          {/* Category */}
          <Controller
            name="category"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="category">Category</FieldLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {category?.map((cat: CategoryType) => (
                      <SelectItem key={cat.id} value={cat.slug}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* Sizes */}
          <Controller
            name="sizes"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="sizes">Sizes</FieldLabel>
                <div className="flex gap-3 flex-wrap">
                  {sizes.map((s) => {
                    const checked = field.value?.includes(s);
                    return (
                      <label
                        key={s}
                        className="flex items-center gap-1 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) => {
                            field.onChange(
                              e.target.checked
                                ? [...(field.value ?? []), s]
                                : field.value.filter((v) => v !== s),
                            );
                          }}
                        />
                        {s}
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

          {/* Colors */}
          <Controller
            name="colors"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="colors">Colors</FieldLabel>
                <div className="flex gap-3">
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

          {/* Upload / Change Images */}
          <Controller
            name="images"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="images">
                  Product Images (one per selected color)
                </FieldLabel>
                {selectedColors.length === 0 ? (
                  <p className="text-xs text-muted-foreground">
                    Select at least one color first.
                  </p>
                ) : (
                  <div className="flex flex-col gap-3">
                    {selectedColors.map((color) => {
                      const currentImgUrl = field.value?.[color];
                      return (
                        <div
                          key={color}
                          className="flex items-center gap-3 border p-2 rounded-md"
                        >
                          {currentImgUrl && (
                            <img
                              src={currentImgUrl}
                              alt={color}
                              className="h-10 w-10 object-cover rounded border"
                            />
                          )}
                          <label className="flex-1 text-sm font-medium">
                            {color}:
                            <input
                              type="file"
                              accept="image/*"
                              disabled={uploadingColor === color}
                              className="block text-xs mt-1"
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
                                      {
                                        ...currentImg,
                                        [color]: data.secure_url,
                                      },
                                      {
                                        shouldValidate: true,
                                        shouldDirty: true,
                                      },
                                    );
                                  }
                                } catch (error) {
                                  toast.error(`Upload failed for ${color}`);
                                } finally {
                                  setUploadingColor(null);
                                }
                              }}
                            />
                          </label>
                          {uploadingColor === color && (
                            <span className="text-xs text-amber-500">
                              Uploading...
                            </span>
                          )}
                        </div>
                      );
                    })}
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
          variant="outline"
          onClick={() => product && form.reset()}
          disabled={mutation.isPending}
        >
          Reset
        </Button>
        <Button
          type="submit"
          form="form-edit-product"
          disabled={mutation.isPending || uploadingColor !== null}
        >
          {mutation.isPending ? "Updating..." : "Update Product"}
        </Button>
      </Field>
    </div>
  );
};

export default EditUser;
