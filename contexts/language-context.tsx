"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { frenchStudyGuides } from "@/lib/translations"
import { subtopicTranslations } from "@/lib/subtopic-translations"

type Language = "en" | "fr"

interface LanguageContextType {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: string) => string
  getStudyGuide: (subjectId: string, unitId: string, subtopicId: string) => string
  translateSubtopic: (subtopicName: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")
  const [subjects, setSubjects] = useState<any[]>([])

  // Load language preference from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage) {
      setLanguage(savedLanguage)
    }

    // Load subjects for study guide translations
    const savedSubjects = localStorage.getItem("ibSubjects")
    if (savedSubjects) {
      setSubjects(JSON.parse(savedSubjects))
    }
  }, [])

  // Save language preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("language", language)
  }, [language])

  // Translation function
  const t = (key: string): string => {
    return translations[language][key] || translations.en[key] || key
  }

  // Translate subtopic names
  const translateSubtopic = (subtopicName: string): string => {
    if (language === "en") return subtopicName

    // Check if we have a translation for this subtopic
    const translatedName = subtopicTranslations[language][subtopicName]
    return translatedName || subtopicName
  }

  // Get study guide content based on language
  const getStudyGuide = (subjectId: string, unitId: string, subtopicId: string): string => {
    if (language === "fr") {
      // Try to get French study guide
      try {
        if (frenchStudyGuides[unitId] && frenchStudyGuides[unitId][subtopicId]) {
          return frenchStudyGuides[unitId][subtopicId]
        }
      } catch (e) {
        console.error("Error getting French study guide:", e)
      }
    }

    // Fall back to English study guide from subjects
    try {
      const subject = subjects.find((s) => s.id === subjectId)
      if (subject?.studyGuide && subject.studyGuide[unitId] && subject.studyGuide[unitId][subtopicId]) {
        return subject.studyGuide[unitId][subtopicId]
      }
    } catch (e) {
      console.error("Error getting English study guide:", e)
    }

    return language === "fr"
      ? "Aucun guide d'étude disponible pour ce sous-sujet."
      : "No study guide available for this subtopic."
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, getStudyGuide, translateSubtopic }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}

