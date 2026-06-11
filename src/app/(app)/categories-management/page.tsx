"use client";
import { useState, useMemo } from "react";
import { Plus, Search, Pencil, Trash2, FolderOpen } from "lucide-react";
import {
  useGetNewsCategoriesQuery,
  useCreateNewsCategoryMutation,
  useUpdateNewsCategoryMutation,
  useDeleteNewsCategoryMutation,
} from "@/redux/features/news/news.api";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import CustomPagination from "@/components/shared/CustomPagination";

export default function CategoriesManagementPage() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const [editModal, setEditModal] = useState<{
    open: boolean;
    id: number | null;
    name: string;
  }>({ open: false, id: null, name: "" });

  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    id: number | null;
    name: string;
  }>({ open: false, id: null, name: "" });

  // Redux hooks
  const { data: categories = [], isLoading } = useGetNewsCategoriesQuery();
  const [createCategory, { isLoading: isCreating }] = useCreateNewsCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateNewsCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteNewsCategoryMutation();

  // Local filter
  const filteredCategories = useMemo(() => {
    if (!categories) return [];
    return categories.filter((category) => {
      const query = search.toLowerCase().trim();
      return (
        category.name.toLowerCase().includes(query) ||
        category.slug.toLowerCase().includes(query)
      );
    });
  }, [categories, search]);

  // Pagination logic
  const totalPages = Math.max(1, Math.ceil(filteredCategories.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  
  const paginatedCategories = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * pageSize;
    return filteredCategories.slice(startIndex, startIndex + pageSize);
  }, [filteredCategories, pageSize, safeCurrentPage]);

  // Actions
  const handleCreate = async () => {
    const name = newCategoryName.trim();
    if (!name) return;

    try {
      const response = await createCategory({ name }).unwrap();
      toast.success(response.message || "Category created successfully", { position: "top-right" });
      setIsCreateModalOpen(false);
      setNewCategoryName("");
    } catch (error: any) {
      const message = error?.data?.detail || error?.data?.message || "Failed to create category.";
      toast.error(message, { position: "top-right" });
    }
  };

  const handleUpdate = async () => {
    const name = editModal.name.trim();
    if (!name || editModal.id === null) return;

    try {
      const response = await updateCategory({ id: editModal.id, data: { name } }).unwrap();
      toast.success(response.message || "Category updated successfully", { position: "top-right" });
      setEditModal({ open: false, id: null, name: "" });
    } catch (error: any) {
      const message = error?.data?.detail || error?.data?.message || "Failed to update category.";
      toast.error(message, { position: "top-right" });
    }
  };

  const handleDelete = async () => {
    if (deleteModal.id === null) return;

    try {
      await deleteCategory(deleteModal.id).unwrap();
      toast.success("Category deleted successfully", { position: "top-right" });
      setDeleteModal({ open: false, id: null, name: "" });
    } catch (error: any) {
      const message = error?.data?.detail || error?.data?.message || "Failed to delete category.";
      toast.error(message, { position: "top-right" });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex md:items-center gap-4 md:flex-row flex-col justify-between">
        <div>
          <h1 className="text-2xl font-bold text-title">Categories Management</h1>
          <p className="text-sm text-description mt-1">
            Manage and organize your news categories
          </p>
        </div>
        <div>
          <Button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2"
            style={{ backgroundColor: "#214572" }}
          >
            <Plus className="size-5" />
            Add Category
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
          <input
            placeholder="Search categories..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full h-10 rounded-lg border border-gray-200 bg-white pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto">
        {isLoading ? (
          <div className="text-center py-12 text-description">Loading categories...</div>
        ) : (
          <>
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="font-semibold text-description text-left px-5 py-4 text-sm w-16">ID</th>
                  <th className="font-semibold text-description text-left px-5 py-4 text-sm">Category Name</th>
                  <th className="font-semibold text-description text-left px-5 py-4 text-sm">Slug</th>
                  <th className="font-semibold text-description text-right px-5 py-4 text-sm w-32">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-12 text-description">
                      No categories found
                    </td>
                  </tr>
                ) : (
                  paginatedCategories.map((category) => (
                    <tr key={category.id} className="hover:bg-slate-50/70 border-b border-slate-200 last:border-b-0">
                      <td className="px-5 py-4 text-sm text-description font-mono">{category.id}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <FolderOpen className="size-4 text-slate-400" />
                          <span className="font-medium text-title text-[15px]">{category.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-description font-mono">{category.slug}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            type="button"
                            onClick={() => setEditModal({ open: true, id: category.id, name: category.name })}
                            className="cursor-pointer text-description hover:text-title transition-colors"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteModal({ open: true, id: category.id, name: category.name })}
                            className="cursor-pointer text-red-500 hover:text-red-600 transition-colors"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            <CustomPagination
              currentPage={safeCurrentPage}
              totalItems={filteredCategories.length}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
              itemLabel="categories"
            />
          </>
        )}
      </div>

      {/* Create Dialog */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-md" showCloseButton={false}>
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-title">Add News Category</DialogTitle>
          </DialogHeader>
          <div className="py-2">
            <label className="block text-sm font-medium text-title mb-2">
              Category Name
            </label>
            <Input
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Enter category name"
              className="border"
            />
          </div>
          <DialogFooter className="gap-4 sm:gap-0">
            <button
              type="button"
              className="border border-slate-400 cursor-pointer py-2.5 px-4 w-full rounded-lg text-title hover:bg-slate-50 transition-colors"
              onClick={() => {
                setIsCreateModalOpen(false);
                setNewCategoryName("");
              }}
            >
              Cancel
            </button>
            <Button
              type="button"
              onClick={handleCreate}
              disabled={!newCategoryName.trim() || isCreating}
              className="text-white w-full"
              style={{ backgroundColor: "#214572" }}
            >
              {isCreating ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editModal.open} onOpenChange={(open) => !open && setEditModal({ open: false, id: null, name: "" })}>
        <DialogContent className="max-w-md" showCloseButton={false}>
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-title">Edit News Category</DialogTitle>
          </DialogHeader>
          <div className="py-2">
            <label className="block text-sm font-medium text-title mb-2">
              Category Name
            </label>
            <Input
              value={editModal.name}
              onChange={(e) => setEditModal({ ...editModal, name: e.target.value })}
              placeholder="Enter category name"
              className="border"
            />
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <button
              type="button"
              className="border border-slate-400 cursor-pointer py-2.5 px-4 w-full rounded-lg text-title hover:bg-slate-50 transition-colors"
              onClick={() => setEditModal({ open: false, id: null, name: "" })}
            >
              Cancel
            </button>
            <Button
              type="button"
              onClick={handleUpdate}
              disabled={!editModal.name.trim() || isUpdating}
              className="text-white w-full"
              style={{ backgroundColor: "#214572" }}
            >
              {isUpdating ? "Updating..." : "Update"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteModal.open} onOpenChange={(open) => !open && setDeleteModal({ open: false, id: null, name: "" })}>
        <DialogContent className="sm:max-w-md" showCloseButton={false}>
          <DialogHeader>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-2">
              <Trash2 className="h-6 w-6 text-red-600" />
            </div>
            <DialogTitle className="text-center">Delete Category</DialogTitle>
            <DialogDescription className="text-center">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-foreground">
                &quot;{deleteModal.name}&quot;
              </span>
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-row justify-center gap-3 sm:justify-center">
            <button
              onClick={() => setDeleteModal({ open: false, id: null, name: "" })}
              className="w-full border border-gray-400 rounded-lg cursor-pointer hover:bg-gray-100 py-2.5 px-4 text-title"
            >
              Cancel
            </button>
            <Button
              onClick={handleDelete}
              disabled={isDeleting}
              className="min-w-25 bg-red-600 hover:bg-red-700 text-white w-full"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}