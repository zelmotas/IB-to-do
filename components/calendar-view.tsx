"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronLeft, ChevronRight, Plus, Clock, Bell } from "lucide-react"
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  startOfWeek,
  endOfWeek,
  addDays,
} from "date-fns"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/contexts/language-context"
import type { Task, Subject } from "@/types/todo"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { motion, AnimatePresence } from "framer-motion"

interface CalendarViewProps {
  tasks: Task[]
  subjects: Subject[]
  addTask: (
    subjectId: string,
    unitId: string,
    subtopicId: string,
    taskText: string,
    dueDate?: string,
    reminderTime?: string,
  ) => void
}

export function CalendarView({ tasks, subjects, addTask }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [showTaskDialog, setShowTaskDialog] = useState(false)
  const [hoverDate, setHoverDate] = useState<Date | null>(null)
  const [newTaskText, setNewTaskText] = useState("")
  const [selectedSubject, setSelectedSubject] = useState("")
  const [selectedUnit, setSelectedUnit] = useState("")
  const [selectedSubtopic, setSelectedSubtopic] = useState("")
  const [startTime, setStartTime] = useState<string>("")
  const [endTime, setEndTime] = useState<string>("")
  const [reminderTime, setReminderTime] = useState<string>("at-time")
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(false)
  const { t, translateSubtopic } = useLanguage()
  const calendarRef = useRef<HTMLDivElement>(null)

  // Check if notifications are enabled
  useEffect(() => {
    const checkNotificationPermission = async () => {
      if ("Notification" in window) {
        const permission = await Notification.requestPermission()
        setNotificationsEnabled(permission === "granted")
      }
    }
    checkNotificationPermission()
  }, [])

  // Reset form when dialog closes
  useEffect(() => {
    if (!showTaskDialog) {
      setNewTaskText("")
      setSelectedSubject("")
      setSelectedUnit("")
      setSelectedSubtopic("")
      setStartTime("")
      setEndTime("")
      setReminderTime("at-time")
    }
  }, [showTaskDialog])

  // Get units for selected subject
  const getUnits = () => {
    if (!selectedSubject) return []
    const subject = subjects.find((s) => s.id === selectedSubject)
    return subject ? subject.units : []
  }

  // Get subtopics for selected unit
  const getSubtopics = () => {
    if (!selectedSubject || !selectedUnit) return []
    const subject = subjects.find((s) => s.id === selectedSubject)
    if (!subject) return []
    const unit = subject.units.find((u) => u.id === selectedUnit)
    return unit ? unit.subtopics : []
  }

  // Get tasks for a specific date
  const getTasksForDate = (date: Date) => {
    return tasks.filter((task) => {
      if (!task.dueDate) return false
      return isSameDay(new Date(task.dueDate), date)
    })
  }

  // Navigate to previous month
  const prevMonth = () => {
    setCurrentMonth((prev) => {
      const newMonth = subMonths(prev, 1)
      return newMonth
    })
  }

  // Navigate to next month
  const nextMonth = () => {
    setCurrentMonth((prev) => {
      const newMonth = addMonths(prev, 1)
      return newMonth
    })
  }

  // Handle adding a new task
  const handleAddTask = () => {
    if (newTaskText.trim() && selectedSubject && selectedUnit && selectedSubtopic && selectedDate) {
      let fullDueDate = format(selectedDate, "yyyy-MM-dd")

      // Add time if specified
      if (startTime) {
        fullDueDate = `${fullDueDate}T${startTime}`
      }

      addTask(
        selectedSubject,
        selectedUnit,
        selectedSubtopic,
        newTaskText,
        fullDueDate,
        startTime && reminderTime ? reminderTime : undefined,
      )

      setShowTaskDialog(false)
    }
  }

  // Generate days for the current month view
  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const startDate = startOfWeek(monthStart)
  const endDate = endOfWeek(monthEnd)

  const days = eachDayOfInterval({ start: startDate, end: endDate })

  // Get day names for the header
  const dayNames = Array.from({ length: 7 }).map((_, i) => format(addDays(startOfWeek(new Date()), i), "EEE"))

  return (
    <div className="bg-card rounded-lg p-4 shadow-sm mb-6 transition-all duration-300 ease-in-out" ref={calendarRef}>
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="outline"
          size="icon"
          onClick={prevMonth}
          className="rounded-full hover:bg-muted/80 transition-all duration-300"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-xl font-bold">{format(currentMonth, "MMMM yyyy")}</h2>
        <Button
          variant="outline"
          size="icon"
          onClick={nextMonth}
          className="rounded-full hover:bg-muted/80 transition-all duration-300"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-2">
        {dayNames.map((day) => (
          <div key={day} className="text-center font-medium text-sm py-2 text-muted-foreground">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map((day) => {
          const dayTasks = getTasksForDate(day)
          const isCurrentMonth = isSameMonth(day, currentMonth)
          const isSelected = selectedDate ? isSameDay(day, selectedDate) : false
          const isHovered = hoverDate ? isSameDay(day, hoverDate) : false
          const dayInMonth = isCurrentMonth ? "opacity-100" : "opacity-40"

          return (
            <motion.div
              key={day.toString()}
              className={cn(
                "h-24 p-2 rounded-lg relative group transition-all duration-200",
                isCurrentMonth ? "bg-background" : "bg-muted/30",
                isToday(day) && "ring-2 ring-primary/20",
                isSelected && "ring-2 ring-primary",
                isHovered && !isSelected && "ring-1 ring-primary/50",
                dayInMonth,
              )}
              onClick={() => {
                setSelectedDate(day)
                setShowTaskDialog(true)
              }}
              onMouseEnter={() => setHoverDate(day)}
              onMouseLeave={() => setHoverDate(null)}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex justify-between items-start">
                <span
                  className={cn(
                    "flex items-center justify-center w-6 h-6 rounded-full text-sm font-medium",
                    isToday(day) && "bg-primary text-primary-foreground",
                    !isToday(day) && "text-foreground",
                  )}
                >
                  {format(day, "d")}
                </span>

                <AnimatePresence>
                  {(isHovered || isSelected) && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.15 }}
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 rounded-full bg-primary/10 hover:bg-primary/20"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedDate(day)
                          setShowTaskDialog(true)
                        }}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="mt-1 space-y-1 overflow-y-auto max-h-[70px] scrollbar-thin">
                {dayTasks.slice(0, 3).map((task) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Badge
                      variant="outline"
                      className="text-xs block truncate px-1.5 py-0.5 border-l-4"
                      style={{ borderLeftColor: task.subjectColor, backgroundColor: `${task.subjectColor}10` }}
                    >
                      {task.text}
                    </Badge>
                  </motion.div>
                ))}
                {dayTasks.length > 3 && (
                  <Badge variant="outline" className="text-xs bg-muted/50">
                    +{dayTasks.length - 3} {t("more")}
                  </Badge>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>

      <Dialog open={showTaskDialog} onOpenChange={setShowTaskDialog}>
        <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <DialogHeader className="px-6 pt-6 pb-2">
              <DialogTitle className="text-xl">
                {t("addTaskFor")} {selectedDate ? format(selectedDate, "MMMM d, yyyy") : ""}
              </DialogTitle>
              <DialogDescription>{t("createNewTaskDescription")}</DialogDescription>
            </DialogHeader>

            <div className="px-6 py-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="task-text">{t("taskDescription")}</Label>
                <Input
                  id="task-text"
                  value={newTaskText}
                  onChange={(e) => setNewTaskText(e.target.value)}
                  placeholder={t("enterTaskDescription")}
                  className="transition-all duration-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t("startTime")}</Label>
                  <div className="relative">
                    <Input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="pl-9 transition-all duration-200"
                    />
                    <Clock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>
                    {t("endTime")} ({t("optional")})
                  </Label>
                  <div className="relative">
                    <Input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="pl-9 transition-all duration-200"
                    />
                    <Clock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">{t("subject")}</Label>
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger id="subject" className="transition-all duration-200">
                    <SelectValue placeholder={t("selectSubject")} />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject.id} value={subject.id}>
                        <div className="flex items-center">
                          <div
                            className="w-3 h-3 rounded-full mr-2"
                            style={{ backgroundColor: subject.color.replace("bg-", "") }}
                          ></div>
                          {t(subject.name)}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedSubject && (
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.2 }}
                >
                  <Label htmlFor="unit">{t("unit")}</Label>
                  <Select value={selectedUnit} onValueChange={setSelectedUnit}>
                    <SelectTrigger id="unit" className="transition-all duration-200">
                      <SelectValue placeholder={t("selectUnit")} />
                    </SelectTrigger>
                    <SelectContent>
                      {getUnits().map((unit) => (
                        <SelectItem key={unit.id} value={unit.id}>
                          {t(unit.name)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </motion.div>
              )}

              {selectedUnit && (
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.2 }}
                >
                  <Label htmlFor="subtopic">{t("subtopic")}</Label>
                  <Select value={selectedSubtopic} onValueChange={setSelectedSubtopic}>
                    <SelectTrigger id="subtopic" className="transition-all duration-200">
                      <SelectValue placeholder={t("selectSubtopic")} />
                    </SelectTrigger>
                    <SelectContent>
                      {getSubtopics().map((subtopic) => (
                        <SelectItem key={subtopic.id} value={subtopic.id}>
                          {translateSubtopic(subtopic.name)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </motion.div>
              )}

              {startTime && (
                <motion.div
                  className="space-y-2 bg-muted/30 p-3 rounded-lg"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center">
                    <Bell className="h-4 w-4 mr-2 text-muted-foreground" />
                    <Label>
                      {t("reminder")} ({t("optional")})
                    </Label>
                  </div>

                  <RadioGroup value={reminderTime} onValueChange={setReminderTime} className="mt-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="at-time" id="at-time" />
                      <Label htmlFor="at-time" className="cursor-pointer">
                        {t("reminderAtTime")}
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="15-min" id="15-min" />
                      <Label htmlFor="15-min" className="cursor-pointer">
                        {t("reminder15Min")}
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="1-hour" id="1-hour" />
                      <Label htmlFor="1-hour" className="cursor-pointer">
                        {t("reminder1Hour")}
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="1-day" id="1-day" />
                      <Label htmlFor="1-day" className="cursor-pointer">
                        {t("reminder1Day")}
                      </Label>
                    </div>
                  </RadioGroup>

                  {!notificationsEnabled && (
                    <div className="mt-2 p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-md text-xs">
                      <p className="text-yellow-800 dark:text-yellow-200">{t("notificationsPrompt")}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2 w-full text-xs"
                        onClick={async () => {
                          if ("Notification" in window) {
                            const permission = await Notification.requestPermission()
                            setNotificationsEnabled(permission === "granted")
                          }
                        }}
                      >
                        <Bell className="h-3 w-3 mr-2" />
                        {t("enableNotifications")}
                      </Button>
                    </div>
                  )}
                </motion.div>
              )}
            </div>

            <DialogFooter className="px-6 py-4 bg-muted/30">
              <Button variant="outline" onClick={() => setShowTaskDialog(false)}>
                {t("cancel")}
              </Button>
              <Button
                onClick={handleAddTask}
                disabled={!newTaskText || !selectedSubject || !selectedUnit || !selectedSubtopic}
                className="transition-all duration-200"
              >
                {t("addTaskButton")}
              </Button>
            </DialogFooter>
          </motion.div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
