"use client";

import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp, Pencil, Plus, Trash2, GripVertical, X, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useGetFaqQuery, useCreateFaqMutation, useDeleteFaqMutation, useUpdateFaqMutation } from "@/redux/features/faq/faq.api";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";

type FaqItem = {
  id: number;
  question: string;
  answer: string;
  order: number;
  is_active: boolean;
};

type FaqModalState = {
  open: boolean;
  mode: "add" | "edit";
  id: number | null;
  question: string;
  answer: string;
  order: number;
  is_active: boolean;
};

export default function FaqPage() {
  const { data: faqs = [], isLoading, error } = useGetFaqQuery(undefined);
  const [createFaq] = useCreateFaqMutation();
  const [deleteFaq] = useDeleteFaqMutation();
  const [updateFaq] = useUpdateFaqMutation();

  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [modal, setModal] = useState<FaqModalState>({
    open: false,
    mode: "add",
    id: null,
    question: "",
    answer: "",
    order: 0,
    is_active: true,
  });

  const modalTitle = modal.mode === "add" ? "Add New FAQ" : "Edit FAQ";
  const modalDescription =
    modal.mode === "add"
      ? "Fill in the details to create a new FAQ"
      : "Update the FAQ details below";

  const canSubmit = useMemo(() => {
    return modal.question.trim().length > 0 && modal.answer.trim().length > 0 && modal.order > 0;
  }, [modal.question, modal.answer, modal.order]);

  const openAddModal = () => {
    const nextOrder = faqs.length > 0 ? Math.max(...(faqs as FaqItem[]).map((f: FaqItem) => f.order)) + 1 : 1;
    setModal({
      open: true,
      mode: "add",
      id: null,
      question: "",
      answer: "",
      order: nextOrder,
      is_active: true,
    });
  };

  const openEditModal = (item: FaqItem) => {
    setModal({
      open: true,
      mode: "edit",
      id: item.id,
      question: item.question,
      answer: item.answer,
      order: item.order,
      is_active: item.is_active,
    });
  };

  const closeModal = () => {
    setModal((prev) => ({ ...prev, open: false }));
  };

  const handleSaveFaq = async () => {
    if (!canSubmit) return;

    try {
      const payload = {
        question: modal.question.trim(),
        answer: modal.answer.trim(),
        order: modal.order,
        is_active: modal.is_active,
      };

      if (modal.mode === "add") {
        await createFaq(payload).unwrap();
        toast.success("FAQ created successfully");
      } else {
        await updateFaq({ id: modal.id, data: payload }).unwrap();
        toast.success("FAQ updated successfully");
      }

      closeModal();
    } catch (error) {
      const err = error as {data?: {detail?: string; message?: string}};
      const errorMsg = err?.data?.detail || err?.data?.message || "Failed to save FAQ";
      toast.error(errorMsg);
    }
  };

  const handleDeleteFaq = async (id: number) => {
    try {
      await deleteFaq(id).unwrap();
      toast.success("FAQ deleted successfully");
      if (expandedId === id) {
        setExpandedId(null);
      }
    } catch (error) {
      const err = error as {data?: {detail?: string; message?: string}};
      const errorMsg = err?.data?.detail || err?.data?.message || "Failed to delete FAQ";
      toast.error(errorMsg);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="size-6 animate-spin text-heading" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        Failed to load ${"FAQ's"}. Please try again later.
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex md:flex-row flex-col items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-title">{"FAQ's"} Management</h1>
          <p className="mt-1 text-sm text-description">
            Manage frequently asked questions with drag-and-drop ordering
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center gap-2 rounded-lg bg-linear-to-r from-button-start via-button-end to-button-start px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 cursor-pointer"
        >
          <Plus className="size-4" />
          Add FAQ
        </button>
      </div>

      <div className="space-y-2 rounded-xl border border-gray-200 bg-white p-2">
        {faqs && faqs.length > 0 ? (
          faqs.map((item: FaqItem) => {
            const isOpen = expandedId === item.id;

            return (
              <div key={item.id} className="rounded-lg border border-gray-200 bg-white">
                <div className="flex items-center gap-3 px-4 py-4">
                  <GripVertical className="size-4 text-gray-400" />

                  <button
                    type="button"
                    onClick={() => setExpandedId(isOpen ? null : item.id)}
                    className="flex flex-1 items-center justify-between gap-3 text-left"
                  >
                    <p className="text-lg font-semibold text-title sm:text-[20px]">
                      {item.question}
                    </p>
                    {isOpen ? (
                      <ChevronUp className="size-4 text-description" />
                    ) : (
                      <ChevronDown className="size-4 text-description" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => openEditModal(item)}
                    className="text-description transition-colors hover:text-title cursor-pointer"
                  >
                    <Pencil className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteFaq(item.id)}
                    className="text-red-500 transition-colors hover:text-red-600 cursor-pointer"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>

                {isOpen ? (
                  <div className="border-t border-gray-200 px-11 py-4 text-sm text-description">
                    {item.answer}
                  </div>
                ) : null}
              </div>
            );
          })
        ) : (
          <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-sm text-description">
            No FAQs yet. Click Add FAQ to create one.
          </div>
        )}
      </div>

      <Dialog open={modal.open} onOpenChange={(open) => setModal((prev) => ({ ...prev, open }))}>
        <DialogContent className="max-w-2xl p-0" showCloseButton={false}>
          <div className="relative p-6 sm:p-6">
            <button
              type="button"
              onClick={closeModal}
              className="absolute right-4 top-4 text-description transition-colors hover:text-title"
            >
              <X className="size-5" />
            </button>

            <DialogHeader className="mb-4">
              <DialogTitle className="text-2xl font-medium text-title">{modalTitle}</DialogTitle>
              <DialogDescription className="text-sm text-description">{modalDescription}</DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-base font-semibold text-title">Question</label>
                <input
                  value={modal.question}
                  onChange={(e) => setModal((prev) => ({ ...prev, question: e.target.value }))}
                  className="h-12 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm outline-none transition focus:border-heading"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-base font-semibold text-title">Answer</label>
                <textarea
                  value={modal.answer}
                  onChange={(e) => setModal((prev) => ({ ...prev, answer: e.target.value }))}
                  className="min-h-28 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none transition focus:border-heading"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-base font-semibold text-title">Order</label>
                  <input
                    type="number"
                    value={modal.order}
                    onChange={(e) => setModal((prev) => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                    className="h-12 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm outline-none transition focus:border-heading"
                    min="1"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-base font-semibold text-title">Active</label>
                  <div className="flex h-12 items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-3">
                    <input
                      type="checkbox"
                      checked={modal.is_active}
                      onChange={(e) => setModal((prev) => ({ ...prev, is_active: e.target.checked }))}
                      className="size-4 cursor-pointer rounded accent-heading"
                    />
                    <span className="text-sm text-title">{modal.is_active ? "Active" : "Inactive"}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-1">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-lg border w-full cursor-pointer border-gray-300 px-5 py-2 font-medium text-title transition-colors hover:bg-gray-50"
                >
                  Cancel
                </button>
                <Button
                  type="button"
                  onClick={handleSaveFaq}
                  disabled={!canSubmit}
                  
                >
                  {modal.mode === "add" ? "Create" : "Update"}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
