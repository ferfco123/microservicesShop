export interface CustomJWTSessionsClaims {
  metadata?: { role?: "user" | "admin" };
}

import "@clerk/types";
import z from "zod";

export interface SimplifiedUser {
  id: string;
  fullName: string;
  email: string | undefined;
  avatar: string;
  role: string;
}
export type SafeUser = {
  id: string;
  banned: string;
  firstName?: string | null;
  lastName?: string | null;
  emailAddresses: {
    id: string;
    emailAddress: string;
    verification: {
      status: string;
      strategy: string;
    };
    createdAt: string;
    updatedAt: string;
  }[];
  imageUrl?: string;
  phoneNumbers?: {
    id: string;
    phoneNumber: string;
    verification: {
      status: string;
      strategy: string;
    };
    createdAt: string;
    updatedAt: string;
  }[];
  publicMetadata: Record<string, unknown>;
  address?: string | null;
  city?: string | null;
  completion?: number;
  verified?: boolean;
  popular?: boolean;
  username?: string;
  status?: string;
};
declare global {
  interface CustomJwtSessionClaims {
    metadata?: {
      role?: "admin" | "user";
    };
  }
}

export const UserFormSchema = z.object({
  emailAddress: z.array(
    z
      .string()
      .min(1, "Email is required")
      .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email"),
  ),
  password: z.string().min(8, "Password must be at least 8 characters"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  username: z.string().min(1, "Username is required"),
});
export type AddUserFormValues = z.infer<typeof UserFormSchema>;
