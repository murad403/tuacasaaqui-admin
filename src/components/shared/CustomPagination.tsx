"use client"

import React from "react"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"

import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

type CustomPaginationProps = {
  currentPage: number
  totalItems: number
  pageSize: number
  onPageChange: (page: number) => void
  siblingCount?: number
  className?: string
  itemLabel?: string
  isLoading?: boolean
}

const DOTS = "dots" as const

type PaginationItem = number | typeof DOTS

const getPaginationRange = (
  currentPage: number,
  totalPages: number,
  siblingCount: number
): PaginationItem[] => {
  const totalPageNumbers = siblingCount + 5

  if (totalPageNumbers >= totalPages) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1)
  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages)

  const shouldShowLeftDots = leftSiblingIndex > 2
  const shouldShowRightDots = rightSiblingIndex < totalPages - 1

  if (!shouldShowLeftDots && shouldShowRightDots) {
    const leftItemCount = 3 + siblingCount * 2
    const leftRange = Array.from({ length: leftItemCount }, (_, index) => index + 1)

    return [...leftRange, DOTS, totalPages]
  }

  if (shouldShowLeftDots && !shouldShowRightDots) {
    const rightItemCount = 3 + siblingCount * 2
    const startPage = totalPages - rightItemCount + 1
    const rightRange = Array.from(
      { length: rightItemCount },
      (_, index) => startPage + index
    )

    return [1, DOTS, ...rightRange]
  }

  const middleRange = Array.from(
    { length: rightSiblingIndex - leftSiblingIndex + 1 },
    (_, index) => leftSiblingIndex + index
  )

  return [1, DOTS, ...middleRange, DOTS, totalPages]
}

const CustomPagination = ({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
  siblingCount = 1,
  className,
  itemLabel = "items",
  isLoading = false,
}: CustomPaginationProps) => {
  if (isLoading) {
    return (
      <div
        className={cn(
          "flex flex-col gap-4 border-t border-slate-200 px-4 py-4 sm:px-5 lg:flex-row lg:items-center lg:justify-between animate-pulse",
          className
        )}
      >
        <div className="flex flex-col gap-3 text-sm text-description sm:flex-row sm:items-center sm:justify-between lg:justify-start">
          <Skeleton className="h-4 w-48 rounded" />
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
          <Skeleton className="h-9 w-20 rounded-lg" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-9 rounded-lg" />
            <Skeleton className="h-9 w-9 rounded-lg" />
            <Skeleton className="h-9 w-9 rounded-lg" />
          </div>
          <Skeleton className="h-9 w-20 rounded-lg" />
        </div>
      </div>
    )
  }

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const safeCurrentPage = Math.min(Math.max(currentPage, 1), totalPages)
  const startItem = totalItems === 0 ? 0 : (safeCurrentPage - 1) * pageSize + 1
  const endItem = totalItems === 0 ? 0 : Math.min(safeCurrentPage * pageSize, totalItems)
  const paginationRange = getPaginationRange(
    safeCurrentPage,
    totalPages,
    siblingCount
  )

  const baseButtonClassName =
    "flex h-9 min-w-9 items-center justify-center rounded-lg border text-sm font-medium transition-colors"

  return (
    <div
      className={cn(
        "flex flex-col gap-4 border-t border-slate-200 px-4 py-4 sm:px-5 lg:flex-row lg:items-center lg:justify-between",
        className
      )}
    >
      <div className="flex flex-col gap-3 text-sm text-description sm:flex-row sm:items-center sm:justify-between lg:justify-start">
        <p>
          Showing <span className="font-semibold text-title">{startItem}</span> to{" "}
          <span className="font-semibold text-title">{endItem}</span> of{" "}
          <span className="font-semibold text-title">{totalItems}</span> {itemLabel}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 sm:justify-end">
        <button
          type="button"
          onClick={() => onPageChange(safeCurrentPage - 1)}
          disabled={safeCurrentPage === 1}
          className={cn(
            baseButtonClassName,
            "gap-1 border-slate-200 bg-white px-3 text-slate-700 hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
          )}
        >
          <span className="hidden sm:inline">Previous</span>
        </button>

        <div className="flex flex-wrap items-center gap-2">
          {paginationRange.map((pageNumber, index) => {
            if (pageNumber === DOTS) {
              return (
                <span
                  key={`${pageNumber}-${index}`}
                  className="flex h-9 min-w-9 items-center justify-center text-slate-400"
                >
                  <MoreHorizontal className="size-4" />
                </span>
              )
            }

            const isActive = pageNumber === safeCurrentPage

            return (
              <button
                key={pageNumber}
                type="button"
                onClick={() => onPageChange(pageNumber)}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  baseButtonClassName,
                  isActive
                    ? "border-transparent bg-linear-to-r from-button-start via-button-end to-button-start text-white shadow-sm"
                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                )}
              >
                {pageNumber}
              </button>
            )
          })}
        </div>

        <button
          type="button"
          onClick={() => onPageChange(safeCurrentPage + 1)}
          disabled={safeCurrentPage === totalPages}
          className={cn(
            baseButtonClassName,
            "gap-1 border-slate-200 bg-white px-3 text-slate-700 hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
          )}
        >
          <span className="hidden sm:inline">Next</span>
        </button>
      </div>
    </div>
  )
}

export default CustomPagination
