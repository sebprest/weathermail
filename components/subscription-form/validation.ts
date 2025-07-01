import z from "zod/v4";

export const subscriptionFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  location: z.object({
    latitude: z.number(),
    longitude: z.number(),
    name: z.string().min(1, "Location is required"),
  }),
  status: z.literal(["active", "inactive"])
});
