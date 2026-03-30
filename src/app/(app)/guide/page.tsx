'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ChevronDown, ChevronRight, Plus, Pencil, Trash2, FolderOpen, FileText, Folder } from 'lucide-react'

interface Guide {
  id: string
  title: string
  description: string
  categoryId: string
  date: string
}

interface Category {
  id: string
  name: string
  guides: Guide[]
}

const GuidesManagementPage = () => {
  const [categories, setCategories] = useState<Category[]>([
    {
      id: '1',
      name: 'Getting Started',
      guides: [
        {
          id: 'g1',
          title: 'How to Get Started',
          description: 'A comprehensive guide for beginners',
          categoryId: '1',
          date: 'Mar 20, 2026'
        }
      ]
    },
    {
      id: '2',
      name: 'Advanced Features',
      guides: [
        {
          id: 'g2',
          title: 'Advanced Configuration',
          description: 'Learn advanced features and customization',
          categoryId: '2',
          date: 'Mar 18, 2026'
        }
      ]
    },
    {
      id: '3',
      name: 'Troubleshooting',
      guides: []
    }
  ])

  const [expandedCategories, setExpandedCategories] = useState<string[]>(['1', '2', '3'])
  const [categoryModal, setCategoryModal] = useState<{
    isOpen: boolean
    mode: 'add' | 'edit'
    id?: string
    name: string
  }>({ isOpen: false, mode: 'add', name: '' })
  const [guideModal, setGuideModal] = useState<{
    isOpen: boolean
    mode: 'add' | 'edit'
    id?: string
    title: string
    description: string
    categoryId: string
  }>({ isOpen: false, mode: 'add', title: '', description: '', categoryId: '' })

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId]
    )
  }

  const openAddCategoryModal = () => {
    setCategoryModal({ isOpen: true, mode: 'add', name: '' })
  }

  const openEditCategoryModal = (id: string, name: string) => {
    setCategoryModal({ isOpen: true, mode: 'edit', id, name })
  }

  const closeCategoryModal = () => {
    setCategoryModal({ isOpen: false, mode: 'add', name: '' })
  }

  const saveCategory = () => {
    if (categoryModal.name.trim().length === 0) return

    if (categoryModal.mode === 'add') {
      const newCategory: Category = {
        id: Date.now().toString(),
        name: categoryModal.name,
        guides: []
      }
      setCategories([...categories, newCategory])
      setExpandedCategories((prev) => [...prev, newCategory.id])
    } else if (categoryModal.id) {
      setCategories((prev) =>
        prev.map((cat) => (cat.id === categoryModal.id ? { ...cat, name: categoryModal.name } : cat))
      )
    }
    closeCategoryModal()
  }

  const deleteCategory = (categoryId: string) => {
    setCategories((prev) => prev.filter((cat) => cat.id !== categoryId))
    setExpandedCategories((prev) => prev.filter((id) => id !== categoryId))
  }


  const openEditGuideModal = (categoryId: string, guide: Guide) => {
    setGuideModal({
      isOpen: true,
      mode: 'edit',
      id: guide.id,
      title: guide.title,
      description: guide.description,
      categoryId
    })
  }

  const closeGuideModal = () => {
    setGuideModal({ isOpen: false, mode: 'add', title: '', description: '', categoryId: '' })
  }

  const saveGuide = () => {
    if (guideModal.title.trim().length === 0 || guideModal.description.trim().length === 0) return

    setCategories((prev) =>
      prev.map((cat) => {
        if (cat.id === guideModal.categoryId) {
          if (guideModal.mode === 'add') {
            const newGuide: Guide = {
              id: Date.now().toString(),
              title: guideModal.title,
              description: guideModal.description,
              categoryId: guideModal.categoryId,
              date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
            }
            return { ...cat, guides: [...cat.guides, newGuide] }
          } else {
            return {
              ...cat,
              guides: cat.guides.map((g) =>
                g.id === guideModal.id
                  ? { ...g, title: guideModal.title, description: guideModal.description }
                  : g
              )
            }
          }
        }
        return cat
      })
    )
    closeGuideModal()
  }

  const deleteGuide = (categoryId: string, guideId: string) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId ? { ...cat, guides: cat.guides.filter((g) => g.id !== guideId) } : cat
      )
    )
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
            onClick={() => {
              if (categories.length === 0) {
                alert('Please add a category first')
                return
              }
              setGuideModal({ isOpen: true, mode: 'add', title: '', description: '', categoryId: categories[0].id })
            }}
            className="bg-linear-to-r from-button-start via-button-end to-button-start text-white flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium cursor-pointer"
          >
            <Plus size={16} />
            Add Guide
          </button>
        </div>
      </div>

      {/* Categories List */}
      <div className="space-y-2">
        {categories.map((category) => (
          <div key={category.id} className="border rounded-lg overflow-hidden">
            {/* Category Header */}
            <div className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition">
              <div className="flex items-center gap-3 flex-1">
                <button
                  onClick={() => toggleCategory(category.id)}
                  className="p-1 hover:bg-gray-200 rounded transition"
                >
                  {expandedCategories.includes(category.id) ? (
                    <ChevronDown size={20} style={{ color: '#214572' }} />
                  ) : (
                    <ChevronRight size={20} style={{ color: '#214572' }} />
                  )}
                </button>
                <FolderOpen size={20} style={{ color: '#214572' }} />
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold" style={{ color: '#1A202C' }}>
                    {category.name}
                  </h3>
                  <span className="text-sm bg-gray-200 rounded-sm px-1.5">
                    {category.guides.length}
                  </span>
                </div>
              </div>

              {/* Category Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEditCategoryModal(category.id, category.name)}
                  className="p-2 hover:bg-gray-200 rounded transition"
                >
                  <Pencil size={18} style={{ color: '#214572' }} />
                </button>
                <button
                  onClick={() => deleteCategory(category.id)}
                  className="p-2 hover:bg-red-100 rounded transition"
                >
                  <Trash2 size={18} color="#ef4444" />
                </button>
              </div>
            </div>

            {/* Guides List (Expandable) */}
            {expandedCategories.includes(category.id) && (
              <div className="border-t bg-white">
                {category.guides.length === 0 ? (
                  <div className="p-4 text-center" style={{ color: '#64748B' }}>
                    <p>No guides yet. Add one to get started.</p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {category.guides.map((guide) => (
                      <div key={guide.id} className="flex items-center justify-between p-4 hover:bg-gray-50 transition">
                        <div className="flex items-center gap-3 flex-1 ml-8">
                          <FileText size={18} style={{ color: '#64748B' }} />
                          <div className="flex flex-col">
                            <p className="font-medium" style={{ color: '#1A202C' }}>
                              {guide.title}
                            </p>
                            <p style={{ color: '#64748B' }} className="text-sm">
                              {guide.description}
                            </p>
                            <span style={{ color: '#64748B' }} className="text-xs mt-1">
                              {guide.date}
                            </span>
                          </div>
                        </div>

                        {/* Guide Actions */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEditGuideModal(category.id, guide)}
                            className="p-2 hover:bg-gray-200 rounded transition"
                          >
                            <Pencil size={18} style={{ color: '#214572' }} />
                          </button>
                          <button
                            onClick={() => deleteGuide(category.id, guide.id)}
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
                value={categoryModal.name}
                onChange={(e) => setCategoryModal({ ...categoryModal, name: e.target.value })}
                placeholder="Enter category name"
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
              disabled={categoryModal.name.trim().length === 0}
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
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
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
                value={guideModal.description}
                onChange={(e) => setGuideModal({ ...guideModal, description: e.target.value })}
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
              disabled={guideModal.title.trim().length === 0 || guideModal.description.trim().length === 0}
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
