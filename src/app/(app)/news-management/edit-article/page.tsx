"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ArticleForm from "@/components/shared/ArticleForm";
import type { ArticleFormData } from "@/validation/article.validation";
import { useGetSingleNewsQuery, useUpdateNewsMutation } from "@/redux/features/news/news.api";
import { toast } from "react-toastify";

function EditArticleContent() {
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug") || "";

  const { data: article, isLoading: isFetching } = useGetSingleNewsQuery(slug, {
    skip: !slug,
  });
  const [updateNews, { isLoading }] = useUpdateNewsMutation();

  const defaultValues = article ? {
    category: Number(article.category),
    title: article.title,
    location: article.location,
    content: article.content,
    image: article.thumbnail,
    is_featured: Boolean(article.is_featured),
    is_published: Boolean(article.is_published),
  } : undefined;

  const handleSubmit = async (data: ArticleFormData) => {
    if (!slug) {
      toast.error("Invalid article link. Please try again.");
      return;
    }

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
      
      await updateNews({ slug, data: payload }).unwrap();
      toast.success("Article updated successfully!");
      window.location.replace("/news-management");
    } catch (error) {
      console.error("Failed to update article:", error);
      toast.error("Failed to update article. Please try again.");
    }
  };

  if (isFetching) {
    return <div className="text-center py-12">Loading article...</div>;
  }

  return (
    <ArticleForm
      defaultValues={defaultValues}
      onSubmit={handleSubmit}
      isEditing
      isLoading={isLoading}
    />
  );
}

export default function EditArticlePage() {
  return (
    <Suspense>
      <EditArticleContent />
    </Suspense>
  );
}
