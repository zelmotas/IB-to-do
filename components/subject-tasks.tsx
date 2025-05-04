"use client"

import { useState } from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Trash2, PlusCircle, Book, Bell, CheckSquare, Square } from "lucide-react"
import type { Subject } from "@/types/todo"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { NotificationService } from "@/lib/notification-service"
import { useLanguage } from "@/contexts/language-context"
import { MarkdownRenderer } from "@/components/markdown-renderer"

interface SubjectTasksProps {
  subject: Subject
  addTask: (
    subjectId: string,
    unitId: string,
    subtopicId: string,
    taskText: string,
    dueDate?: string,
    reminderTime?: string,
  ) => void
  toggleTaskCompletion: (subjectId: string, unitId: string, subtopicId: string, taskId: string) => void
  deleteTask: (subjectId: string, unitId: string, subtopicId: string, taskId: string) => void
}

export function SubjectTasks({ subject, addTask, toggleTaskCompletion, deleteTask }: SubjectTasksProps) {
  const [newTaskText, setNewTaskText] = useState("")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined)
  const [reminderTime, setReminderTime] = useState<string>("at-time")
  const [activeSubtopic, setActiveSubtopic] = useState<{ unitId: string; subtopicId: string } | null>(null)
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(false)
  const { t, translateSubtopic, getStudyGuide } = useLanguage()

  // Check if notifications are enabled
  const checkNotificationPermission = async () => {
    const hasPermission = await NotificationService.requestPermission()
    setNotificationsEnabled(hasPermission)
  }

  const handleAddTask = (unitId: string, subtopicId: string) => {
    if (newTaskText.trim()) {
      let fullDueDate: string | undefined
      if (selectedDate) {
        const formattedDate = format(selectedDate, "yyyy-MM-dd")
        fullDueDate = selectedTime ? `${formattedDate}T${selectedTime}` : formattedDate
      }

      addTask(
        subject.id,
        unitId,
        subtopicId,
        newTaskText,
        fullDueDate,
        selectedDate && reminderTime ? reminderTime : undefined,
      )

      setNewTaskText("")
      setSelectedDate(undefined)
      setSelectedTime(undefined)
      setReminderTime("at-time")
    }
  }

  const calculateUnitProgress = (unitId: string) => {
    const unit = subject.units.find((u) => u.id === unitId)
    if (!unit) return 0

    let totalTasks = 0
    let completedTasks = 0

    unit.subtopics.forEach((subtopic) => {
      totalTasks += subtopic.tasks.length
      completedTasks += subtopic.tasks.filter((task) => task.completed).length
    })

    return totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100)
  }

  const calculateSubtopicProgress = (unitId: string, subtopicId: string) => {
    const unit = subject.units.find((u) => u.id === unitId)
    if (!unit) return 0

    const subtopic = unit.subtopics.find((s) => s.id === subtopicId)
    if (!subtopic) return 0

    const totalTasks = subtopic.tasks.length
    const completedTasks = subtopic.tasks.filter((task) => task.completed).length

    return totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100)
  }

  const isSubtopicCompleted = (unitId: string, subtopicId: string) => {
    const unit = subject.units.find((u) => u.id === unitId)
    if (!unit) return false

    const subtopic = unit.subtopics.find((s) => s.id === subtopicId)
    if (!subtopic || subtopic.tasks.length === 0) return false

    return subtopic.tasks.every((task) => task.completed)
  }

  const toggleAllTasksInSubtopic = (unitId: string, subtopicId: string, completed: boolean) => {
    const unit = subject.units.find((u) => u.id === unitId)
    if (!unit) return

    const subtopic = unit.subtopics.find((s) => s.id === subtopicId)
    if (!subtopic || subtopic.tasks.length === 0) return

    // Toggle each task in the subtopic
    subtopic.tasks.forEach((task) => {
      if (task.completed !== completed) {
        toggleTaskCompletion(subject.id, unitId, subtopicId, task.id)
      }
    })
  }

  const isTaskOverdue = (dueDate: string | null) => {
    if (!dueDate) return false
    return new Date(dueDate) < new Date() && new Date(dueDate).setHours(0, 0, 0, 0) !== new Date().setHours(0, 0, 0, 0)
  }

  return (
    <div className="bg-card rounded-lg p-4 shadow-sm">
      <h2 className="text-2xl font-bold mb-4">{subject.name}</h2>

      <Accordion type="multiple" className="w-full">
        {subject.units.map((unit) => (
          <AccordionItem key={unit.id} value={unit.id}>
            <AccordionTrigger className="hover:no-underline">
              <div className="flex flex-col items-start w-full">
                <div className="flex justify-between w-full">
                  <span className="font-semibold">{t(unit.name)}</span>
                  <Badge variant="outline">{calculateUnitProgress(unit.id)}%</Badge>
                </div>
                <Progress value={calculateUnitProgress(unit.id)} className="h-2 w-full mt-2" />
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <Accordion type="multiple" className="pl-4 border-l-2 border-muted">
                {unit.subtopics.map((subtopic) => (
                  <AccordionItem key={subtopic.id} value={subtopic.id}>
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex flex-col items-start w-full">
                        <div className="flex justify-between w-full">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 p-0"
                              onClick={(e) => {
                                e.stopPropagation()
                                toggleAllTasksInSubtopic(
                                  unit.id,
                                  subtopic.id,
                                  !isSubtopicCompleted(unit.id, subtopic.id),
                                )
                              }}
                            >
                              {isSubtopicCompleted(unit.id, subtopic.id) ? (
                                <CheckSquare className="h-4 w-4" />
                              ) : (
                                <Square className="h-4 w-4" />
                              )}
                            </Button>
                            <span>{translateSubtopic(subtopic.name)}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline">{calculateSubtopicProgress(unit.id, subtopic.id)}%</Badge>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                                  <Book className="w-4 h-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                  <DialogTitle>{t("study_guide")}</DialogTitle>
                                  <DialogDescription>
                                    {subject.name} - {t(unit.name)} - {translateSubtopic(subtopic.name)}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="mt-4 max-h-[60vh] overflow-y-auto">
                                  <MarkdownRenderer
                                    content={getStudyGuide(subject.id, unit.id, subtopic.id) || t("no_study_guide")}
                                  />
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                        <Progress
                          value={calculateSubtopicProgress(unit.id, subtopic.id)}
                          className="h-1.5 w-full mt-2"
                        />
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 pl-4">
                        {subtopic.tasks.length > 0 ? (
                          <div>
                            <div className="flex justify-between mb-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => toggleAllTasksInSubtopic(unit.id, subtopic.id, true)}
                                className="text-xs"
                              >
                                {t("complete_all")}
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => toggleAllTasksInSubtopic(unit.id, subtopic.id, false)}
                                className="text-xs"
                              >
                                {t("reset_all")}
                              </Button>
                            </div>
                            <ul className="space-y-2">
                              {subtopic.tasks.map((task) => (
                                <li
                                  key={task.id}
                                  className={cn(
                                    "flex items-center justify-between p-2 rounded-md",
                                    task.completed ? "bg-muted/50" : "bg-background",
                                    isTaskOverdue(task.dueDate) && !task.completed
                                      ? "border-l-4 border-destructive"
                                      : "",
                                  )}
                                >
                                  <div className="flex items-center gap-2">
                                    <Checkbox
                                      id={`task-${task.id}`}
                                      checked={task.completed}
                                      onCheckedChange={() =>
                                        toggleTaskCompletion(subject.id, unit.id, subtopic.id, task.id)
                                      }
                                    />
                                    <label
                                      htmlFor={`task-${task.id}`}
                                      className={cn(task.completed && "line-through text-muted-foreground")}
                                    >
                                      {task.text}
                                    </label>
                                    {task.dueDate && (
                                      <Badge
                                        variant={
                                          isTaskOverdue(task.dueDate) && !task.completed ? "destructive" : "outline"
                                        }
                                        className="ml-2 text-xs"
                                      >
                                        {format(new Date(task.dueDate), "MMM d, yyyy")}
                                      </Badge>
                                    )}
                                    {task.reminderTime && (
                                      <Badge variant="secondary" className="ml-2 text-xs">
                                        <Bell className="h-3 w-3 mr-1" />
                                        {t("reminder")}
                                      </Badge>
                                    )}
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => deleteTask(subject.id, unit.id, subtopic.id, task.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground italic">{t("No tasks yet")}</p>
                        )}

                        {activeSubtopic?.unitId === unit.id && activeSubtopic?.subtopicId === subtopic.id ? (
                          <div className="flex flex-col gap-2 mt-4">
                            <div className="flex gap-2">
                              <Input
                                placeholder={t("Add Task")}
                                value={newTaskText}
                                onChange={(e) => setNewTaskText(e.target.value)}
                                className="flex-1"
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    handleAddTask(unit.id, subtopic.id)
                                  }
                                }}
                              />
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button variant="outline" size="icon" onClick={checkNotificationPermission}>
                                    <CalendarIcon className="h-4 w-4" />
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0 flex flex-col gap-2">
                                  <Calendar
                                    mode="single"
                                    selected={selectedDate}
                                    onSelect={setSelectedDate}
                                    initialFocus
                                  />
                                  <div className="px-4 pb-3">
                                    <p className="text-sm font-medium mb-2">{t("time_optional")}</p>
                                    <div className="flex gap-2">
                                      <Input
                                        type="time"
                                        value={selectedTime || ""}
                                        onChange={(e) => setSelectedTime(e.target.value)}
                                        className="w-full"
                                        placeholder="HH:MM"
                                      />
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-2">{t("select_common_time")}</p>
                                    <Select value={selectedTime} onValueChange={setSelectedTime}>
                                      <SelectTrigger className="w-full mt-1">
                                        <SelectValue placeholder={t("select_time")} />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="09:00">{t("09:00 AM")}</SelectItem>
                                        <SelectItem value="12:00">{t("12:00 PM")}</SelectItem>
                                        <SelectItem value="15:00">{t("03:00 PM")}</SelectItem>
                                        <SelectItem value="18:00">{t("06:00 PM")}</SelectItem>
                                        <SelectItem value="21:00">{t("09:00 PM")}</SelectItem>
                                      </SelectContent>
                                    </Select>

                                    {selectedDate && selectedTime && notificationsEnabled && (
                                      <div className="mt-4">
                                        <p className="text-sm font-medium mb-2">
                                          {t("reminder")} ({t("optional")})
                                        </p>
                                        <RadioGroup value={reminderTime} onValueChange={setReminderTime}>
                                          <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="at-time" id="at-time" />
                                            <Label htmlFor="at-time">{t("reminder_at_time")}</Label>
                                          </div>
                                          <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="15-min" id="15-min" />
                                            <Label htmlFor="15-min">{t("reminder_15_min")}</Label>
                                          </div>
                                          <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="1-hour" id="1-hour" />
                                            <Label htmlFor="1-hour">{t("reminder_1_hour")}</Label>
                                          </div>
                                          <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="1-day" id="1-day" />
                                            <Label htmlFor="1-day">{t("reminder_1_day")}</Label>
                                          </div>
                                        </RadioGroup>
                                      </div>
                                    )}

                                    {!notificationsEnabled && selectedDate && selectedTime && (
                                      <div className="mt-4 p-2 bg-yellow-100 dark:bg-yellow-900 rounded-md">
                                        <p className="text-xs text-yellow-800 dark:text-yellow-200">
                                          {t("notifications_prompt")}
                                        </p>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className="mt-2 w-full"
                                          onClick={checkNotificationPermission}
                                        >
                                          <Bell className="h-3 w-3 mr-2" />
                                          {t("enable_notifications")}
                                        </Button>
                                      </div>
                                    )}
                                  </div>
                                </PopoverContent>
                              </Popover>
                            </div>
                            <div className="flex justify-between">
                              {selectedDate && (
                                <p className="text-xs text-muted-foreground">
                                  {t("due")}: {format(selectedDate, "PPP")}{" "}
                                  {selectedTime && format(new Date(`2025-01-01T${selectedTime}`), "p")}
                                  {selectedTime && reminderTime && notificationsEnabled && (
                                    <span className="ml-2">
                                      <Bell className="h-3 w-3 inline-block mr-1" />
                                      {reminderTime === "at-time" && t("reminder_at_time")}
                                      {reminderTime === "15-min" && t("reminder_15_min")}
                                      {reminderTime === "1-hour" && t("reminder_1_hour")}
                                      {reminderTime === "1-day" && t("reminder_1_day")}
                                    </span>
                                  )}
                                </p>
                              )}
                              <div className="flex gap-2 ml-auto">
                                <Button variant="ghost" size="sm" onClick={() => setActiveSubtopic(null)}>
                                  {t("cancel")}
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => {
                                    if (newTaskText.trim()) {
                                      handleAddTask(unit.id, subtopic.id)
                                      // Close the task input after adding
                                      setActiveSubtopic(null)
                                    } else {
                                      // Show visual feedback if task text is empty
                                      const taskInput = document.querySelector(`input[placeholder="${t("add_task")}"]`)
                                      if (taskInput) {
                                        taskInput.classList.add("border-red-500")
                                        setTimeout(() => {
                                          taskInput.classList.remove("border-red-500")
                                        }, 1000)
                                      }
                                    }
                                  }}
                                >
                                  {t("Add Task")}
                                </Button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="mt-2"
                            onClick={() => setActiveSubtopic({ unitId: unit.id, subtopicId: subtopic.id })}
                          >
                            <PlusCircle className="h-4 w-4 mr-2" />
                            {t("Add Task")}
                          </Button>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
