"use client"

import type { Task } from "@/types/todo"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { motion, AnimatePresence } from "framer-motion"

interface HomeTasksProps {
  tasks: Task[]
  toggleTaskCompletion: (subjectId: string, unitId: string, subtopicId: string, taskId: string) => void
  deleteTask: (subjectId: string, unitId: string, subtopicId: string, taskId: string) => void
}

export function HomeTasks({ tasks, toggleTaskCompletion, deleteTask }: HomeTasksProps) {
  const { t, translateSubtopic } = useLanguage()

  const isTaskOverdue = (dueDate: string | null) => {
    if (!dueDate) return false
    return new Date(dueDate) < new Date() && new Date(dueDate).setHours(0, 0, 0, 0) !== new Date().setHours(0, 0, 0, 0)
  }

  return (
    <motion.div
      className="bg-card rounded-lg p-4 shadow-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-2xl font-bold mb-4">{t("upcomingTasks")}</h2>
      <AnimatePresence>
        {tasks.length > 0 ? (
          <motion.ul
            className="space-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.05 }}
          >
            {tasks.map((task) => (
              <motion.li
                key={task.id}
                className={cn(
                  "flex items-center justify-between p-3 rounded-lg transition-all duration-200",
                  task.completed ? "bg-muted/50" : "bg-background hover:bg-muted/30",
                  isTaskOverdue(task.dueDate) && !task.completed ? "border-l-4 border-destructive" : "",
                )}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.2 }}
                layout
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div>
                    <Checkbox
                      id={`home-task-${task.id}`}
                      checked={task.completed}
                      onCheckedChange={() =>
                        toggleTaskCompletion(task.subjectId, task.unitId, task.subtopicId, task.id)
                      }
                      className="transition-all duration-200"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <label
                      htmlFor={`home-task-${task.id}`}
                      className={cn(
                        "font-medium block truncate transition-all duration-200",
                        task.completed && "line-through text-muted-foreground",
                      )}
                    >
                      {task.text}
                    </label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      <Badge
                        variant="secondary"
                        className="text-xs"
                        style={{
                          backgroundColor: `${task.subjectColor}20`,
                          color: task.subjectColor.replace("bg-", "text-"),
                        }}
                      >
                        {t(task.subjectName)}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {t(task.unitName)}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {translateSubtopic(task.subtopicName)}
                      </Badge>
                      {task.dueDate && (
                        <Badge
                          variant={isTaskOverdue(task.dueDate) && !task.completed ? "destructive" : "outline"}
                          className="text-xs"
                        >
                          {format(new Date(task.dueDate), "MMM d, yyyy")}
                          {task.dueDate.includes("T") && ` ${format(new Date(task.dueDate), "h:mm a")}`}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteTask(task.subjectId, task.unitId, task.subtopicId, task.id)}
                    className="text-muted-foreground hover:text-destructive transition-colors duration-200"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </motion.div>
              </motion.li>
            ))}
          </motion.ul>
        ) : (
          <motion.p
            className="text-sm text-muted-foreground italic p-4 text-center bg-muted/20 rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {t("noUpcomingTasks")}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
