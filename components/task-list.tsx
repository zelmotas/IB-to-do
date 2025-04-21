"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { DataService } from "@/lib/data-service"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { Loader2, Plus, Trash2, Calendar } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ibSubjects } from "@/data/ib-subjects"

interface TaskListProps {
  initialTasks?: any[]
}

export function TaskList({ initialTasks = [] }: TaskListProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [tasks, setTasks] = useState(initialTasks)
  const [isLoading, setIsLoading] = useState(false)
  const [isAddingTask, setIsAddingTask] = useState(false)
  const [newTaskText, setNewTaskText] = useState("")
  const [selectedSubject, setSelectedSubject] = useState("")
  const [selectedUnit, setSelectedUnit] = useState("")
  const [selectedSubtopic, setSelectedSubtopic] = useState("")
  const [selectedDate, setSelectedDate] = useState<string>("")

  // Update tasks when initialTasks changes
  useEffect(() => {
    setTasks(initialTasks)
  }, [initialTasks])

  // Get units for selected subject
  const getUnits = () => {
    if (!selectedSubject) return []
    const subject = ibSubjects.find((s) => s.id === selectedSubject)
    return subject ? subject.units : []
  }

  // Get subtopics for selected unit
  const getSubtopics = () => {
    if (!selectedSubject || !selectedUnit) return []
    const subject = ibSubjects.find((s) => s.id === selectedSubject)
    if (!subject) return []
    const unit = subject.units.find((u) => u.id === selectedUnit)
    return unit ? unit.subtopics : []
  }

  const handleAddTask = async () => {
    if (!user || !newTaskText.trim() || !selectedSubject || !selectedUnit || !selectedSubtopic) return

    setIsLoading(true)
    try {
      const subject = ibSubjects.find((s) => s.id === selectedSubject)
      const unit = subject?.units.find((u) => u.id === selectedUnit)
      const subtopic = unit?.subtopics.find((s) => s.id === selectedSubtopic)

      const newTask = {
        user_id: user.id,
        text: newTaskText,
        completed: false,
        due_date: selectedDate || null,
        subject_id: selectedSubject,
        unit_id: selectedUnit,
        subtopic_id: selectedSubtopic,
        subject_name: subject?.name || "",
        unit_name: unit?.name || "",
        subtopic_name: subtopic?.name || "",
        subject_color: subject?.color || "",
      }

      const createdTask = await DataService.createTask(newTask)

      // Update local state
      setTasks((prev) => [createdTask, ...prev])

      // Reset form
      setNewTaskText("")
      setSelectedSubject("")
      setSelectedUnit("")
      setSelectedSubtopic("")
      setSelectedDate("")
      setIsAddingTask(false)

      toast({
        title: "Task added",
        description: "Your task has been added successfully.",
      })
    } catch (error) {
      console.error("Error adding task:", error)
      toast({
        title: "Error",
        description: "Failed to add task. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleTask = async (taskId: string, completed: boolean) => {
    if (!user) return

    try {
      await DataService.updateTask(taskId, { completed: !completed })

      // Update local state
      setTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, completed: !completed } : task)))
    } catch (error) {
      console.error("Error toggling task:", error)
      toast({
        title: "Error",
        description: "Failed to update task. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteTask = async (taskId: string) => {
    if (!user) return

    try {
      await DataService.deleteTask(taskId)

      // Update local state
      setTasks((prev) => prev.filter((task) => task.id !== taskId))

      toast({
        title: "Task deleted",
        description: "Your task has been deleted successfully.",
      })
    } catch (error) {
      console.error("Error deleting task:", error)
      toast({
        title: "Error",
        description: "Failed to delete task. Please try again.",
        variant: "destructive",
      })
    }
  }

  const isTaskOverdue = (dueDate: string | null) => {
    if (!dueDate) return false
    return new Date(dueDate) < new Date() && new Date(dueDate).setHours(0, 0, 0, 0) !== new Date().setHours(0, 0, 0, 0)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Tasks</CardTitle>
        <Dialog open={isAddingTask} onOpenChange={setIsAddingTask}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Task</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="task-text">Task Description</Label>
                <Input
                  id="task-text"
                  placeholder="Enter task description"
                  value={newTaskText}
                  onChange={(e) => setNewTaskText(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="due-date">Due Date (Optional)</Label>
                <Input
                  id="due-date"
                  type="datetime-local"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger id="subject">
                    <SelectValue placeholder="Select Subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {ibSubjects.map((subject) => (
                      <SelectItem key={subject.id} value={subject.id}>
                        {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedSubject && (
                <div className="space-y-2">
                  <Label htmlFor="unit">Unit</Label>
                  <Select value={selectedUnit} onValueChange={setSelectedUnit}>
                    <SelectTrigger id="unit">
                      <SelectValue placeholder="Select Unit" />
                    </SelectTrigger>
                    <SelectContent>
                      {getUnits().map((unit) => (
                        <SelectItem key={unit.id} value={unit.id}>
                          {unit.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {selectedUnit && (
                <div className="space-y-2">
                  <Label htmlFor="subtopic">Subtopic</Label>
                  <Select value={selectedSubtopic} onValueChange={setSelectedSubtopic}>
                    <SelectTrigger id="subtopic">
                      <SelectValue placeholder="Select Subtopic" />
                    </SelectTrigger>
                    <SelectContent>
                      {getSubtopics().map((subtopic) => (
                        <SelectItem key={subtopic.id} value={subtopic.id}>
                          {subtopic.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddingTask(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleAddTask}
                disabled={isLoading || !newTaskText || !selectedSubject || !selectedUnit || !selectedSubtopic}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add Task"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {tasks.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <p>You don't have any tasks yet.</p>
            <Button variant="link" onClick={() => setIsAddingTask(true)} className="mt-2">
              Add your first task
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map((task: any) => (
              <div
                key={task.id}
                className="flex items-start justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start gap-3 flex-1">
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={() => handleToggleTask(task.id, task.completed)}
                    className="mt-1"
                  />
                  <div className="space-y-1">
                    <p className={task.completed ? "line-through text-muted-foreground" : ""}>{task.text}</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="text-xs">
                        {task.subject_name}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {task.unit_name}
                      </Badge>
                      {task.due_date && (
                        <Badge
                          variant={isTaskOverdue(task.due_date) && !task.completed ? "destructive" : "outline"}
                          className="text-xs flex items-center gap-1"
                        >
                          <Calendar className="h-3 w-3" />
                          {format(new Date(task.due_date), "MMM d, yyyy")}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteTask(task.id)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
