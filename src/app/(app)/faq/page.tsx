"use client";

import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp, Pencil, Plus, Trash2, GripVertical, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

type FaqItem = {
  id: number;
  question: string;
  answer: string;
};

type FaqModalState = {
  open: boolean;
  mode: "add" | "edit";
  id: number | null;
  question: string;
  answer: string;
};

const initialFaqs: FaqItem[] = [
  {
    id: 1,
    question: "How do I reset my password?",
    answer: "You can reset your password by clicking the \"Forgot Password\" link on the login page.",
  },
  {
    id: 2,
    question: "What payment methods do you accept?",
    answer: "We accept major credit cards, debit cards, and selected digital wallet payments.",
  },
  {
    id: 3,
    question: "Is there a mobile app available?",
    answer: "Yes, our mobile app is available for both Android and iOS with the same core features.",
  },
];

export default function FaqPage() {
  const [faqs, setFaqs] = useState<FaqItem[]>(initialFaqs);
  const [expandedId, setExpandedId] = useState<number>(1);
  const [modal, setModal] = useState<FaqModalState>({
    open: false,
    mode: "add",
    id: null,
    question: "",
    answer: "",
  });

  const modalTitle = modal.mode === "add" ? "Add New FAQ" : "Edit FAQ";
  const modalDescription =
    modal.mode === "add"
      ? "Fill in the details to create a new FAQ"
      : "Update the FAQ details below";

  const canSubmit = useMemo(() => {
    return modal.question.trim().length > 0 && modal.answer.trim().length > 0;
  }, [modal.question, modal.answer]);

  const openAddModal = () => {
    setModal({
      open: true,
      mode: "add",
      id: null,
      question: "",
      answer: "",
    });
  };

  const openEditModal = (item: FaqItem) => {
    setModal({
      open: true,
      mode: "edit",
      id: item.id,
      question: item.question,
      answer: item.answer,
    });
  };

  const closeModal = () => {
    setModal((prev) => ({ ...prev, open: false }));
  };

  const handleSaveFaq = () => {
    if (!canSubmit) return;

    if (modal.mode === "add") {
      const nextId = faqs.length > 0 ? Math.max(...faqs.map((f) => f.id)) + 1 : 1;
      const newItem: FaqItem = {
        id: nextId,
        question: modal.question.trim(),
        answer: modal.answer.trim(),
      };
      setFaqs((prev) => [newItem, ...prev]);
      setExpandedId(newItem.id);
    } else {
      setFaqs((prev) =>
        prev.map((item) =>
          item.id === modal.id
            ? {
                ...item,
                question: modal.question.trim(),
                answer: modal.answer.trim(),
              }
            : item
        )
      );
    }

    closeModal();
  };

  const handleDeleteFaq = (id: number) => {
    setFaqs((prev) => prev.filter((item) => item.id !== id));
    if (expandedId === id) {
      setExpandedId(0);
    }
  };

  return (
    <div>
      <div className="mb-6 flex md:flex-row flex-col items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-title">FAQ Management</h1>
          <p className="mt-1 text-sm text-description">
            Manage frequently asked questions with drag-and-drop ordering
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center gap-2 rounded-lg bg-linear-to-r from-button-start via-button-end to-button-start px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          <Plus className="size-4" />
          Add FAQ
        </button>
      </div>

      <div className="space-y-2 rounded-xl border border-gray-200 bg-white p-2">
        {faqs.map((item) => {
          const isOpen = expandedId === item.id;

          return (
            <div key={item.id} className="rounded-lg border border-gray-200 bg-white">
              <div className="flex items-center gap-3 px-4 py-4">
                <GripVertical className="size-4 text-gray-400" />

                <button
                  type="button"
                  onClick={() => setExpandedId(isOpen ? 0 : item.id)}
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
                  className="text-description transition-colors hover:text-title"
                >
                  <Pencil className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteFaq(item.id)}
                  className="text-red-500 transition-colors hover:text-red-600"
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
        })}

        {faqs.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-sm text-description">
            No FAQs yet. Click Add FAQ to create one.
          </div>
        ) : null}
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
                <label className="mb-1.5 block text-base font-semibold text-title">Question *</label>
                <input
                  value={modal.question}
                  onChange={(e) => setModal((prev) => ({ ...prev, question: e.target.value }))}
                  className="h-12 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm outline-none transition focus:border-heading"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-base font-semibold text-title">Answer *</label>
                <textarea
                  value={modal.answer}
                  onChange={(e) => setModal((prev) => ({ ...prev, answer: e.target.value }))}
                  className="min-h-28 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none transition focus:border-heading"
                />
              </div>

              <div className="flex justify-end gap-3 pt-1">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-lg border border-gray-300 px-5 py-2 font-medium text-title transition-colors hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveFaq}
                  disabled={!canSubmit}
                  className="rounded-lg bg-linear-to-r from-button-start via-button-end to-button-start px-5 py-2 font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {modal.mode === "add" ? "Create" : "Update"}
                </button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
