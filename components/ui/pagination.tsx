"use client"

import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import * as React from "react"

const PaginationContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex w-full items-center justify-center", className)} {...props} />
  ),
)
PaginationContent.displayName = "PaginationContent"

const PaginationItem = React.forwardRef<HTMLButtonElement, React.HTMLAttributes<HTMLButtonElement>>(
  ({ className, ...props }, ref) => {
    return <Button ref={ref} variant="outline" size="icon" className={cn("h-9 w-9", className)} {...props} />
  },
)
PaginationItem.displayName = "PaginationItem"

const PaginationLink = React.forwardRef<HTMLAnchorElement, React.HTMLAttributes<HTMLAnchorElement>>(
  ({ className, ...props }, ref) => {
    return <Button ref={ref} variant="outline" size="icon" className={cn("h-9 w-9", className)} {...props} />
  },
)
PaginationLink.displayName = "PaginationLink"

const PaginationEllipsis = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => (
    <span ref={ref} className={cn("flex h-9 w-9 items-center justify-center", className)} {...props}>
      <MoreHorizontal className="h-4 w-4" />
    </span>
  ),
)
PaginationEllipsis.displayName = "PaginationEllipsis"

const PaginationPrevious = React.forwardRef<HTMLAnchorElement, React.HTMLAttributes<HTMLAnchorElement>>(
  ({ className, ...props }, ref) => (
    <Button ref={ref} variant="outline" size="icon" className={cn("h-9 w-9", className)} {...props}>
      <ChevronLeft className="h-4 w-4" />
      <span className="sr-only">Previous</span>
    </Button>
  ),
)
PaginationPrevious.displayName = "PaginationPrevious"

const PaginationNext = React.forwardRef<HTMLAnchorElement, React.HTMLAttributes<HTMLAnchorElement>>(
  ({ className, ...props }, ref) => (
    <Button ref={ref} variant="outline" size="icon" className={cn("h-9 w-9", className)} {...props}>
      <ChevronRight className="h-4 w-4" />
      <span className="sr-only">Next</span>
    </Button>
  ),
)
PaginationNext.displayName = "PaginationNext"

export { PaginationContent, PaginationItem, PaginationLink, PaginationEllipsis, PaginationPrevious, PaginationNext }

export interface PaginationProps extends React.HTMLAttributes<HTMLDivElement> {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({ currentPage, totalPages, onPageChange, className, ...props }: PaginationProps) {
  let startPage = Math.max(1, currentPage - 2)
  let endPage = Math.min(totalPages, currentPage + 2)

  if (totalPages > 5) {
    if (currentPage <= 3) {
      endPage = 5
    } else if (currentPage >= totalPages - 2) {
      startPage = totalPages - 4
    }
  }

  const pages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i)

  return (
    <div className={cn("flex items-center justify-between", className)} {...props}>
      <PaginationPrevious
        href="#"
        onClick={(e) => {
          e.preventDefault()
          if (currentPage > 1) {
            onPageChange(currentPage - 1)
          }
        }}
        disabled={currentPage === 1}
      />
      <PaginationContent>
        {startPage > 1 && (
          <>
            <PaginationItem onClick={() => onPageChange(1)}>1</PaginationItem>
            {startPage > 2 && <PaginationEllipsis />}
          </>
        )}
        {pages.map((page) => (
          <PaginationItem
            key={page}
            onClick={() => onPageChange(page)}
            disabled={currentPage === page}
            aria-current={currentPage === page ? "page" : undefined}
          >
            {page}
          </PaginationItem>
        ))}
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <PaginationEllipsis />}
            <PaginationItem onClick={() => onPageChange(totalPages)}>{totalPages}</PaginationItem>
          </>
        )}
      </PaginationContent>
      <PaginationNext
        href="#"
        onClick={(e) => {
          e.preventDefault()
          if (currentPage < totalPages) {
            onPageChange(currentPage + 1)
          }
        }}
        disabled={currentPage === totalPages}
      />
    </div>
  )
}
