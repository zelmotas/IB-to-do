"use client"

import type { Task } from "@/types/todo"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

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
    <div className="bg-card rounded-lg p-4 shadow-sm">
      <h2 className="text-2xl font-bold mb-4">{t("upcoming_tasks")}</h2>
      {tasks.length > 0 ? (
        <ul className="space-y-2">
          {tasks.map((task) => (
            <li
              key={task.id}
              className={cn(
                "flex items-center justify-between p-2 rounded-md",
                task.completed ? "bg-muted/50" : "bg-background",
                isTaskOverdue(task.dueDate) && !task.completed ? "border-l-4 border-destructive" : "",
              )}
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <Checkbox
                  id={`home-task-${task.id}`}
                  checked={task.completed}
                  onCheckedChange={() => toggleTaskCompletion(task.subjectId, task.unitId, task.subtopicId, task.id)}
                />
                <label
                  htmlFor={`home-task-${task.id}`}
                  className={cn("font-medium truncate", task.completed && "line-through text-muted-foreground")}
                >
                  {task.text}
                </label>
                <div className="flex flex-wrap gap-1 ml-2">
                  <Badge variant="secondary" className="text-xs" style={{ backgroundColor: task.subjectColor }}>
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
                    </Badge>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteTask(task.subjectId, task.unitId, task.subtopicId, task.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground italic">{t("no_upcoming_tasks")}</p>
      )}
    </div>
  )
}
