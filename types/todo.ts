export interface Task {
  id: string
  text: string
  completed: boolean
  dueDate: string | null
  createdAt: string
  reminderTime?: string | null
  subjectId?: string
  unitId?: string
  subtopicId?: string
  subjectName?: string
  unitName?: string
  subtopicName?: string
  subjectColor?: string
}

export interface Subtopic {
  id: string
  name: string
  tasks: Task[]
}

export interface Unit {
  id: string
  name: string
  subtopics: Subtopic[]
}

export interface Subject {
  id: string
  name: string
  color: string
  units: Unit[]
  studyGuide?: {
    [unitId: string]: {
      [subtopicId: string]: string
    }
  }
}
