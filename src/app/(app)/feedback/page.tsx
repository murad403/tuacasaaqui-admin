'use client'

import React, { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, Star, Trash2 } from 'lucide-react'
import { toast } from 'react-toastify'
import {
  type FeedbackCategory,
  type GetFeedbackParams,
  useFeedbackDeleteMutation,
  useFeedbackResolveMutation,
  useFeedbackStatsQuery,
  useGetFeedbackQuery
} from '@/redux/features/feedback/feedback.api'

type RatingFilter = 'all' | '1' | '2' | '3' | '4' | '5'
type CategoryFilter = 'all' | FeedbackCategory
type StatusFilter = 'all' | 'pending' | 'resolved'

const FeedbackManagementPage = () => {
  const [ratingFilter, setRatingFilter] = useState<RatingFilter>('all')
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')

  const [feedbackResolve, { isLoading: isResolving }] = useFeedbackResolveMutation()
  const [feedbackDelete, { isLoading: isDeleting }] = useFeedbackDeleteMutation()

  const queryParams = useMemo<GetFeedbackParams>(() => {
    const params: GetFeedbackParams = {}

    if (ratingFilter !== 'all') {
      params.rating = Number(ratingFilter)
    }

    if (categoryFilter !== 'all') {
      params.category = categoryFilter
    }

    if (statusFilter !== 'all') {
      params.status = statusFilter
    }

    return params
  }, [ratingFilter, categoryFilter, statusFilter])

  const {
    data: feedbacks = [],
    isLoading: isFeedbackLoading,
    isError: isFeedbackError
  } = useGetFeedbackQuery(queryParams)

  const { data: stats, isLoading: isStatsLoading } = useFeedbackStatsQuery()

  const handleResolve = async (id: number) => {
    try {
      await feedbackResolve(id).unwrap()
      toast.success('Feedback marked as resolved')
    } catch (error) {
      const err = error as { data?: { detail?: string; message?: string } }
      toast.error(err?.data?.detail || err?.data?.message || 'Failed to update feedback status')
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await feedbackDelete(id).unwrap()
      toast.success('Feedback deleted successfully')
    } catch (error) {
      const err = error as { data?: { detail?: string; message?: string } }
      toast.error(err?.data?.detail || err?.data?.message || 'Failed to delete feedback')
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric'
    })
  }

  const getCategoryLabel = (category: FeedbackCategory) => {
    const labels: Record<FeedbackCategory, string> = {
      bug_report: 'Bug',
      feature_request: 'Feature',
      data_issue: 'Data',
      ux_feedback: 'UX',
      other: 'Other'
    }

    return labels[category]
  }

  const getCategoryColor = (category: FeedbackCategory) => {
    const colors: Record<FeedbackCategory, string> = {
      bug_report: 'bg-red-100 text-red-700',
      feature_request: 'bg-blue-100 text-blue-700',
      data_issue: 'bg-green-100 text-green-700',
      ux_feedback: 'bg-purple-100 text-purple-700',
      other: 'bg-gray-100 text-gray-700'
    }

    return colors[category] || 'bg-gray-100 text-gray-700'
  }

  const getStatusColor = (isResolved: boolean) => {
    return isResolved ? '#16a34a' : '#ea580c'
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
            <SelectItem value="bug_report">Bug</SelectItem>
            <SelectItem value="feature_request">Feature</SelectItem>
            <SelectItem value="ux_feedback">UX</SelectItem>
            <SelectItem value="data_issue">Data</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as StatusFilter)}>
          <SelectTrigger className="w-40 border">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
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
            {isStatsLoading ? '-' : (stats?.total_feedback ?? 0)}
          </p>
        </div>

        <div className="bg-white border rounded-lg p-6">
          <p style={{ color: '#64748B' }} className="text-sm font-medium">
            Pending
          </p>
          <p className="text-3xl font-bold mt-2 text-orange-600">
            {isStatsLoading ? '-' : (stats?.pending ?? 0)}
          </p>
        </div>

        <div className="bg-white border rounded-lg p-6">
          <p style={{ color: '#64748B' }} className="text-sm font-medium">
            Resolved
          </p>
          <p className="text-3xl font-bold mt-2 text-green-600">
            {isStatsLoading ? '-' : (stats?.resolved ?? 0)}
          </p>
        </div>

        <div className="bg-white border rounded-lg p-6">
          <p style={{ color: '#64748B' }} className="text-sm font-medium">
            Average Rating
          </p>
          <p className="text-3xl font-bold mt-2 text-blue-600">
            {isStatsLoading ? '-' : (stats?.average_rating ?? 0)}
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
            {isFeedbackLoading ? (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center">
                  <div className="inline-flex items-center gap-2 text-description">
                    <Loader2 className="size-4 animate-spin" />
                    Loading feedback...
                  </div>
                </td>
              </tr>
            ) : isFeedbackError ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-red-600">
                  Failed to load feedback
                </td>
              </tr>
            ) : feedbacks.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center" style={{ color: '#64748B' }}>
                  No feedback found
                </td>
              </tr>
            ) : (
              feedbacks.map((feedback) => (
                <tr key={feedback.id} className="border-t hover:bg-gray-50 transition">
                  <td className="px-6 py-4">{renderStars(feedback.rating)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(feedback.category)}`}>
                      {getCategoryLabel(feedback.category)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm" style={{ color: '#1A202C' }}>
                    {feedback.message}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium" style={{ color: getStatusColor(feedback.is_resolved) }}>
                    {feedback.is_resolved ? 'Resolved' : 'Pending'}
                  </td>
                  <td className="px-6 py-4 text-sm" style={{ color: '#64748B' }}>
                    {formatDate(feedback.created_at)}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-2">
                      {!feedback.is_resolved ? (
                        <Button
                          onClick={() => handleResolve(feedback.id)}
                          size="sm"
                          disabled={isResolving}
                          className="text-xs px-3 py-1.5 rounded"
                          style={{ backgroundColor: '#214572' }}
                        >
                          Mark Resolved
                        </Button>
                      ) : null}

                      <button
                        type="button"
                        onClick={() => handleDelete(feedback.id)}
                        disabled={isDeleting}
                        className="p-2 rounded-md text-red-500 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <Trash2 className="size-4" />
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
