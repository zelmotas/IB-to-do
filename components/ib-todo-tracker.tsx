"use client"

import { useState, useEffect } from "react"
import { SubjectTasks } from "@/components/subject-tasks"
import { ibSubjects } from "@/data/ib-subjects"
import type { Subject } from "@/types/todo"
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
import { SyncService } from "@/lib/sync-service"
import { cn } from "@/lib/utils"
import { PastPaperSection } from "@/components/past-papers/past-paper-section"
import { SessionStorage } from "@/lib/session-storage"

// Import Lucide icons
import { BookOpen, CalendarIcon, FileText, Home, Moon, RefreshCw, Search, Sun } from "lucide-react"

// Add this import at the top
import { motion, AnimatePresence } from "framer-motion"

export function IbTodoTracker() {
  const [subjects, setSubjects] = useState<Subject[]>(ibSubjects)
  const [showCopyright, setShowCopyright] = useState(false)
  const [homeView, setHomeView] = useState<"calendar" | "list">("list")
  const [isSyncing, setIsSyncing] = useState(false)
  const [hasUpdates, setHasUpdates] = useState(false)
  const [activeTab, setActiveTab] = useState("home")
  const { setTheme, theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const { t } = useLanguage()
  const { user } = useAuth()
  const { toast } = useToast()

  // Set mounted to true once component is mounted
  useEffect(() => {
    setMounted(true)
  }, [])

  // Check for updates from the server
  useEffect(() => {
    if (user) {
      const checkForUpdates = async () => {
        const updates = await SyncService.checkForUpdates({ userId: user.id })
        setHasUpdates(updates)
      }

      checkForUpdates()

      // Check for updates every 5 minutes
      const interval = setInterval(checkForUpdates, 5 * 60 * 1000)

      return () => clearInterval(interval)
    }
  }, [user])

  // Load tasks from localStorage or server if user is logged in
  useEffect(() => {
    const loadData = async () => {
      if (user) {
        setIsSyncing(true)

        try {
          // Check if this is a recent login (within the last 5 seconds)
          const loginTimestamp = SessionStorage.get("login_timestamp")
          const isRecentLogin = loginTimestamp && Date.now() - loginTimestamp < 5000

          // Try to pull data from server first
          const serverData = await SyncService.pullChanges({
            userId: user.id,
            onSuccess: () => {
              SyncService.updateLastSync(user.id)
              // Only show toast if this isn't immediately after login
              if (!isRecentLogin) {
                toast({
                  title: t("dataSynced"),
                  description: t("dataSyncedDescription"),
                  duration: 3000,
                })
              }
            },
          })

          if (serverData) {
            setSubjects(serverData)
          } else {
            // If no server data, try to load from local storage
            const userKey = `ibSubjects_${user.id}`
            const savedSubjects = localStorage.getItem(userKey)

            if (savedSubjects) {
              const parsedSubjects = JSON.parse(savedSubjects)
              setSubjects(parsedSubjects)

              // Push to server
              await SyncService.pushChanges({
                userId: user.id,
                data: parsedSubjects,
                onSuccess: () => SyncService.updateLastSync(user.id),
              })
            } else {
              // If no user-specific data, try to load from general storage
              const generalSavedSubjects = localStorage.getItem("ibSubjects")
              if (generalSavedSubjects) {
                const parsedSubjects = JSON.parse(generalSavedSubjects)
                setSubjects(parsedSubjects)

                // Save to user-specific storage and push to server
                localStorage.setItem(userKey, generalSavedSubjects)
                await SyncService.pushChanges({
                  userId: user.id,
                  data: parsedSubjects,
                  onSuccess: () => SyncService.updateLastSync(user.id),
                })
              }
            }
          }

          // Load view preference
          const savedView = localStorage.getItem(`homeView_${user.id}`)
          if (savedView) {
            setHomeView(savedView as "calendar" | "list")
          }
        } catch (error) {
          console.error("Error loading data:", error)
          toast({
            title: t("syncError"),
            description: t("syncErrorDescription"),
            variant: "destructive",
          })
        } finally {
          setIsSyncing(false)
          setHasUpdates(false)
        }
      } else {
        // If no user, load from general storage
        const savedSubjects = localStorage.getItem("ibSubjects")
        if (savedSubjects) {
          setSubjects(JSON.parse(savedSubjects))
        }

        // Load general view preference
        const savedView = localStorage.getItem("homeView")
        if (savedView) {
          setHomeView(savedView as "calendar" | "list")
        }
      }
    }

    loadData()
  }, [user, toast, t])

  // Save tasks to localStorage and server whenever they change
  useEffect(() => {
    // Save to general storage
    localStorage.setItem("ibSubjects", JSON.stringify(subjects))

    // If user is logged in, save to user-specific storage and sync to server
    if (user) {
      const userKey = `ibSubjects_${user.id}`
      localStorage.setItem(userKey, JSON.stringify(subjects))

      // Debounce server sync to avoid too many requests
      const syncTimeout = setTimeout(async () => {
        setIsSyncing(true)
        try {
          await SyncService.pushChanges({
            userId: user.id,
            data: subjects,
            onSuccess: () => SyncService.updateLastSync(user.id),
          })
        } catch (error) {
          console.error("Error syncing data:", error)
        } finally {
          setIsSyncing(false)
        }
      }, 2000)

      return () => clearTimeout(syncTimeout)
    }
  }, [subjects, user])

  // Save view preference whenever it changes
  useEffect(() => {
    // Save to general storage
    localStorage.setItem("homeView", homeView)

    // If user is logged in, save to user-specific storage
    if (user) {
      localStorage.setItem(`homeView_${user.id}`, homeView)
    }
  }, [homeView, user])

  const addTask = (
    subjectId: string,
    unitId: string,
    subtopicId: string,
    taskText: string,
    dueDate?: string,
    reminderTime?: string,
  ) => {
    setSubjects((prevSubjects) => {
      const newSubjects = prevSubjects.map((subject) => {
        if (subject.id === subjectId) {
          const updatedUnits = subject.units.map((unit) => {
            if (unit.id === unitId) {
              const updatedSubtopics = unit.subtopics.map((subtopic) => {
                if (subtopic.id === subtopicId) {
                  const taskId = Date.now().toString()

                  // Schedule notification if due date and reminder time are set
                  if (dueDate && reminderTime) {
                    const subjectName = subject.name
                    const unitName = unit.name
                    const subtopicName = subtopic.name

                    NotificationService.scheduleNotification({
                      taskId,
                      title: `${t("taskDue")}: ${taskText}`,
                      body: t("taskDueSoon")
                        .replace("{subject}", subjectName)
                        .replace("{unit}", unitName)
                        .replace("{subtopic}", subtopicName),
                      dueDate,
                      reminderTime,
                    })
                  }

                  return {
                    ...subtopic,
                    tasks: [
                      ...subtopic.tasks,
                      {
                        id: taskId,
                        text: taskText,
                        completed: false,
                        dueDate: dueDate || null,
                        createdAt: new Date().toISOString(),
                        reminderTime: reminderTime || null,
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
      return newSubjects
    })
  }

  const toggleTaskCompletion = (subjectId: string, unitId: string, subtopicId: string, taskId: string) => {
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
  }

  const deleteTask = (subjectId: string, unitId: string, subtopicId: string, taskId: string) => {
    // Remove any scheduled notifications for this task
    NotificationService.removeNotification(taskId)

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
  }

  // Force sync with server
  const syncWithServer = async () => {
    if (!user) return

    setIsSyncing(true)
    try {
      // Pull latest data from server
      const serverData = await SyncService.pullChanges({
        userId: user.id,
        onSuccess: () => {
          SyncService.updateLastSync(user.id)
          toast({
            title: t("dataSynced"),
            description: t("dataSyncedDescription"),
          })
        },
      })

      if (serverData) {
        setSubjects(serverData)
      } else {
        // Push current data to server
        await SyncService.pushChanges({
          userId: user.id,
          data: subjects,
          onSuccess: () => {
            SyncService.updateLastSync(user.id)
            toast({
              title: t("dataSynced"),
              description: t("dataSyncedDescription"),
            })
          },
        })
      }
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

  // Navigation items
  const navItems = [
    { id: "home", icon: Home, label: t("home") },
    { id: "calendar", icon: CalendarIcon, label: t("calendar") },
    { id: "past-papers", icon: FileText, label: t("pastPapers") },
    { id: "search", icon: Search, label: t("search") },
  ]

  return (
    <div className="container mx-auto max-w-7xl">
      <NotificationChecker />

      <div className="flex flex-col min-h-screen">
        {/* Header */}
        <header className="py-4 border-b">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">IB Class Tracker</h1>
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
        </header>

        {/* Main content */}
        <div className="flex flex-1 mt-4">
          {/* Navigation sidebar */}
          <div className="w-64 pr-6 hidden md:block">
            <nav className="space-y-1 sticky top-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  className={cn("nav-item w-full text-left", activeTab === item.id && "active")}
                  onClick={() => setActiveTab(item.id)}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </button>
              ))}

              <div className="pt-4 mt-4 border-t">
                <h3 className="font-medium text-sm mb-2">{t("subjects")}</h3>
                {subjects.map((subject) => (
                  <button
                    key={subject.id}
                    className={cn("nav-item w-full text-left", activeTab === subject.id && "active")}
                    onClick={() => setActiveTab(subject.id)}
                  >
                    <BookOpen className="h-5 w-5" />
                    <span>{t(subject.name)}</span>
                    <span className="ml-auto bg-primary/10 text-xs rounded-full w-6 h-6 flex items-center justify-center">
                      {calculateProgress(subject)}%
                    </span>
                  </button>
                ))}
              </div>
            </nav>
          </div>

          {/* Mobile navigation */}
          <div className="md:hidden mb-4 w-full">
            <div className="flex overflow-x-auto pb-2 gap-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  className={cn("nav-item flex-shrink-0", activeTab === item.id && "active")}
                  onClick={() => setActiveTab(item.id)}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content area */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              {activeTab === "home" && (
                <motion.div
                  key="home"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <ViewToggle view={homeView} onViewChange={setHomeView} />

                  {homeView === "calendar" ? (
                    <CalendarView tasks={upcomingTasks} subjects={subjects} addTask={addTask} />
                  ) : (
                    <HomeTasks
                      tasks={upcomingTasks}
                      toggleTaskCompletion={toggleTaskCompletion}
                      deleteTask={deleteTask}
                    />
                  )}
                </motion.div>
              )}

              {activeTab === "calendar" && (
                <motion.div key="calendar" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <CalendarView tasks={upcomingTasks} subjects={subjects} addTask={addTask} />
                </motion.div>
              )}

              {activeTab === "past-papers" && (
                <motion.div key="past-papers" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <PastPaperSection />
                </motion.div>
              )}

              {activeTab === "search" && (
                <motion.div key="search" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold">{t("search")}</h2>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                      <input
                        type="search"
                        placeholder={t("searchPlaceholder")}
                        className="w-full pl-10 pr-4 py-2 border rounded-md"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {subjects.map(
                (subject) =>
                  activeTab === subject.id && (
                    <motion.div
                      key={subject.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <SubjectTasks
                        subject={subject}
                        addTask={addTask}
                        toggleTaskCompletion={toggleTaskCompletion}
                        deleteTask={deleteTask}
                      />
                    </motion.div>
                  ),
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 py-4 border-t text-center text-sm text-muted-foreground">
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
        </footer>
      </div>

      {/* AI Chat Assistant */}
      <AiChatAssistant />
    </div>
  )
}
