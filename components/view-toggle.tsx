"use client"

import { CalendarIcon, ListIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"
import { motion } from "framer-motion"

interface ViewToggleProps {
  view: "calendar" | "list"
  onViewChange: (view: "calendar" | "list") => void
}

export function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  const { t } = useLanguage()

  return (
    <motion.div
      className="flex items-center justify-center mb-4"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-muted/50 backdrop-blur-sm rounded-lg p-1 flex relative">
        <motion.div
          className="absolute inset-y-1 rounded-md bg-background shadow-sm"
          initial={false}
          animate={{
            x: view === "calendar" ? 0 : "100%",
            width: "50%",
          }}
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
        <Button
          variant="ghost"
          size="sm"
          className={`flex items-center gap-1 z-10 transition-colors duration-200 ${
            view === "calendar" ? "text-foreground" : "text-muted-foreground"
          }`}
          onClick={() => onViewChange("calendar")}
        >
          <CalendarIcon className="h-4 w-4" />
          <span>{t("calendarView")}</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={`flex items-center gap-1 z-10 transition-colors duration-200 ${
            view === "list" ? "text-foreground" : "text-muted-foreground"
          }`}
          onClick={() => onViewChange("list")}
        >
          <ListIcon className="h-4 w-4" />
          <span>{t("listView")}</span>
        </Button>
      </div>
    </motion.div>
  )
}
