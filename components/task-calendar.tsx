"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CalendarIcon } from "lucide-react"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { CalendarView } from "@/components/calendar-view"
import { useLanguage } from "@/contexts/language-context"
import type { Task, Subject } from "@/types/todo"
import { motion } from "framer-motion"

interface TaskCalendarProps {
  subjects: Subject[]
  tasks: Task[]
  addTask: (
    subjectId: string,
    unitId: string,
    subtopicId: string,
    taskText: string,
    dueDate?: string,
    reminderTime?: string,
  ) => void
}

export function TaskCalendar({ subjects, tasks, addTask }: TaskCalendarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { t } = useLanguage()

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.2 }}>
          <Button className="mb-4 w-full" size="lg">
            <CalendarIcon className="mr-2 h-5 w-5" />
            {t("open_calendar")}
          </Button>
        </motion.div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[90vw] md:max-w-[80vw] lg:max-w-[1000px] max-h-[90vh] p-4 overflow-y-auto">
        <CalendarView tasks={tasks} subjects={subjects} addTask={addTask} />
      </DialogContent>
    </Dialog>
  )
}
