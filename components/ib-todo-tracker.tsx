"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SubjectTasks } from "@/components/subject-tasks"
import { ibSubjects } from "@/data/ib-subjects"
import type { Subject, Task } from "@/types/todo"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { HomeTasks } from "@/components/home-tasks"
import { NotificationChecker } from "@/components/notification-checker"
import { NotificationService } from "@/lib/notification-service"
import { useLanguage } from "@/contexts/language-context"
import { LanguageToggle } from "@/components/language-toggle"
import { AuthButton } from "@/components/auth/auth-button"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { CalendarView } from "@/components/calendar-view"
import { ViewToggle } from "@/components/view-toggle"
import { AiChatAssistant } from "@/components/ai-chat-assistant"
import { DataService } from "@/lib/data-service"
import { cn } from "@/lib/utils"
import { DataSync } from "@/components/data-sync"

// Import Lucide icons at the top of the file
import { Home, Sun, Moon, RefreshCw } from "lucide-react"

// Add this import at the top
import { motion, AnimatePresence } from "framer-motion"

export function IbTodoTracker() {
  const [subjects, setSubjects] = useState<Subject[]>(ibSubjects)
  const [showCopyright, setShowCopyright] = useState(false)
  const [homeView, setHomeView] = useState<"calendar" | "list">("list")
  const [isSyncing, setIsSyncing] = useState(false)
  const [hasUpdates, setHasUpdates] = useState(false)
  const { setTheme, theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const { t } = useLanguage()
  const { user } = useAuth()
  const { toast } = useToast()

  // Set mounted to true once component is mounted
  useEffect(() => {
    setMounted(true)
  }, [])

  // Load tasks from Supabase when user is authenticated
  useEffect(() => {
    const loadUserTasks = async () => {
      if (!user) return

      setIsSyncing(true)
      try {
        const userTasks = await DataService.getUserTasks(user.id)

        // Map tasks to subjects structure
        const updatedSubjects = [...ibSubjects]

        userTasks.forEach((task) => {
          const subjectIndex = updatedSubjects.findIndex((s) => s.id === task.subject_id)
          if (subjectIndex === -1) return

          const unitIndex = updatedSubjects[subjectIndex].units.findIndex((u) => u.id === task.unit_id)
          if (unitIndex === -1) return

          const subtopicIndex = updatedSubjects[subjectIndex].units[unitIndex].subtopics.findIndex(
            (s) => s.id === task.subtopic_id,
          )
          if (subtopicIndex === -1) return

          // Convert task to the expected format
          const formattedTask: Task = {
            id: task.id,
            text: task.text,
            completed: task.completed,
            dueDate: task.due_date,
            createdAt: task.created_at,
            reminderTime: task.reminder_time,
            subjectId: task.subject_id,
            unitId: task.unit_id,
            subtopicId: task.subtopic_id,
            subjectName: task.subject_name,
            unitName: task.unit_name,
            subtopicName: task.subtopic_name,
            subjectColor: task.subject_color,
          }

          updatedSubjects[subjectIndex].units[unitIndex].subtopics[subtopicIndex].tasks.push(formattedTask)
        })

        setSubjects(updatedSubjects)

        toast({
          title: t("dataLoaded"),
          description: t("dataLoadedDescription"),
          duration: 3000,
        })
      } catch (error) {
        console.error("Error loading tasks:", error)
        toast({
          title: "Error",
          description: "Failed to load your tasks. Please refresh the page.",
          variant: "destructive",
        })
      } finally {
        setIsSyncing(false)
      }
    }

    loadUserTasks()
  }, [user, toast, t])

  const addTask = async (
    subjectId: string,
    unitId: string,
    subtopicId: string,
    taskText: string,
    dueDate?: string,
    reminderTime?: string,
  ) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save tasks.",
        variant: "destructive",
      })
      return
    }

    try {
      const subject = subjects.find((s) => s.id === subjectId)
      const unit = subject?.units.find((u) => u.id === unitId)
      const subtopic = unit?.subtopics.find((s) => s.id === subtopicId)

      if (!subject || !unit || !subtopic) {
        throw new Error("Invalid subject, unit, or subtopic")
      }

      // Create task in database
      const newTask = await DataService.createTask({
        user_id: user.id,
        text: taskText,
        completed: false,
        due_date: dueDate || null,
        reminder_time: reminderTime || null,
        subject_id: subjectId,
        unit_id: unitId,
        subtopic_id: subtopicId,
        subject_name: subject.name,
        unit_name: unit.name,
        subtopic_name: subtopic.name,
        subject_color: subject.color,
      })

      // Schedule notification if due date and reminder time are set
      if (dueDate && reminderTime) {
        NotificationService.scheduleNotification({
          taskId: newTask.id,
          title: `${t("taskDue")}: ${taskText}`,
          body: t("taskDueSoon")
            .replace("{subject}", subject.name)
            .replace("{unit}", unit.name)
            .replace("{subtopic}", subtopic.name),
          dueDate,
          reminderTime,
        })
      }

      // Update local state
      setSubjects((prevSubjects) => {
        return prevSubjects.map((subject) => {
          if (subject.id === subjectId) {
            const updatedUnits = subject.units.map((unit) => {
              if (unit.id === unitId) {
                const updatedSubtopics = unit.subtopics.map((subtopic) => {
                  if (subtopic.id === subtopicId) {
                    return {
                      ...subtopic,
                      tasks: [
                        ...subtopic.tasks,
                        {
                          id: newTask.id,
                          text: taskText,
                          completed: false,
                          dueDate: dueDate || null,
                          createdAt: newTask.created_at,
                          reminderTime: reminderTime || null,
                          subjectId,
                          unitId,
                          subtopicId,
                          subjectName: subject.name,
                          unitName: unit.name,
                          subtopicName: subtopic.name,
                          subjectColor: subject.color,
                        },
                      ],
                    }
                  }
                  return subtopic
                })
                return { ...unit, subtopics: updatedSubtopics }
              }
              return unit
            })
            return { ...subject, units: updatedUnits }
          }
          return subject
        })
      })
    } catch (error) {
      console.error("Error adding task:", error)
      toast({
        title: "Error",
        description: "Failed to add task. Please try again.",
        variant: "destructive",
      })
    }
  }

  const toggleTaskCompletion = async (subjectId: string, unitId: string, subtopicId: string, taskId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to update tasks.",
        variant: "destructive",
      })
      return
    }

    try {
      // Find the task
      let taskToUpdate: Task | null = null
      let isCompleted = false

      subjects.forEach((subject) => {
        if (subject.id === subjectId) {
          subject.units.forEach((unit) => {
            if (unit.id === unitId) {
              unit.subtopics.forEach((subtopic) => {
                if (subtopic.id === subtopicId) {
                  const task = subtopic.tasks.find((t) => t.id === taskId)
                  if (task) {
                    taskToUpdate = task
                    isCompleted = task.completed
                  }
                }
              })
            }
          })
        }
      })

      if (!taskToUpdate) {
        throw new Error("Task not found")
      }

      // Update task in database
      await DataService.updateTask(taskId, { completed: !isCompleted })

      // Update local state
      setSubjects((prevSubjects) => {
        return prevSubjects.map((subject) => {
          if (subject.id === subjectId) {
            const updatedUnits = subject.units.map((unit) => {
              if (unit.id === unitId) {
                const updatedSubtopics = unit.subtopics.map((subtopic) => {
                  if (subtopic.id === subtopicId) {
                    const updatedTasks = subtopic.tasks.map((task) => {
                      if (task.id === taskId) {
                        return { ...task, completed: !task.completed }
                      }
                      return task
                    })
                    return { ...subtopic, tasks: updatedTasks }
                  }
                  return subtopic
                })
                return { ...unit, subtopics: updatedSubtopics }
              }
              return unit
            })
            return { ...subject, units: updatedUnits }
          }
          return subject
        })
      })
    } catch (error) {
      console.error("Error toggling task completion:", error)
      toast({
        title: "Error",
        description: "Failed to update task. Please try again.",
        variant: "destructive",
      })
    }
  }

  const deleteTask = async (subjectId: string, unitId: string, subtopicId: string, taskId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to delete tasks.",
        variant: "destructive",
      })
      return
    }

    try {
      // Remove any scheduled notifications for this task
      NotificationService.removeNotification(taskId)

      // Delete task from database
      await DataService.deleteTask(taskId)

      // Update local state
      setSubjects((prevSubjects) => {
        return prevSubjects.map((subject) => {
          if (subject.id === subjectId) {
            const updatedUnits = subject.units.map((unit) => {
              if (unit.id === unitId) {
                const updatedSubtopics = unit.subtopics.map((subtopic) => {
                  if (subtopic.id === subtopicId) {
                    return {
                      ...subtopic,
                      tasks: subtopic.tasks.filter((task) => task.id !== taskId),
                    }
                  }
                  return subtopic
                })
                return { ...unit, subtopics: updatedSubtopics }
              }
              return unit
            })
            return { ...subject, units: updatedUnits }
          }
          return subject
        })
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

  // Force sync with server
  const syncWithServer = async () => {
    if (!user) return

    setIsSyncing(true)
    try {
      // Fetch latest tasks from server
      const userTasks = await DataService.getUserTasks(user.id)

      // Map tasks to subjects structure
      const updatedSubjects = [...ibSubjects]

      // Clear existing tasks
      updatedSubjects.forEach((subject) => {
        subject.units.forEach((unit) => {
          unit.subtopics.forEach((subtopic) => {
            subtopic.tasks = []
          })
        })
      })

      // Add fetched tasks
      userTasks.forEach((task) => {
        const subjectIndex = updatedSubjects.findIndex((s) => s.id === task.subject_id)
        if (subjectIndex === -1) return

        const unitIndex = updatedSubjects[subjectIndex].units.findIndex((u) => u.id === task.unit_id)
        if (unitIndex === -1) return

        const subtopicIndex = updatedSubjects[subjectIndex].units[unitIndex].subtopics.findIndex(
          (s) => s.id === task.subtopic_id,
        )
        if (subtopicIndex === -1) return

        // Convert task to the expected format
        const formattedTask: Task = {
          id: task.id,
          text: task.text,
          completed: task.completed,
          dueDate: task.due_date,
          createdAt: task.created_at,
          reminderTime: task.reminder_time,
          subjectId: task.subject_id,
          unitId: task.unit_id,
          subtopicId: task.subtopic_id,
          subjectName: task.subject_name,
          unitName: task.unit_name,
          subtopicName: task.subtopic_name,
          subjectColor: task.subject_color,
        }

        updatedSubjects[subjectIndex].units[unitIndex].subtopics[subtopicIndex].tasks.push(formattedTask)
      })

      setSubjects(updatedSubjects)

      toast({
        title: t("dataSynced"),
        description: t("dataSyncedDescription"),
      })
    } catch (error) {
      console.error("Error syncing with server:", error)
      toast({
        title: t("syncError"),
        description: t("syncErrorDescription"),
        variant: "destructive",
      })
    } finally {
      setIsSyncing(false)
      setHasUpdates(false)
    }
  }

  // Calculate progress for each subject
  const calculateProgress = (subject: Subject) => {
    let totalTasks = 0
    let completedTasks = 0

    subject.units.forEach((unit) => {
      unit.subtopics.forEach((subtopic) => {
        totalTasks += subtopic.tasks.length
        completedTasks += subtopic.tasks.filter((task) => task.completed).length
      })
    })

    return totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100)
  }

  const upcomingTasks = subjects.flatMap((subject) =>
    subject.units.flatMap((unit) =>
      unit.subtopics.flatMap((subtopic) =>
        subtopic.tasks
          .filter((task) => task.dueDate && new Date(task.dueDate) >= new Date())
          .map((task) => ({
            ...task,
            subjectId: subject.id,
            unitId: unit.id,
            subtopicId: subtopic.id,
            subjectName: subject.name,
            unitName: unit.name,
            subtopicName: subtopic.name,
            subjectColor: subject.color,
          })),
      ),
    ),
  )

  upcomingTasks.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())

  // Create a more visible theme toggle button
  const themeToggle = mounted ? (
    <Button
      variant="outline"
      size="icon"
      onClick={() => {
        const newTheme = theme === "dark" ? "light" : "dark"
        setTheme(newTheme)
        // Force theme application by adding/removing class from document
        if (newTheme === "dark") {
          document.documentElement.classList.add("dark")
        } else {
          document.documentElement.classList.remove("dark")
        }
      }}
      className="border-2 transition-all duration-200 hover:scale-110"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      {theme === "dark" ? (
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
      )}
    </Button>
  ) : (
    // Render a placeholder while mounting to prevent layout shift
    <div className="w-9 h-9"></div>
  )

  return (
    <div className="container mx-auto max-w-5xl">
      <NotificationChecker />

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-center">{t("appTitle")}</h1>
        <div className="flex gap-2">
          {user && (
            <Button
              variant="outline"
              size="icon"
              onClick={syncWithServer}
              disabled={isSyncing}
              className={cn("border-2 transition-all duration-200 hover:scale-110", hasUpdates && "border-primary")}
              aria-label={t("syncData")}
            >
              <RefreshCw
                className={cn("h-[1.2rem] w-[1.2rem]", isSyncing && "animate-spin", hasUpdates && "text-primary")}
              />
            </Button>
          )}
          <AuthButton />
          <LanguageToggle />
          {themeToggle}
        </div>
      </div>

      <Tabs defaultValue="home">
        <TabsList className="grid w-full mb-6" style={{ gridTemplateColumns: `repeat(${subjects.length + 1}, 1fr)` }}>
          <TabsTrigger value="home" className="text-center flex items-center justify-center">
            <Home className="w-4 h-4 mr-2" />
            {t("home")}
          </TabsTrigger>
          {subjects.map((subject) => (
            <TabsTrigger key={subject.id} value={subject.id} className="text-center flex items-center justify-center">
              {t(subject.id)}
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-6 h-6 flex items-center justify-center">
                {calculateProgress(subject)}%
              </span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="home">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ViewToggle view={homeView} onViewChange={setHomeView} />

            <AnimatePresence mode="wait">
              {homeView === "calendar" ? (
                <motion.div
                  key="calendar"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <CalendarView tasks={upcomingTasks} subjects={subjects} addTask={addTask} />
                </motion.div>
              ) : (
                <motion.div
                  key="list"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <HomeTasks
                    tasks={upcomingTasks}
                    toggleTaskCompletion={toggleTaskCompletion}
                    deleteTask={deleteTask}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </TabsContent>

        {subjects.map((subject) => (
          <TabsContent key={subject.id} value={subject.id}>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <SubjectTasks
                subject={subject}
                addTask={addTask}
                toggleTaskCompletion={toggleTaskCompletion}
                deleteTask={deleteTask}
              />
            </motion.div>
          </TabsContent>
        ))}
      </Tabs>
      <div className="flex justify-center mt-4">
        <Button variant="link" size="sm" onClick={() => setShowCopyright(!showCopyright)}>
          {showCopyright ? t("hideCopyright") : t("showCopyright")}
        </Button>
      </div>
      {showCopyright && (
        <div className="text-center text-xs text-muted-foreground mt-2">
          <p className="mb-2">
            <a
              href="https://ibtrack.online"
              className="text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              IB to-do list tracker
            </a>{" "}
            by{" "}
            <a
              href="https://www.linkedin.com/in/zayd-el-motassadeq-723b73212/"
              className="text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Zayd El Motassadeq
            </a>{" "}
            is licensed under{" "}
            <a
              href="https://creativecommons.org/licenses/by-nc-nd/4.0/?ref=chooser-v1"
              className="text-primary hover:underline"
              target="_blank"
              rel="license noopener noreferrer"
            >
              CC BY-NC-ND 4.0
            </a>
          </p>
          <div className="flex items-center justify-center gap-1">
            <img
              src="https://mirrors.creativecommons.org/presskit/icons/cc.svg?ref=chooser-v1"
              alt="CC"
              className="h-5"
            />
            <img
              src="https://mirrors.creativecommons.org/presskit/icons/by.svg?ref=chooser-v1"
              alt="BY"
              className="h-5"
            />
            <img
              src="https://mirrors.creativecommons.org/presskit/icons/nc.svg?ref=chooser-v1"
              alt="NC"
              className="h-5"
            />
            <img
              src="https://mirrors.creativecommons.org/presskit/icons/nd.svg?ref=chooser-v1"
              alt="ND"
              className="h-5"
            />
          </div>
        </div>
      )}

      {/* Real-time data sync component */}
      <DataSync
        onTasksChange={(tasks) => {
          if (tasks.length > 0) {
            syncWithServer()
          }
        }}
      />

      {/* AI Chat Assistant */}
      <AiChatAssistant />
    </div>
  )
}
