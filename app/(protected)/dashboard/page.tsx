"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Calendar, CheckCircle2, Clock, FileText, Plus } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { HomeTasks } from "@/components/home-tasks"
import { useLanguage } from "@/contexts/language-context"
import { useAuth } from "@/contexts/auth-context"
import { Badge } from "@/components/ui/badge"
import { pastPaperService } from "@/services/past-paper-service"
import type { PastPaper } from "@/types/past-paper"

export default function DashboardPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const { user } = useAuth()
  const [tasks, setTasks] = useState([])
  const [completedTasks, setCompletedTasks] = useState(0)
  const [totalTasks, setTotalTasks] = useState(0)
  const [recentPapers, setRecentPapers] = useState<PastPaper[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading tasks
    setTimeout(() => {
      setIsLoading(false)
      setTotalTasks(12)
      setCompletedTasks(5)
    }, 1000)

    // Load recent papers
    const loadRecentPapers = async () => {
      try {
        const papers = await pastPaperService.getPastPapers({ limit: 3 })
        setRecentPapers(papers)
      } catch (error) {
        console.error("Failed to load recent papers:", error)
      }
    }

    loadRecentPapers()
  }, [])

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return t("goodMorning")
    if (hour < 18) return t("goodAfternoon")
    return t("goodEvening")
  }

  return (
    <div className="space-y-8">
      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {getGreeting()}, {user?.email?.split("@")[0] || t("student")}!
            </h1>
            <p className="text-muted-foreground mt-1">{t("trackYourProgress")}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={() => router.push("/subjects")}>
              <Plus className="mr-2 h-4 w-4" />
              {t("addTask")}
            </Button>
          </div>
        </motion.div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <CheckCircle2 className="mr-2 h-5 w-5 text-primary" />
                {t("taskProgress")}
              </CardTitle>
              <CardDescription>{t("overallCompletion")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">
                  {completedTasks}/{totalTasks} {t("tasksCompleted")}
                </span>
                <span className="text-sm font-medium">{Math.round((completedTasks / totalTasks) * 100)}%</span>
              </div>
              <Progress value={(completedTasks / totalTasks) * 100} className="h-2" />
            </CardContent>
            <CardFooter>
              <Button variant="ghost" size="sm" className="w-full" onClick={() => router.push("/subjects")}>
                {t("viewAllTasks")}
              </Button>
            </CardFooter>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-primary" />
                {t("upcomingDeadlines")}
              </CardTitle>
              <CardDescription>{t("nextSevenDays")}</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  <div className="h-6 bg-muted rounded animate-pulse" />
                  <div className="h-6 bg-muted rounded animate-pulse" />
                </div>
              ) : totalTasks > 0 ? (
                <ul className="space-y-2">
                  <li className="flex justify-between items-center">
                    <span className="text-sm">Chemistry Paper 1</span>
                    <Badge variant="outline" className="text-xs">
                      <Clock className="mr-1 h-3 w-3" />2 {t("daysLeft")}
                    </Badge>
                  </li>
                  <li className="flex justify-between items-center">
                    <span className="text-sm">Math Assignment</span>
                    <Badge variant="outline" className="text-xs">
                      <Clock className="mr-1 h-3 w-3" />5 {t("daysLeft")}
                    </Badge>
                  </li>
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">{t("noUpcomingDeadlines")}</p>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="ghost" size="sm" className="w-full" onClick={() => router.push("/calendar")}>
                {t("viewCalendar")}
              </Button>
            </CardFooter>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <FileText className="mr-2 h-5 w-5 text-primary" />
                {t("recentPastPapers")}
              </CardTitle>
              <CardDescription>{t("recentlyAddedPapers")}</CardDescription>
            </CardHeader>
            <CardContent>
              {recentPapers.length > 0 ? (
                <ul className="space-y-2">
                  {recentPapers.map((paper) => (
                    <li key={paper.id} className="flex justify-between items-center">
                      <span className="text-sm truncate max-w-[70%]">{paper.title}</span>
                      <Badge variant="secondary" className="text-xs">
                        {paper.subject}
                      </Badge>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">{t("noPastPapersYet")}</p>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="ghost" size="sm" className="w-full" onClick={() => router.push("/past-papers")}>
                {t("viewAllPapers")}
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </section>

      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>{t("upcomingTasks")}</CardTitle>
              <CardDescription>{t("tasksToComplete")}</CardDescription>
            </CardHeader>
            <CardContent>
              <HomeTasks tasks={tasks} toggleTaskCompletion={() => {}} deleteTask={() => {}} />
            </CardContent>
          </Card>
        </motion.div>
      </section>
    </div>
  )
}
