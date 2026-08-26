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
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useAuth, useUser } from "@clerk/react";
import { toast } from "react-toastify";

import { AddUserFormValues, UserFormSchema } from "@repo/types";
import { apiUsersPrivate } from "@/api/api";
import { useState } from "react";
import RequireAdmin from "../RequireAdmin/RequireAdmin";

const AddUser = () => {
  const form = useForm<AddUserFormValues>({
    resolver: zodResolver(UserFormSchema),
    defaultValues: {
      emailAddress: [""],
      password: "",
      firstName: "",
      lastName: "",
      username: "",
    },
  });
  const { user } = useUser();
  const role = user?.publicMetadata.role !== "admin";
  const [notAdmin, setNotAdmin] = useState(false);
  const { getToken } = useAuth();
  const queryclient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: async (data: AddUserFormValues) => {
      try {
        const token = await getToken();

        await apiUsersPrivate.post(`/users`, data, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (error) {
        console.error("Error en petición:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryclient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User has been created");
      form.reset();
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      if (error.response?.status === 401) {
        return setNotAdmin(true);
      }
      const message = error.response?.data?.message || error.message;
      toast.error(`Somethimg went wrong ${message}`);
    },
  });

  function onSubmit(data: AddUserFormValues) {
    if (role) {
      return setNotAdmin(true);
    }
    mutate(data);
  }

  return (
    <div className="overflow-y-auto p-2">
      {notAdmin && <RequireAdmin setState={setNotAdmin} />}
      <SheetHeader>
        <SheetTitle className="mb-1">Add New User</SheetTitle>
        <SheetDescription>Fill the form</SheetDescription>
      </SheetHeader>

      <form id="form-add-user" onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <Controller
            name="emailAddress"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  {...field}
                  id="email"
                  placeholder="email@example.com"
                  autoComplete="off"
                  aria-invalid={fieldState.invalid}
                  value={
                    Array.isArray(field.value)
                      ? field.value[0] || ""
                      : field.value
                  }
                  onChange={(e) => field.onChange([e.target.value])}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  {...field}
                  id="password"
                  type="password"
                  placeholder="********"
                  autoComplete="off"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="firstName"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="firstName">First Name</FieldLabel>
                <Input
                  {...field}
                  id="firstName"
                  placeholder="First name"
                  autoComplete="off"
                  aria-invalid={fieldState.invalid}
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
                  placeholder="Last name"
                  autoComplete="off"
                  aria-invalid={fieldState.invalid}
                />
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
                <FieldLabel htmlFor="username">username</FieldLabel>
                <Input
                  {...field}
                  id="username"
                  placeholder="username"
                  autoComplete="off"
                  aria-invalid={fieldState.invalid}
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
            form="form-add-user"
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

export default AddUser;
