'use client'

import React, { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Star, Trash2 } from 'lucide-react'

interface Feedback {
  id: string
  rating: number
  category: 'Bug' | 'Feature' | 'UX' | 'Data'
  message: string
  status: 'Pending' | 'Resolved'
  date: string
}

type RatingFilter = 'all' | '5' | '4' | '3' | '2' | '1'
type CategoryFilter = 'all' | 'Bug' | 'Feature' | 'UX' | 'Data'
type StatusFilter = 'all' | 'Pending' | 'Resolved'

const FeedbackManagementPage = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([
    {
      id: '1',
      rating: 4,
      category: 'UX',
      message: 'Great app overall, but could use better navigation.',
      status: 'Pending',
      date: 'Mar 30, 2026'
    },
    {
      id: '2',
      rating: 2,
      category: 'Bug',
      message: 'The search function is slow sometimes.',
      status: 'Pending',
      date: 'Mar 29, 2026'
    },
    {
      id: '3',
      rating: 5,
      category: 'Feature',
      message: 'Love the new dashboard design! Very intuitive.',
      status: 'Resolved',
      date: 'Mar 28, 2026'
    }
  ])

  const [ratingFilter, setRatingFilter] = useState<RatingFilter>('all')
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')

  // Filter feedbacks
  const filteredFeedbacks = useMemo(() => {
    return feedbacks.filter((fb) => {
      const ratingMatch = ratingFilter === 'all' || fb.rating === parseInt(ratingFilter)
      const categoryMatch = categoryFilter === 'all' || fb.category === categoryFilter
      const statusMatch = statusFilter === 'all' || fb.status === statusFilter
      return ratingMatch && categoryMatch && statusMatch
    })
  }, [feedbacks, ratingFilter, categoryFilter, statusFilter])

  // Calculate stats
  const totalFeedback = feedbacks.length
  const pendingCount = feedbacks.filter((fb) => fb.status === 'Pending').length
  const resolvedCount = feedbacks.filter((fb) => fb.status === 'Resolved').length
  const averageRating = feedbacks.length > 0 ? (feedbacks.reduce((sum, fb) => sum + fb.rating, 0) / feedbacks.length).toFixed(1) : '0.0'

  const toggleStatus = (id: string) => {
    setFeedbacks((prev) =>
      prev.map((fb) =>
        fb.id === id ? { ...fb, status: fb.status === 'Pending' ? 'Resolved' : 'Pending' } : fb
      )
    )
  }

  const deleteFeedback = (id: string) => {
    setFeedbacks((prev) => prev.filter((fb) => fb.id !== id))
  }

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      Bug: 'bg-red-100 text-red-700',
      Feature: 'bg-blue-100 text-blue-700',
      UX: 'bg-purple-100 text-purple-700',
      Data: 'bg-green-100 text-green-700'
    }
    return colors[category] || 'bg-gray-100 text-gray-700'
  }

  const getStatusColor = (status: string) => {
    return status === 'Pending' ? 'text-orange-600' : 'text-green-600'
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            className={i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-title">Feedback Management</h1>
          <p className="text-sm text-description mt-1">
            View and manage user feedback from the mobile app
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-8 pb-6 border-b">
        <span style={{ color: '#64748B' }} className="text-sm font-medium">
          Filters:
        </span>
        <Select value={ratingFilter} onValueChange={(value) => setRatingFilter(value as RatingFilter)}>
          <SelectTrigger className="w-40 border">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Ratings</SelectItem>
            <SelectItem value="5">5 Stars</SelectItem>
            <SelectItem value="4">4 Stars</SelectItem>
            <SelectItem value="3">3 Stars</SelectItem>
            <SelectItem value="2">2 Stars</SelectItem>
            <SelectItem value="1">1 Star</SelectItem>
          </SelectContent>
        </Select>

        <Select value={categoryFilter} onValueChange={(value) => setCategoryFilter(value as CategoryFilter)}>
          <SelectTrigger className="w-40 border">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="Bug">Bug</SelectItem>
            <SelectItem value="Feature">Feature</SelectItem>
            <SelectItem value="UX">UX</SelectItem>
            <SelectItem value="Data">Data</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as StatusFilter)}>
          <SelectTrigger className="w-40 border">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Resolved">Resolved</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white border rounded-lg p-6">
          <p style={{ color: '#64748B' }} className="text-sm font-medium">
            Total Feedback
          </p>
          <p className="text-3xl font-bold mt-2" style={{ color: '#1A202C' }}>
            {totalFeedback}
          </p>
        </div>

        <div className="bg-white border rounded-lg p-6">
          <p style={{ color: '#64748B' }} className="text-sm font-medium">
            Pending
          </p>
          <p className="text-3xl font-bold mt-2 text-orange-600">
            {pendingCount}
          </p>
        </div>

        <div className="bg-white border rounded-lg p-6">
          <p style={{ color: '#64748B' }} className="text-sm font-medium">
            Resolved
          </p>
          <p className="text-3xl font-bold mt-2 text-green-600">
            {resolvedCount}
          </p>
        </div>

        <div className="bg-white border rounded-lg p-6">
          <p style={{ color: '#64748B' }} className="text-sm font-medium">
            Average Rating
          </p>
          <p className="text-3xl font-bold mt-2 text-blue-600">
            {averageRating}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: '#1A202C' }}>
                Rating
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: '#1A202C' }}>
                Category
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: '#1A202C' }}>
                Message
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: '#1A202C' }}>
                Status
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: '#1A202C' }}>
                Date
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: '#1A202C' }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredFeedbacks.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center" style={{ color: '#64748B' }}>
                  No feedback found
                </td>
              </tr>
            ) : (
              filteredFeedbacks.map((feedback) => (
                <tr key={feedback.id} className="border-t hover:bg-gray-50 transition">
                  <td className="px-6 py-4">{renderStars(feedback.rating)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(feedback.category)}`}>
                      {feedback.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm" style={{ color: '#1A202C' }}>
                    {feedback.message}
                  </td>
                  <td className="px-6 py-4">
                    <Select value={feedback.status} onValueChange={() => toggleStatus(feedback.id)}>
                      <SelectTrigger className="w-28 h-8 text-xs border" style={{ color: getStatusColor(feedback.status) }}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Resolved">Resolved</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="px-6 py-4 text-sm" style={{ color: '#64748B' }}>
                    {feedback.date}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex gap-2">
                      <Button
                        onClick={() => toggleStatus(feedback.id)}
                        size="sm"
                        className="text-xs px-3 py-1.5 rounded"
                        style={{ backgroundColor: '#214572' }}
                      >
                        {feedback.status === 'Pending' ? 'Mark Resolved' : 'Mark Pending'}
                      </Button>
                      <button
                        onClick={() => deleteFeedback(feedback.id)}
                        className="p-2 hover:bg-red-100 rounded transition"
                      >
                        <Trash2 size={16} color="#ef4444" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default FeedbackManagementPage
