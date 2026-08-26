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
import { FormSchema, formSchema } from "./EditUser.schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getToken, useUser } from "@clerk/react";
import { apiUsersPrivate } from "@/api/api";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useState } from "react";
import RequireAdmin from "../RequireAdmin/RequireAdmin";
import { AxiosError } from "axios";

const EditUser = () => {
  const location = useLocation();
  const { user } = useUser();
  const role = user?.publicMetadata.role !== "admin";
  const [notAdmin, setNotAdmin] = useState(false);
  const id = location.pathname.split("/").slice(-1)[0];
  const queryClient = useQueryClient();
  const updateUser = useMutation({
    mutationFn: async (data: FormSchema) => {
      const token = await getToken();
      const cleanData = Object.fromEntries(
        Object.entries(data).filter(
          ([_, value]) => value !== "" && value !== null && value !== undefined,
        ),
      );
      const res = await apiUsersPrivate.patch(`/users/${id}`, cleanData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", id] });
      toast.success("User has been updated");
    },
    onError: (error: AxiosError) => {
      if (error.response?.status === 401) {
        return setNotAdmin(true);
      }
      toast.error("Something went wrong");
    },
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      role: "",
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    if (role) {
      return setNotAdmin(true);
    }
    const cleanData = Object.entries(data).filter(
      ([_, value]) => value !== "" && value !== null && value !== undefined,
    ).length;

    if (cleanData) {
      updateUser.mutate(data);
    }
  }
  return (
    <div>
      {notAdmin && <RequireAdmin setState={setNotAdmin} />}
      <SheetHeader>
        <SheetTitle className="mb-4">Edit user</SheetTitle>
        <SheetDescription>
          <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                name="firstName"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="firtsName">FirtsName</FieldLabel>
                    <Input
                      {...field}
                      id="firstName"
                      placeholder="firtsName"
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
                name="lastName"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
                    <Input
                      {...field}
                      id="lastName"
                      aria-invalid={fieldState.invalid}
                      placeholder="LastName"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="username"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="username">Username</FieldLabel>
                    <Input
                      {...field}
                      id="username"
                      aria-invalid={fieldState.invalid}
                      placeholder="username"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="role"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="role">Role</FieldLabel>
                    <Input
                      {...field}
                      id="role"
                      aria-invalid={fieldState.invalid}
                      placeholder="role"
                      autoComplete="off"
                    />
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
            >
              Reset
            </Button>
            <Button type="submit" form="form-rhf-demo">
              Submit
            </Button>
          </Field>
        </SheetDescription>
      </SheetHeader>
    </div>
  );
};

export default EditUser;
