'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ChevronDown, ChevronRight, Plus, Pencil, Trash2, FolderOpen, FileText, Folder, Loader2 } from 'lucide-react'
import { toast } from 'react-toastify'
import {
  type GuideCategoryWithGuides,
  type GuideItem,
  useCreateGuideCategoriesMutation,
  useCreateGuidesMutation,
  useDeleteGuideCategoriesMutation,
  useDeleteGuidesMutation,
  useGetGuidesQuery,
  useUpdateGuideCategoriesMutation,
  useUpdateGuidesMutation
} from '@/redux/features/guide/guide.api'

type CategoryModalState = {
  isOpen: boolean
  mode: 'add' | 'edit'
  slug?: string
  title: string
  order: number
}

type GuideModalState = {
  isOpen: boolean
  mode: 'add' | 'edit'
  slug?: string
  title: string
  content: string
  categoryId: string
  is_published: boolean
}

const GuidesManagementPage = () => {
  const { data: categories = [], isLoading, isError } = useGetGuidesQuery()
  const [createGuideCategories, { isLoading: isCreatingCategory }] = useCreateGuideCategoriesMutation()
  const [updateGuideCategories, { isLoading: isUpdatingCategory }] = useUpdateGuideCategoriesMutation()
  const [deleteGuideCategories, { isLoading: isDeletingCategory }] = useDeleteGuideCategoriesMutation()
  const [createGuides, { isLoading: isCreatingGuide }] = useCreateGuidesMutation()
  const [updateGuides, { isLoading: isUpdatingGuide }] = useUpdateGuidesMutation()
  const [deleteGuides, { isLoading: isDeletingGuide }] = useDeleteGuidesMutation()

  const [expandedCategories, setExpandedCategories] = useState<string[]>([])
  const [categoryModal, setCategoryModal] = useState<CategoryModalState>({
    isOpen: false,
    mode: 'add',
    title: '',
    order: 1
  })
  const [guideModal, setGuideModal] = useState<GuideModalState>({
    isOpen: false,
    mode: 'add',
    title: '',
    content: '',
    categoryId: '',
    is_published: true
  })

  const getErrorMessage = (error: unknown, fallback: string) => {
    const err = error as { data?: { detail?: string; message?: string } }
    return err?.data?.detail || err?.data?.message || fallback
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric'
    })
  }

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId]
    )
  }

  const openAddCategoryModal = () => {
    const nextOrder = categories.length > 0 ? Math.max(...categories.map((category) => category.order)) + 1 : 1
    setCategoryModal({ isOpen: true, mode: 'add', title: '', order: nextOrder })
  }

  const openEditCategoryModal = (category: GuideCategoryWithGuides) => {
    setCategoryModal({
      isOpen: true,
      mode: 'edit',
      slug: category.slug,
      title: category.title,
      order: category.order
    })
  }

  const closeCategoryModal = () => {
    setCategoryModal({ isOpen: false, mode: 'add', title: '', order: 1 })
  }

  const saveCategory = async () => {
    if (categoryModal.title.trim().length === 0) return

    const payload = {
      title: categoryModal.title.trim(),
      order: categoryModal.order
    }

    try {
      if (categoryModal.mode === 'add') {
        await createGuideCategories(payload).unwrap()
        toast.success('Category created successfully')
      } else if (categoryModal.slug) {
        await updateGuideCategories({ slug: categoryModal.slug, data: payload }).unwrap()
        toast.success('Category updated successfully')
      }

      closeCategoryModal()
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to save category'))
    }
  }

  const deleteCategory = async (slug: string) => {
    try {
      await deleteGuideCategories(slug).unwrap()
      toast.success('Category deleted successfully')
      setExpandedCategories((prev) => prev.filter((id) => id !== slug))
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to delete category'))
    }
  }

  const openEditGuideModal = (guide: GuideItem) => {
    setGuideModal({
      isOpen: true,
      mode: 'edit',
      slug: guide.slug,
      title: guide.title,
      content: guide.content,
      categoryId: String(guide.category),
      is_published: guide.is_published
    })
  }

  const openAddGuideModal = () => {
    if (categories.length === 0) {
      toast.error('Please add a category first')
      return
    }

    setGuideModal({
      isOpen: true,
      mode: 'add',
      title: '',
      content: '',
      categoryId: String(categories[0].id),
      is_published: true
    })
  }

  const closeGuideModal = () => {
    setGuideModal({ isOpen: false, mode: 'add', title: '', content: '', categoryId: '', is_published: true })
  }

  const saveGuide = async () => {
    if (guideModal.title.trim().length === 0 || guideModal.content.trim().length === 0) return

    const payload = {
      category: Number(guideModal.categoryId),
      title: guideModal.title.trim(),
      content: guideModal.content.trim(),
      is_published: guideModal.is_published
    }

    try {
      if (guideModal.mode === 'add') {
        await createGuides(payload).unwrap()
        toast.success('Guide created successfully')
      } else if (guideModal.slug) {
        await updateGuides({ slug: guideModal.slug, data: payload }).unwrap()
        toast.success('Guide updated successfully')
      }

      closeGuideModal()
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to save guide'))
    }
  }

  const deleteGuide = async (slug: string) => {
    try {
      await deleteGuides(slug).unwrap()
      toast.success('Guide deleted successfully')
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to delete guide'))
    }
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex md:items-center gap-4 md:flex-row flex-col justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-title">Guides Management</h1>
          <p className="text-sm text-description mt-1">
            Organize guides by categories
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={openAddCategoryModal}
            className="gap-2 px-4 py-2.5 text-sm font-medium rounded-md border border-slate-400 flex items-center cursor-pointer"
          >
            <Folder className='size-4'/> Add Category
          </button>
          <button
            onClick={openAddGuideModal}
            className="bg-linear-to-r from-button-start via-button-end to-button-start text-white flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium cursor-pointer"
          >
            <Plus size={16} />
            Add Guide
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="py-12 flex items-center justify-center text-description">
          <Loader2 className="size-5 animate-spin mr-2" />
          Loading guides...
        </div>
      ) : null}

      {isError ? (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Failed to load guides.
        </div>
      ) : null}

      {/* Categories List */}
      <div className="space-y-2">
        {categories.map((category) => (
          <div key={category.slug} className="border rounded-lg overflow-hidden">
            {/* Category Header */}
            <div className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition">
              <div className="flex items-center gap-3 flex-1">
                <button
                  onClick={() => toggleCategory(category.slug)}
                  className="p-1 hover:bg-gray-200 rounded transition"
                >
                  {expandedCategories.includes(category.slug) ? (
                    <ChevronDown size={20} style={{ color: '#214572' }} />
                  ) : (
                    <ChevronRight size={20} style={{ color: '#214572' }} />
                  )}
                </button>
                <FolderOpen size={20} style={{ color: '#214572' }} />
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold" style={{ color: '#1A202C' }}>
                    {category.title}
                  </h3>
                  <span className="text-sm bg-gray-200 rounded-sm px-1.5">
                    {category.guides.length}
                  </span>
                </div>
              </div>

              {/* Category Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEditCategoryModal(category)}
                  className="p-2 hover:bg-gray-200 rounded transition"
                >
                  <Pencil size={18} style={{ color: '#214572' }} />
                </button>
                <button
                  onClick={() => deleteCategory(category.slug)}
                  disabled={isDeletingCategory}
                  className="p-2 hover:bg-red-100 rounded transition"
                >
                  <Trash2 size={18} color="#ef4444" />
                </button>
              </div>
            </div>

            {/* Guides List (Expandable) */}
            {expandedCategories.includes(category.slug) && (
              <div className="border-t bg-white">
                {category.guides.length === 0 ? (
                  <div className="p-4 text-center" style={{ color: '#64748B' }}>
                    <p>No guides yet. Add one to get started.</p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {category.guides.map((guide) => (
                      <div key={guide.slug} className="flex items-center justify-between p-4 hover:bg-gray-50 transition">
                        <div className="flex items-center gap-3 flex-1 ml-8">
                          <FileText size={18} style={{ color: '#64748B' }} />
                          <div className="flex flex-col">
                            <p className="font-medium" style={{ color: '#1A202C' }}>
                              {guide.title}
                            </p>
                            <p style={{ color: '#64748B' }} className="text-sm">
                              {guide.content}
                            </p>
                            <span style={{ color: '#64748B' }} className="text-xs mt-1">
                              {formatDate(guide.created_at)}
                            </span>
                          </div>
                        </div>

                        {/* Guide Actions */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEditGuideModal(guide)}
                            className="p-2 hover:bg-gray-200 rounded transition"
                          >
                            <Pencil size={18} style={{ color: '#214572' }} />
                          </button>
                          <button
                            onClick={() => deleteGuide(guide.slug)}
                            disabled={isDeletingGuide}
                            className="p-2 hover:bg-red-100 rounded transition"
                          >
                            <Trash2 size={18} color="#ef4444" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Category Modal */}
      <Dialog open={categoryModal.isOpen} onOpenChange={closeCategoryModal}>
        <DialogContent className="max-w-md" showCloseButton={false}>
          <DialogHeader>
            <DialogTitle className='text-xl font-semibold' style={{ color: '#214572' }}>
              {categoryModal.mode === 'add' ? 'Add New Category' : 'Edit Category'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#1A202C' }}>
                Category Name *
              </label>
              <Input
                value={categoryModal.title}
                onChange={(e) => setCategoryModal({ ...categoryModal, title: e.target.value })}
                placeholder="Enter category name"
                className="border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#1A202C' }}>
                Order *
              </label>
              <Input
                type="number"
                min={1}
                value={categoryModal.order}
                onChange={(e) => setCategoryModal({ ...categoryModal, order: Number(e.target.value) || 1 })}
                className="border"
              />
            </div>
          </div>
          <DialogFooter>
            <button className='border border-slate-400 cursor-pointer py-2.5 px-4 w-full rounded-lg text-title' onClick={closeCategoryModal}>
              Cancel
            </button>
            <Button
              onClick={saveCategory}
              disabled={categoryModal.title.trim().length === 0 || isCreatingCategory || isUpdatingCategory}
              style={{ backgroundColor: '#214572' }}
              className="text-white"
            >
              {categoryModal.mode === 'add' ? 'Create' : 'Update'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Guide Modal */}
      <Dialog open={guideModal.isOpen} onOpenChange={closeGuideModal}>
        <DialogContent className="max-w-2xl" showCloseButton={false}>
          <DialogHeader>
            <DialogTitle className='text-xl font-semibold' style={{ color: '#214572' }}>
              {guideModal.mode === 'add' ? 'Add New Guide' : 'Edit Guide'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {guideModal.mode === 'add' && (
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#1A202C' }}>
                  Category *
                </label>
                <Select value={guideModal.categoryId} onValueChange={(value) => setGuideModal({ ...guideModal, categoryId: value })}>
                  <SelectTrigger className="border">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={String(cat.id)}>
                        {cat.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#1A202C' }}>
                Title *
              </label>
              <Input
                value={guideModal.title}
                onChange={(e) => setGuideModal({ ...guideModal, title: e.target.value })}
                placeholder="Enter guide title"
                className="border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#1A202C' }}>
                Description *
              </label>
              <Textarea
                value={guideModal.content}
                onChange={(e) => setGuideModal({ ...guideModal, content: e.target.value })}
                placeholder="Enter guide description"
                className="border min-h-32 resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <button className='border border-slate-400 cursor-pointer py-2.5 px-4 w-full rounded-lg text-title' onClick={closeGuideModal}>
              Cancel
            </button>
            <Button
              onClick={saveGuide}
              disabled={guideModal.title.trim().length === 0 || guideModal.content.trim().length === 0 || isCreatingGuide || isUpdatingGuide}
              style={{ backgroundColor: '#214572' }}
              className="text-white"
            >
              {guideModal.mode === 'add' ? 'Create' : 'Update'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default GuidesManagementPage
