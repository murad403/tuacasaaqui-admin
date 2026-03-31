/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { Plus, Search, Pencil, Trash2, Eye, CircleCheck, Clock3 } from "lucide-react";
import DeleteArticleModal from "@/components/modal/DeleteArticleModal";
import CustomPagination from "@/components/shared/CustomPagination";
import { useGetNewsQuery, useDeleteNewsMutation } from "@/redux/features/news/news.api";
import { useGetGuideCategoriesQuery } from "@/redux/features/guide/guide.api";
import { toast } from "react-toastify";

interface Article {
  id: number;
  title: string;
  description?: string;
  author_id?: string;
  author_name: string;
  category: string;
  categorySlug: string;
  image?: string;
  is_featured: boolean;
  views: number;
  status: "published" | "draft";
  posted_at?: string;
  publishDate: string;
  slug: string;
}

const normalizeThumbnail = (thumbnail?: string) => {
  if (!thumbnail) return undefined;
  if (thumbnail.startsWith("http://") || thumbnail.startsWith("https://") || thumbnail.startsWith("/")) {
    return thumbnail;
  }
  return undefined;
};

const stripHtmlTags = (value?: string) => {
  if (!value) return "";
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
};

const toSlug = (value?: string) => {
  if (!value) return "";
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

export default function NewsManagementPage() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    article: Article | null;
  }>({ open: false, article: null });

  const queryParams = useMemo(() => {
    const params: Record<string, string> = {};

    if (search.trim()) {
      params.search = search.trim();
    }

    if (categoryFilter !== "all") {
      params.category = categoryFilter;
    }

    return Object.keys(params).length > 0 ? params : undefined;
  }, [search, categoryFilter]);

  const { data: newsData, isLoading } = useGetNewsQuery(queryParams);
  const { data: guideCategories = [] } = useGetGuideCategoriesQuery();
  const [deleteNewsMutation] = useDeleteNewsMutation();

  const articles = useMemo(() => {
    if (!newsData) return [];

    return newsData.map((news: any) => ({
      id: news.id,
      title: news.title,
      description: stripHtmlTags(news.content),
      author_id: news.author,
      author_name: news.author_name,
      category: news.category_name || "Uncategorized",
      categorySlug: news.category_slug || toSlug(news.category_name),
      image: normalizeThumbnail(news.thumbnail),
      is_featured: Boolean(news.is_featured),
      views: news.views_count || 0,
      status: news.is_published ? "published" : "draft",
      posted_at: news.posted_at,
      publishDate: news.created_at,
      slug: news.slug,
    })) as Article[];
  }, [newsData]);

  const categoryOptions = useMemo(() => {
    return guideCategories.map((category) => ({
      slug: category.slug,
      name: category.title,
    }));
  }, [guideCategories]);

  const filteredArticles = articles;

  const totalPages = Math.max(1, Math.ceil(filteredArticles.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedArticles = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * pageSize;
    return filteredArticles.slice(startIndex, startIndex + pageSize);
  }, [filteredArticles, pageSize, safeCurrentPage]);

  // console.log(paginatedArticles)

  const handleDelete = (article: Article) => {
    setDeleteModal({ open: true, article });
  };

  const confirmDelete = async () => {
    if (deleteModal.article) {
      try {
        await deleteNewsMutation(deleteModal.article.slug).unwrap();
        toast.success("Article deleted successfully!", { position: "top-right" });
        setDeleteModal({ open: false, article: null });
      } catch (error) {
        console.error("Failed to delete article:", error);
        toast.error("Failed to delete article. Please try again.", { position: "top-right" });
      }
    }
  };

  if (isLoading) {
    return <div className="text-center py-12">Loading articles...</div>;
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-title">News Management</h1>
          <p className="text-sm text-description mt-1">
            Manage and organize your articles
          </p>
        </div>
        <Link href="/news-management/add-article">
          <button
            type="button"
            className="bg-linear-to-r from-button-start via-button-end to-button-start text-white flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium cursor-pointer"
          >
            <Plus className="size-4" />
            Create News
          </button>
        </Link>
      </div>

      {/* Filters */}
      <div className="mb-6 flex items-center gap-4 flex-col md:flex-row">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
          <input
            placeholder="Search articles..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full h-10 rounded-lg border border-gray-200 bg-white pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => {
            setCategoryFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none"
        >
          <option value="all">All Categories</option>
          {categoryOptions.map((category) => (
            <option key={category.slug} value={category.slug}>
              {category.name}
            </option>
          ))}
        </select>

      </div>

      {/* Articles Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto">
        <table className="w-full min-w-195">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="font-semibold text-description text-left px-5 py-4 text-sm">Article</th>
              <th className="font-semibold text-description text-left px-3 py-4 text-sm">Status</th>
              <th className="font-semibold text-description text-left px-3 py-4 text-sm">Author</th>
              <th className="font-semibold text-description text-left px-3 py-4 text-sm">Date</th>
              <th className="font-semibold text-description text-left px-3 py-4 text-sm">Views</th>
              <th className="font-semibold text-description text-right px-5 py-4 text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredArticles.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="text-center py-12 text-description"
                >
                  No articles found
                </td>
              </tr>
            ) : (
              paginatedArticles.map((article) => {
                const isDraft = article.status === "draft";

                return (
                <tr key={article.id} className="hover:bg-slate-50/70 border-b border-slate-200 last:border-b-0 align-top">
                  <td className="px-5 py-4">
                    <div className="flex items-start gap-3.5">
                      {article.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={article.image}
                          alt={article.title}
                          width={52}
                          height={52}
                          className="rounded-md object-cover shrink-0"
                        />
                      ) : (
                        <div className="w-13 h-13 rounded-md bg-slate-100 text-slate-400 text-[10px] flex items-center justify-center shrink-0">
                          No image
                        </div>
                      )}
                      <div className="min-w-0 max-w-lg">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-title line-clamp-1 text-[15px]">
                            {article.title}
                          </p>
                          {article.is_featured && (
                            <span className="rounded-full bg-amber-100 text-amber-700 text-[11px] font-medium px-2 py-0.5 shrink-0">
                              Featured
                            </span>
                          )}
                        </div>
                        <p className="text-description text-sm mt-1 line-clamp-1">
                          {article.description}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-4">
                    {isDraft ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 text-orange-700 text-xs font-medium px-2.5 py-1">
                        <Clock3 className="size-3.5" />
                        Draft
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium px-2.5 py-1">
                        <CircleCheck className="size-3.5" />
                        Published
                      </span>
                    )}
                  </td>
                  <td className="text-description px-3 py-4 text-sm">
                    {article.author_name}
                  </td>
                  <td className="text-description px-3 py-4 text-sm whitespace-nowrap">
                    {format(new Date(article.publishDate), "MMM d, yyyy")}
                  </td>
                  <td className="text-description px-3 py-4 text-sm">
                    {isDraft ? (
                      "-"
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <Eye size={14} />
                        {article.views.toLocaleString()}
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-3">
                      <Link href={`/news-management/edit-article?slug=${article.slug}`} className="text-description hover:text-title transition-colors">
                        <Pencil size={14} />
                      </Link>
                      <button
                        type="button"
                        className="cursor-pointer text-red-500 hover:text-red-600 transition-colors"
                        onClick={() => handleDelete(article)}
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
                );
              })
            )}
          </tbody>
        </table>

        <CustomPagination
          currentPage={safeCurrentPage}
          totalItems={filteredArticles.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          itemLabel="articles"
        />
      </div>

      {/* Delete Modal */}
      <DeleteArticleModal
        open={deleteModal.open}
        onOpenChange={(open) => setDeleteModal({ open, article: deleteModal.article })}
        articleTitle={deleteModal.article?.title || ""}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
