import z from "zod";

const configSchema = z.object({
  DATABASE_URL: z.string().min(1),
  CLOUDINARY_API_SECRET: z.string().min(1),
  CLOUDINARY_CLOUD_NAME: z.string().min(1),
  CLOUDINARY_API_KEY: z.string().min(1),
  JWT_SECRET: z.string().min(1),
});

export type configSchema = z.infer<typeof configSchema>;

export const config = configSchema.parse(process.env);
