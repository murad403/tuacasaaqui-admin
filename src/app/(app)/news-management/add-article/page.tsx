"use client";

import { useRouter } from "next/navigation";
import ArticleForm from "@/components/shared/ArticleForm";
import type { ArticleFormData } from "@/validation/article.validation";
import { useCreateNewsMutation } from "@/redux/features/news/news.api";
import { toast } from "react-toastify";

export default function AddArticlePage() {
  const router = useRouter();
  const [createNews, { isLoading }] = useCreateNewsMutation();

  const handleSubmit = async (data: ArticleFormData) => {
    try {
      const payload = {
        category: data.category,
        title: data.title,
        location: data.location,
        thumbnail: data.image instanceof File ? data.image : undefined,
        content: data.content,
        is_featured: data.is_featured,
        is_published: data.is_published,
      };
      
      await createNews(payload).unwrap();
      toast.success("Article created successfully!", { position: "top-right" });
      router.push("/news-management");
    } catch (error) {
      console.error("Failed to create article:", error);
      toast.error("Failed to create article. Please try again.", { position: "top-right" });
    }
  };

  return <ArticleForm onSubmit={handleSubmit} isLoading={isLoading} />;
}