// Translations object
const translations = {
  en: {
    // General
    app_title: "IB Subject To-Do Tracker",
    home: "Home",
    upcoming_tasks: "Upcoming Tasks",
    no_upcoming_tasks: "No upcoming tasks",
    show_copyright: "Show Copyright",
    hide_copyright: "Hide Copyright",
    copyright: "Copyright Zayd El Motassadeq",
    optional: "optional",
    data_loaded: "Data loaded",
    data_loaded_description: "Your tasks have been loaded from your account",
    sign_in_to_save: "Sign in to save your tasks across devices",
    or: "or",

    // Task management
    add_task: "Add a new task...",
    add_task_button: "Add Task",
    cancel: "Cancel",
    due: "Due",
    reminder: "Reminder",
    reminder_at_time: "Reminder at due time",
    reminder_15_min: "Reminder 15 min before",
    reminder_1_hour: "Reminder 1 hour before",
    reminder_1_day: "Reminder 1 day before",
    enable_notifications: "Enable Notifications",
    notifications_prompt: "Enable notifications to set reminders for your tasks.",
    task_due: "Task Due",
    task_due_soon: "Your task for {subject} - {unit} - {subtopic} is due soon.",
    no_tasks_yet: "No tasks yet",
    complete_all: "Complete All",
    reset_all: "Reset All",

    // Time selection
    time_optional: "Time (optional)",
    select_common_time: "Or select a common time:",
    select_time: "Select a time",

    // Study guide
    study_guide: "Study Guide",
    no_study_guide: "No study guide available for this subtopic.",

    // Language
    language: "Language",
    english: "English",
    french: "French",

    // Authentication
    sign_in: "Sign In",
    sign_up: "Sign Up",
    sign_out: "Sign Out",
    email: "Email",
    password: "Password",
    confirm_password: "Confirm Password",
    forgot_password: "Forgot Password?",
    create_account: "Create Account",
    already_have_account: "Already have an account?",
    dont_have_account: "Don't have an account?",
    sign_in_with_google: "Sign in with Google",
    sign_in_with_github: "Sign in with GitHub",
    sign_in_success: "Signed in successfully!",
    sign_up_success: "Account created successfully!",
    sign_out_success: "Signed out successfully!",
    auth_error: "Authentication error",
    passwords_dont_match: "Passwords don't match",

    // Subjects
    "math-aa-sl": "Math AA SL",
    "physics-sl": "Physics SL",
    "chemistry-sl": "Chemistry SL",
    "geography-hl": "Geography HL",
  },
  fr: {
    // General
    app_title: "Suivi des Tâches des Matières IB",
    home: "Accueil",
    upcoming_tasks: "Tâches à Venir",
    no_upcoming_tasks: "Aucune tâche à venir",
    show_copyright: "Afficher le Copyright",
    hide_copyright: "Masquer le Copyright",
    copyright: "Copyright Zayd El Motassadeq",
    optional: "optionnel",
    data_loaded: "Données chargées",
    data_loaded_description: "Vos tâches ont été chargées depuis votre compte",
    sign_in_to_save: "Connectez-vous pour sauvegarder vos tâches sur tous vos appareils",
    or: "ou",

    // Task management
    add_task: "Ajouter une nouvelle tâche...",
    add_task_button: "Ajouter une Tâche",
    cancel: "Annuler",
    due: "Échéance",
    reminder: "Rappel",
    reminder_at_time: "Rappel à l'heure d'échéance",
    reminder_15_min: "Rappel 15 min avant",
    reminder_1_hour: "Rappel 1 heure avant",
    reminder_1_day: "Rappel 1 jour avant",
    enable_notifications: "Activer les Notifications",
    notifications_prompt: "Activez les notifications pour définir des rappels pour vos tâches.",
    task_due: "Tâche à Échéance",
    task_due_soon: "Votre tâche pour {subject} - {unit} - {subtopic} arrive bientôt à échéance.",
    no_tasks_yet: "Aucune tâche pour le moment",
    complete_all: "Tout Compléter",
    reset_all: "Tout Réinitialiser",

    // Time selection
    time_optional: "Heure (optionnel)",
    select_common_time: "Ou sélectionnez une heure commune :",
    select_time: "Sélectionnez une heure",

    // Study guide
    study_guide: "Guide d'Étude",
    no_study_guide: "Aucun guide d'étude disponible pour ce sous-sujet.",

    // Language
    language: "Langue",
    english: "Anglais",
    french: "Français",

    // Authentication
    sign_in: "Se Connecter",
    sign_up: "S'inscrire",
    sign_out: "Se Déconnecter",
    email: "Email",
    password: "Mot de passe",
    confirm_password: "Confirmer le mot de passe",
    forgot_password: "Mot de passe oublié ?",
    create_account: "Créer un compte",
    already_have_account: "Vous avez déjà un compte ?",
    dont_have_account: "Vous n'avez pas de compte ?",
    sign_in_with_google: "Se connecter avec Google",
    sign_in_with_github: "Se connecter avec GitHub",
    sign_in_success: "Connexion réussie !",
    sign_up_success: "Compte créé avec succès !",
    sign_out_success: "Déconnexion réussie !",
    auth_error: "Erreur d'authentification",
    passwords_dont_match: "Les mots de passe ne correspondent pas",

    // Subjects
    "math-aa-sl": "Maths AA SL",
    "physics-sl": "Physique SL",
    "chemistry-sl": "Chimie SL",
    "geography-hl": "Géographie HL",

    // Math units
    "1. Number & Algebra": "1. Nombres et Algèbre",
    "2. Functions": "2. Fonctions",
    "3. Geometry & Trigonometry": "3. Géométrie et Trigonométrie",
    "4. Statistics & Probability": "4. Statistiques et Probabilités",
    "5. Calculus": "5. Calcul Différentiel et Intégral",

    // Physics units
    "A. Space, Time & Motion": "A. Espace, Temps et Mouvement",
    "B. The Particulate Nature of Matter": "B. La Nature Particulaire de la Matière",
    "C. Wave Behaviour": "C. Comportement des Ondes",
    "D. Fields": "D. Champs",
    "E. Nuclear & Quantum Physics": "E. Physique Nucléaire et Quantique",
    "Experimental Programme": "Programme Expérimental",

    // Chemistry units
    "Structure 1: Particulate Nature of Matter": "Structure 1: Nature Particulaire de la Matière",
    "Structure 2: Bonding & Structure": "Structure 2: Liaison et Structure",
    "Structure 3: Classification of Matter": "Structure 3: Classification de la Matière",
    "Reactivity 1: What Drives Reactions?": "Réactivité 1: Qu'est-ce qui Motive les Réactions?",
    "Reactivity 2: How Much, How Fast & How Far?": "Réactivité 2: Combien, à Quelle Vitesse et Jusqu'où?",
    "Reactivity 3: Mechanisms of Chemical Change": "Réactivité 3: Mécanismes du Changement Chimique",

    // Geography units
    "Core Theme: Global Change": "Thème Principal: Changement Global",
    "Options (HL choose 3)": "Options (HL choisir 3)",
    "HL Extension: Global Interactions": "Extension HL: Interactions Globales",
    "Internal Assessment: Fieldwork": "Évaluation Interne: Travail de Terrain",

    // Common subtopic terms
    "Practical Work": "Travail Pratique",
    "Collaborative Sciences Project": "Projet Collaboratif en Sciences",
    "Scientific Investigation": "Investigation Scientifique",

    // Time selections
    "09:00 AM": "09:00",
    "12:00 PM": "12:00",
    "03:00 PM": "15:00",
    "06:00 PM": "18:00",
    "09:00 PM": "21:00",
  },
}
