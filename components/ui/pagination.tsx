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
