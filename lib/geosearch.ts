import { z } from "zod/v4";

export const photonFeatureSchema = z.object({
  geometry: z.object({
    coordinates: z.array(z.number()).length(2), // [lon, lat]
  }),
  properties: z.object({
    name: z.string(),
    state: z.string(),
    country: z.string(),
  }),
});

export const photonResponseSchema = z.object({
  features: z.array(photonFeatureSchema),
});

export async function searchCity(query: string) {
  const res = await fetch(
    `https://photon.komoot.io/api/?q=${encodeURIComponent(
      query
    )}&layer=city&limit=5`
  );
  if (!res.ok) throw new Error("Geosearch failed");
  const data = await res.json();

  const parsedData = photonResponseSchema.safeParse(data);

  if (!parsedData.success) {
    throw new Error("Geosearch failed");
  }

  return parsedData.data.features.map((f) => ({
    name: `${f.properties.name}, ${f.properties.state}, ${f.properties.country}`,
    latitude: f.geometry.coordinates[1],
    longitude: f.geometry.coordinates[0],
  }));
}
