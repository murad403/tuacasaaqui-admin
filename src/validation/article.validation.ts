import z from "zod";

const imageFieldSchema = z
  .any()
  .refine(
    (value) => {
      const hasStringImage = typeof value === "string" && value.trim().length > 0;
      const hasFileImage = typeof File !== "undefined" && value instanceof File;
      return hasStringImage || hasFileImage;
    },
    "Image is required"
  );

export const articleSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title must be 200 characters or less"),
  content: z.string().min(1, "Content is required"),
  category: z.number().int().min(1, "Category is required"),
  location: z.string().min(1, "Location is required").max(100, "Location must be 100 characters or less"),
  image: imageFieldSchema,
  is_featured: z.boolean(),
  is_published: z.boolean(),
});

export type ArticleFormData = z.infer<typeof articleSchema>;
