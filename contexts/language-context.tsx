"use client"

import { createContext, useContext, useState } from "react"
import { useEffect, type ReactNode } from "react"
import { frenchStudyGuides } from "@/lib/translations"
import { subtopicTranslations } from "@/lib/subtopic-translations"

type Language = "en" | "fr" | "es" | "de" | "zh"

interface LanguageContextType {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: string) => string
  getStudyGuide: (subjectId: string, unitId: string, subtopicId: string) => string
  translateSubtopic: (subtopicName: string) => string
}

// Create a context with a default value
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

// Simple translations for basic UI elements
const translations: Record<Language, Record<string, string>> = {
  en: {
    "app.title": "IB Class Tracker",
    "app.description": "Track your IB classes, assignments, and progress",
    "nav.dashboard": "Dashboard",
    "nav.tasks": "Tasks",
    "nav.calendar": "Calendar",
    "nav.chat": "IB Assistant",
    "nav.settings": "Settings",
    "auth.login": "Login",
    "auth.signup": "Sign Up",
    "auth.logout": "Logout",
    // General
    appTitle: "IB Subject To-Do Tracker",
    home: "Home",
    upcomingTasks: "Upcoming Tasks",
    noUpcomingTasks: "No upcoming tasks",
    showCopyright: "Show Copyright",
    hideCopyright: "Hide Copyright",
    copyright: "Copyright Zayd El Motassadeq",
    optional: "optional",
    dataLoaded: "Data loaded",
    dataLoadedDescription: "Your tasks have been loaded from your account",
    signInToSave: "Sign in to save your tasks across devices",
    or: "or",
    more: "more",

    // Task management
    addTask: "Add a new task...",
    addTaskButton: "Add Task",
    cancel: "Cancel",
    due: "Due",
    reminder: "Reminder",
    reminderAtTime: "Reminder at due time",
    reminder15Min: "Reminder 15 min before",
    reminder1Hour: "Reminder 1 hour before",
    reminder1Day: "Reminder 1 day before",
    enableNotifications: "Enable Notifications",
    notificationsPrompt: "Enable notifications to set reminders for your tasks.",
    taskDue: "Task Due",
    taskDueSoon: "Your task for {subject} - {unit} - {subtopic} is due soon.",
    noTasksYet: "No tasks yet",
    completeAll: "Complete All",
    resetAll: "Reset All",

    // Calendar view
    calendarView: "Calendar View",
    listView: "List View",
    addTaskFor: "Add Task for",
    taskDescription: "Task Description",
    enterTaskDescription: "Enter task description",
    subject: "Subject",
    selectSubject: "Select Subject",
    unit: "Unit",
    selectUnit: "Select Unit",
    subtopic: "Subtopic",
    selectSubtopic: "Select Subtopic",

    // Time selection
    timeOptional: "Time (optional)",
    selectCommonTime: "Or select a common time:",
    selectTime: "Select a time",

    // Study guide
    studyGuide: "Study Guide",
    noStudyGuide: "No study guide available for this subtopic.",

    // Language
    language: "Language",
    english: "English",
    french: "French",

    // Authentication
    signIn: "Sign In",
    signUp: "Sign Up",
    signOut: "Sign Out",
    email: "Email",
    password: "Password",
    confirmPassword: "Confirm Password",
    forgotPassword: "Forgot Password?",
    createAccount: "Create Account",
    alreadyHaveAccount: "Already have an account?",
    dontHaveAccount: "Don't have an account?",
    signInWithGoogle: "Sign in with Google",
    signInWithGithub: "Sign in with GitHub",
    signInSuccess: "Signed in successfully!",
    signUpSuccess: "Account created successfully!",
    signOutSuccess: "Signed out successfully!",
    authError: "Authentication error",
    passwordsDontMatch: "Passwords don't match",
    loading: "Loading...",
    resetPassword: "Reset Password",
    resetPasswordDescription: "Enter your email address and we'll send you a link to reset your password.",
    sendResetLink: "Send Reset Link",
    sending: "Sending...",
    resetEmailSent: "Reset email sent",
    resetEmailSentDescription: "Check your email for a link to reset your password.",
    resetError: "Error resetting password",
    backToLogin: "Back to Login",
    setNewPassword: "Set New Password",
    setNewPasswordDescription: "Enter your new password below.",
    newPassword: "New Password",
    confirmNewPassword: "Confirm New Password",
    updatePassword: "Update Password",
    updating: "Updating...",
    passwordUpdatedSuccessfully: "Password updated successfully!",

    // AI Chat
    aiAssistant: "AI Assistant",
    aiWelcomeMessage: "Hello! I'm your IB study assistant. How can I help you today?",
    aiThinking: "Thinking...",
    typeMessage: "Type a message...",
    fileUploaded: "File uploaded: {filename}",
    fileReceivedResponse: "I've received your file. How can I help you with it?",
    aiErrorResponse: "I'm sorry, I couldn't process your request. Please try again.",
    aiGreetingResponse: "Hello! How can I assist you with your IB studies today?",
    aiHelpResponse:
      "I can help with homework questions, explain concepts, provide study tips, or assist with organizing your tasks. Just let me know what you need!",
    aiMathResponse:
      "I'd be happy to help with your math problem. Could you provide more details or share a specific question?",
    aiEssayResponse:
      "For essay writing, I can help with structure, thesis development, and providing feedback. What specific aspect are you working on?",
    aiDefaultResponse:
      "I'm here to help with your IB studies. Could you provide more details about what you need assistance with?",

    // Subjects
    "math-aa-sl": "Math AA SL",
    "physics-sl": "Physics SL",
    "chemistry-sl": "Chemistry SL",
    "geography-hl": "Geography HL",

    createNewTaskDescription: "Fill in the details below to create a new task.",
    startTime: "Start Time",
    endTime: "End Time",
    dataSynced: "Data synced",
    dataSyncedDescription: "Your data has been synced with the server",
    syncError: "Sync error",
    syncErrorDescription: "There was an error syncing your data",
    syncData: "Sync data",
  },
  fr: {
    "app.title": "Suivi de Classe IB",
    "app.description": "Suivez vos cours IB, devoirs et progrès",
    "nav.dashboard": "Tableau de bord",
    "nav.tasks": "Tâches",
    "nav.calendar": "Calendrier",
    "nav.chat": "Assistant IB",
    "nav.settings": "Paramètres",
    "auth.login": "Connexion",
    "auth.signup": "S'inscrire",
    "auth.logout": "Déconnexion",
    // General
    appTitle: "Suivi des Tâches des Matières IB",
    home: "Accueil",
    upcomingTasks: "Tâches à Venir",
    noUpcomingTasks: "Aucune tâche à venir",
    showCopyright: "Afficher le Copyright",
    hideCopyright: "Masquer le Copyright",
    copyright: "Copyright Zayd El Motassadeq",
    optional: "optionnel",
    dataLoaded: "Données chargées",
    dataLoadedDescription: "Vos tâches ont été chargées depuis votre compte",
    signInToSave: "Connectez-vous pour sauvegarder vos tâches sur tous vos appareils",
    or: "ou",
    more: "plus",

    // Task management
    addTask: "Ajouter une nouvelle tâche...",
    addTaskButton: "Ajouter une Tâche",
    cancel: "Annuler",
    due: "Échéance",
    reminder: "Rappel",
    reminderAtTime: "Rappel à l'heure d'échéance",
    reminder15Min: "Rappel 15 min avant",
    reminder1Hour: "Rappel 1 heure avant",
    reminder1Day: "Rappel 1 jour avant",
    enableNotifications: "Activer les Notifications",
    notificationsPrompt: "Activez les notifications pour définir des rappels pour vos tâches.",
    taskDue: "Tâche à Échéance",
    taskDueSoon: "Votre tâche pour {subject} - {unit} - {subtopic} arrive bientôt à échéance.",
    noTasksYet: "Aucune tâche pour le moment",
    completeAll: "Tout Compléter",
    resetAll: "Tout Réinitialiser",

    // Calendar view
    calendarView: "Vue Calendrier",
    listView: "Vue Liste",
    addTaskFor: "Ajouter une Tâche pour",
    taskDescription: "Description de la Tâche",
    enterTaskDescription: "Entrez la description de la tâche",
    subject: "Matière",
    selectSubject: "Sélectionner une Matière",
    unit: "Unité",
    selectUnit: "Sélectionner une Unité",
    subtopic: "Sous-sujet",
    selectSubtopic: "Sélectionner un Sous-sujet",

    // Time selection
    timeOptional: "Heure (optionnel)",
    selectCommonTime: "Ou sélectionnez une heure commune :",
    selectTime: "Sélectionnez une heure",

    // Study guide
    studyGuide: "Guide d'Étude",
    noStudyGuide: "Aucun guide d'étude disponible pour ce sous-sujet.",

    // Language
    language: "Langue",
    english: "Anglais",
    french: "Français",

    // Authentication
    signIn: "Se Connecter",
    signUp: "S'inscrire",
    signOut: "Se Déconnecter",
    email: "Email",
    password: "Mot de passe",
    confirmPassword: "Confirmer le mot de passe",
    forgotPassword: "Mot de passe oublié ?",
    createAccount: "Créer un compte",
    alreadyHaveAccount: "Vous avez déjà un compte ?",
    dontHaveAccount: "Vous n'avez pas de compte ?",
    signInWithGoogle: "Se connecter avec Google",
    signInWithGithub: "Se connecter avec GitHub",
    signInSuccess: "Connexion réussie !",
    signUpSuccess: "Compte créé avec succès !",
    signOutSuccess: "Déconnexion réussie !",
    authError: "Erreur d'authentification",
    passwordsDontMatch: "Les mots de passe ne correspondent pas",
    loading: "Chargement...",
    resetPassword: "Réinitialiser le Mot de Passe",
    resetPasswordDescription:
      "Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.",
    sendResetLink: "Envoyer le Lien de Réinitialisation",
    sending: "Envoi en cours...",
    resetEmailSent: "Email de réinitialisation envoyé",
    resetEmailSentDescription: "Vérifiez votre email pour un lien de réinitialisation de mot de passe.",
    resetError: "Erreur lors de la réinitialisation du mot de passe",
    backToLogin: "Retour à la Connexion",
    setNewPassword: "Définir un Nouveau Mot de Passe",
    setNewPasswordDescription: "Entrez votre nouveau mot de passe ci-dessous.",
    newPassword: "Nouveau Mot de Passe",
    confirmNewPassword: "Confirmer le Nouveau Mot de Passe",
    updatePassword: "Mettre à Jour le Mot de Passe",
    updating: "Mise à jour...",
    passwordUpdatedSuccessfully: "Mot de passe mis à jour avec succès !",

    // AI Chat
    aiAssistant: "Assistant IA",
    aiWelcomeMessage: "Bonjour ! Je suis votre assistant d'études IB. Comment puis-je vous aider aujourd'hui ?",
    aiThinking: "Réflexion en cours...",
    typeMessage: "Tapez un message...",
    fileUploaded: "Fichier téléchargé : {filename}",
    fileReceivedResponse: "J'ai reçu votre fichier. Comment puis-je vous aider avec celui-ci ?",
    aiErrorResponse: "Je suis désolé, je n'ai pas pu traiter votre demande. Veuillez réessayer.",
    aiGreetingResponse: "Bonjour ! Comment puis-je vous aider avec vos études IB aujourd'hui ?",
    aiHelpResponse:
      "Je peux vous aider avec vos devoirs, expliquer des concepts, fournir des conseils d'étude ou vous aider à organiser vos tâches. Dites-moi simplement ce dont vous avez besoin !",
    aiMathResponse:
      "Je serais ravi de vous aider avec votre problème de mathématiques. Pourriez-vous fournir plus de détails ou partager une question spécifique ?",
    aiEssayResponse:
      "Pour la rédaction d'essais, je peux vous aider avec la structure, le développement de la thèse et fournir des commentaires. Sur quel aspect travaillez-vous ?",
    aiDefaultResponse:
      "Je suis là pour vous aider avec vos études IB. Pourriez-vous fournir plus de détails sur ce dont vous avez besoin ?",

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

    createNewTaskDescription: "Remplissez les détails ci-dessous pour créer une nouvelle tâche.",
    startTime: "Heure de début",
    endTime: "Heure de fin",
    dataSynced: "Données synchronisées",
    dataSyncedDescription: "Vos données ont été synchronisées avec le serveur",
    syncError: "Erreur de synchronisation",
    syncErrorDescription: "Une erreur est survenue lors de la synchronisation de vos données",
    syncData: "Synchroniser les données",
  },
  es: {
    "app.title": "Seguimiento de Clases IB",
    "app.description": "Sigue tus clases IB, tareas y progreso",
    "nav.dashboard": "Panel",
    "nav.tasks": "Tareas",
    "nav.calendar": "Calendario",
    "nav.chat": "Asistente IB",
    "nav.settings": "Configuración",
    "auth.login": "Iniciar sesión",
    "auth.signup": "Registrarse",
    "auth.logout": "Cerrar sesión",
  },
  de: {
    "app.title": "IB-Klassen-Tracker",
    "app.description": "Verfolgen Sie Ihre IB-Kurse, Aufgaben und Fortschritte",
    "nav.dashboard": "Dashboard",
    "nav.tasks": "Aufgaben",
    "nav.calendar": "Kalender",
    "nav.chat": "IB-Assistent",
    "nav.settings": "Einstellungen",
    "auth.login": "Anmelden",
    "auth.signup": "Registrieren",
    "auth.logout": "Abmelden",
  },
  zh: {
    "app.title": "IB课程跟踪器",
    "app.description": "跟踪您的IB课程、作业和进度",
    "nav.dashboard": "仪表板",
    "nav.tasks": "任务",
    "nav.calendar": "日历",
    "nav.chat": "IB助手",
    "nav.settings": "设置",
    "auth.login": "登录",
    "auth.signup": "注册",
    "auth.logout": "登出",
  },
}
