"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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

// Import Lucide icons at the top of the file
import { Home, Sun, Moon } from "lucide-react"

export function IbTodoTracker() {
  const [subjects, setSubjects] = useState<Subject[]>(ibSubjects)
  const [showCopyright, setShowCopyright] = useState(false)
  const { setTheme, theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const { t } = useLanguage()
  const { user } = useAuth()
  const { toast } = useToast()

  // Set mounted to true once component is mounted
  useEffect(() => {
    setMounted(true)
  }, [])

  // Load tasks from localStorage or cookies if user is logged in
  useEffect(() => {
    if (user) {
      // If user is logged in, try to load from user-specific storage
      const userKey = `ibSubjects_${user.id}`
      const savedSubjects = localStorage.getItem(userKey)
      if (savedSubjects) {
        setSubjects(JSON.parse(savedSubjects))
        toast({
          title: t("data_loaded"),
          description: t("data_loaded_description"),
          duration: 3000,
        })
      } else {
        // If no user-specific data, try to load from general storage
        const generalSavedSubjects = localStorage.getItem("ibSubjects")
        if (generalSavedSubjects) {
          setSubjects(JSON.parse(generalSavedSubjects))
          // Save to user-specific storage
          localStorage.setItem(userKey, generalSavedSubjects)
        }
      }
    } else {
      // If no user, load from general storage
      const savedSubjects = localStorage.getItem("ibSubjects")
      if (savedSubjects) {
        setSubjects(JSON.parse(savedSubjects))
      }
    }
  }, [user, toast, t])

  // Save tasks to localStorage and cookies whenever they change
  useEffect(() => {
    // Save to general storage
    localStorage.setItem("ibSubjects", JSON.stringify(subjects))

    // If user is logged in, save to user-specific storage
    if (user) {
      const userKey = `ibSubjects_${user.id}`
      localStorage.setItem(userKey, JSON.stringify(subjects))
    }
  }, [subjects, user])

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
                      title: `${t("task_due")}: ${taskText}`,
                      body: t("task_due_soon")
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
        <h1 className="text-3xl font-bold text-center">{t("app_title")}</h1>
        <div className="flex gap-2">
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
          <HomeTasks tasks={upcomingTasks} toggleTaskCompletion={toggleTaskCompletion} deleteTask={deleteTask} />
        </TabsContent>

        {subjects.map((subject) => (
          <TabsContent key={subject.id} value={subject.id}>
            <SubjectTasks
              subject={subject}
              addTask={addTask}
              toggleTaskCompletion={toggleTaskCompletion}
              deleteTask={deleteTask}
            />
          </TabsContent>
        ))}
      </Tabs>
      <div className="flex justify-center mt-4">
        <Button variant="link" size="sm" onClick={() => setShowCopyright(!showCopyright)}>
          {showCopyright ? t("hide_copyright") : t("show_copyright")}
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
    </div>
  )
}
