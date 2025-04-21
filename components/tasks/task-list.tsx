"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { type Task, updateTask, deleteTask } from "@/services/task-service"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { format } from "date-fns"
import { Trash2, Edit } from "lucide-react"
import { useNotification } from "@/contexts/notification-context"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface TaskListProps {
  tasks: Task[]
}

export function TaskList({ tasks }: TaskListProps) {
  const router = useRouter()
  const { showTaskNotification } = useNotification()
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [editText, setEditText] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  const handleToggleComplete = async (task: Task) => {
    try {
      await updateTask(task.id, { completed: !task.completed })
      showTaskNotification("updated", task.text)
      router.refresh()
    } catch (error) {
      console.error("Error updating task:", error)
    }
  }

  const handleDeleteTask = async (task: Task) => {
    try {
      setIsDeleting(task.id)
      await deleteTask(task.id)
      showTaskNotification("deleted", task.text)
      router.refresh()
    } catch (error) {
      console.error("Error deleting task:", error)
    } finally {
      setIsDeleting(null)
    }
  }

  const handleEditTask = async () => {
    if (!editingTask || !editText.trim()) return

    try {
      setIsUpdating(true)
      await updateTask(editingTask.id, { text: editText })
      showTaskNotification("updated", editText)
      setEditingTask(null)
      router.refresh()
    } catch (error) {
      console.error("Error updating task:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  if (tasks.length === 0) {
    return <p className="text-center text-muted-foreground">No tasks yet. Add one to get started!</p>
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div
          key={task.id}
          className={`flex items-center justify-between rounded-lg border p-4 ${task.completed ? "bg-muted/50" : ""}`}
        >
          <div className="flex items-center gap-3">
            <Checkbox
              checked={task.completed}
              onCheckedChange={() => handleToggleComplete(task)}
              id={`task-${task.id}`}
            />
            <div>
              <label
                htmlFor={`task-${task.id}`}
                className={`font-medium ${task.completed ? "line-through text-muted-foreground" : ""}`}
              >
                {task.text}
              </label>
              {task.due_date && (
                <p className="text-sm text-muted-foreground">Due: {format(new Date(task.due_date), "PPP")}</p>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setEditingTask(task)
                    setEditText(task.text)
                  }}
                >
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">Edit</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Task</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-task">Task</Label>
                    <Input id="edit-task" value={editText} onChange={(e) => setEditText(e.target.value)} />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button onClick={handleEditTask} disabled={isUpdating}>
                      {isUpdating ? "Saving..." : "Save Changes"}
                    </Button>
                  </DialogClose>
                </div>
              </DialogContent>
            </Dialog>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDeleteTask(task)}
              disabled={isDeleting === task.id}
            >
              {isDeleting === task.id ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              <span className="sr-only">Delete</span>
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
