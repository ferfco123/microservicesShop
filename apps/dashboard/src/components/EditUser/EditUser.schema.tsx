import z from "zod";

export const formSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  username: z.string(),
  role: z.string(),
});
export type FormSchema = z.infer<typeof formSchema>;
