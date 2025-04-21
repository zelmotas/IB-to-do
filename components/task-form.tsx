"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLanguage } from "@/contexts/language-context"
import { ibSubjects } from "@/data/ib-subjects"

interface TaskFormProps {
  date: Date
  onAddTask: (subjectId: string, unitId: string, subtopicId: string, taskText: string, dueDate?: string) => void
  onCancel: () => void
}

export function TaskForm({ date, onAddTask, onCancel }: TaskFormProps) {
  const [taskText, setTaskText] = useState("")
  const [selectedSubject, setSelectedSubject] = useState("")
  const [selectedUnit, setSelectedUnit] = useState("")
  const [selectedSubtopic, setSelectedSubtopic] = useState("")
  const { t, translateSubtopic } = useLanguage()

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

  // Handle form submission
  const handleSubmit = () => {
    if (taskText && selectedSubject && selectedUnit && selectedSubtopic) {
      const formattedDate = format(date, "yyyy-MM-dd")
      onAddTask(selectedSubject, selectedUnit, selectedSubtopic, taskText, formattedDate)
    }
  }

  return (
    <Card className="mt-4">
      <CardContent className="pt-6">
        <h3 className="text-lg font-medium mb-4">
          {t("addTaskFor")} {format(date, "MMMM d, yyyy")}
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">{t("taskDescription")}</label>
            <Input
              value={taskText}
              onChange={(e) => setTaskText(e.target.value)}
              placeholder={t("enterTaskDescription")}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">{t("subject")}</label>
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger>
                <SelectValue placeholder={t("selectSubject")} />
              </SelectTrigger>
              <SelectContent>
                {ibSubjects.map((subject) => (
                  <SelectItem key={subject.id} value={subject.id}>
                    {t(subject.name)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedSubject && (
            <div>
              <label className="block text-sm font-medium mb-1">{t("unit")}</label>
              <Select value={selectedUnit} onValueChange={setSelectedUnit}>
                <SelectTrigger>
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
            </div>
          )}

          {selectedUnit && (
            <div>
              <label className="block text-sm font-medium mb-1">{t("subtopic")}</label>
              <Select value={selectedSubtopic} onValueChange={setSelectedSubtopic}>
                <SelectTrigger>
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
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-2">
            <Button variant="outline" onClick={onCancel}>
              {t("cancel")}
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!taskText || !selectedSubject || !selectedUnit || !selectedSubtopic}
            >
              {t("addTaskButton")}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
