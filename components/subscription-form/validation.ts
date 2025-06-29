import z from "zod/v4";

export const subscriptionFormSchema = z.object({
  name: z.string("Name is required"),
  location: z.object({
    latitude: z.number("Latitude is required"),
    longitude: z.number("Longitude is required"),
    name: z.string().min(1, "Location name is required"),
  }),
  status: z.literal(["active", "inactive"])
});
