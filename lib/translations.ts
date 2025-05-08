"use client"

// This is a simplified translation service
const translations = {
  en: {
    // General
    home: "Home",
    dashboard: "Dashboard",
    calendar: "Calendar",
    pastPapers: "Past Papers",
    ibClassTracker: "IB Class Tracker",
    subjects: "Subjects",
    tasks: "Tasks",
    settings: "Settings",
    profile: "Profile",
    signOut: "Sign Out",
    signIn: "Sign In",
    signUp: "Sign Up",

    // Past Papers specific
    browsePastPapers: "Browse Past Papers",
    searchPastPapers: "Search Past Papers",
    uploadPastPaper: "Upload Past Paper",
    pastPaperSearch: "Past Paper Search",
    pastPaperDetails: "Past Paper Details",
    viewPastPaper: "View Past Paper",
    downloadPastPaper: "Download Past Paper",
    browseBySubject: "Browse by Subject",
    browseByYear: "Browse by Year",
    noPastPapersFound: "No Past Papers Found",
    noPastPapersDescription: "We couldn't find any past papers matching your criteria.",
    viewPastPapersForSubject: "View past papers for {{subject}}",
    recentPastPapers: "Recent Past Papers",
    recentlyAddedPapers: "Recently added papers",
    noPastPapersYet: "No past papers uploaded yet",
    viewAllPapers: "View All Papers",

    // Form fields
    title: "Title",
    subject: "Subject",
    subjectCode: "Subject Code",
    year: "Year",
    month: "Month",
    language: "Language",
    paperNumber: "Paper Number",
    level: "Level",
    description: "Description",
    file: "File",

    // Status and messages
    uploadSuccess: "Upload Successful",
    pastPaperUploaded: "Your past paper has been uploaded successfully",
    uploadError: "Upload Error",
    pastPaperUploadFailed: "Failed to upload past paper",
    uploading: "Uploading...",

    // Options
    may: "May",
    november: "November",
    both: "Both SL & HL",

    // Placeholders
    pastPaperTitlePlaceholder: "Enter past paper title",
    subjectPlaceholder: "Enter subject name",
    subjectCodePlaceholder: "Enter subject code (optional)",
    selectMonth: "Select month",
    selectLevel: "Select level",
    languagePlaceholder: "Enter language",
    descriptionPlaceholder: "Enter any additional information",

    // Help text
    subjectCodeDescription: "Optional subject code (e.g. MATH, PHYS)",
    fileDescription: "Upload PDF file only",
    acceptedFileTypes: "Accepted file types: PDF, DOC, DOCX",
    subjectCodeOptional: "Optional code identifier for the subject",
    monthOptional: "Optional exam session month",
    descriptionOptional: "Optional additional information",

    // Auth related
    email: "Email",
    password: "Password",
    forgotPassword: "Forgot Password?",
    resetPassword: "Reset Password",
    confirmPassword: "Confirm Password",
    passwordsDontMatch: "Passwords don't match",

    // Dashboard
    goodMorning: "Good Morning",
    goodAfternoon: "Good Afternoon",
    goodEvening: "Good Evening",
    student: "Student",
    trackYourProgress: "Track your progress and manage your tasks",
    addTask: "Add Task",
    taskProgress: "Task Progress",
    overallCompletion: "Overall completion rate",
    tasksCompleted: "tasks completed",
    viewAllTasks: "View All Tasks",
    upcomingDeadlines: "Upcoming Deadlines",
    nextSevenDays: "Due in the next 7 days",
    daysLeft: "days left",
    noUpcomingDeadlines: "No upcoming deadlines",
    viewCalendar: "View Calendar",
    upcomingTasks: "Upcoming Tasks",
    tasksToComplete: "Tasks you need to complete",
    taskSyncErrorDescription: "There was an error saving your task. Please try again.",
    taskDeleteSyncErrorDescription: "There was an error deleting your task. Please try again.",

    // Navigation
    toggleMenu: "Toggle Menu",

    // Error messages
    errorFetchingSubjects: "Error fetching subjects",
    error: "Error",
  },
  fr: {
    // General translations for French
    // ... (other French translations would go here)
  },
}

// Export the French study guides separately as it was in the original code
export const frenchStudyGuides = {
  // Math AA SL translations
  "math-unit-1": {
    "math-1-1":
      "**Notation Scientifique**\n\n" +
      "**Définition:** Écrire les nombres sous la forme *a·10ᵏ* avec 1≤|*a*|<10.\n\n" +
      "**Formules clés:**\n" +
      "- Multiplication: a·10ᵏ × b·10ᵐ = (a·b)·10ᵏ⁺ᵐ\n" +
      "- Division: a·10ᵏ ÷ b·10ᵐ = (a/b)·10ᵏ⁻ᵐ\n\n" +
      "**Question typique:** Convertir 0,00045 et 3,2×10⁵ en notation scientifique; calculer (4×10³)÷(2×10⁻²).\n\n" +
      "**Conseils:** Toujours ajuster *a* à un chiffre non nul; compter soigneusement les décalages décimaux.",
    "math-1-2":
      "**Suites et Séries Arithmétiques**\n\n" +
      "**Définition:** Suite avec une différence constante *d*.\n\n" +
      "**Formules clés:** *uₙ = u₁ + (n–1)d*; *Sₙ = n/2[2u₁ + (n–1)d]*\n\n" +
      "**Question typique:** Trouver le 15ème terme et la somme des 20 premiers termes étant donné u₁, d.\n\n" +
      "**Conseils:** Identifier u₁ et d; dessiner un tableau rapide des premiers termes.",
    "math-1-3":
      "**Suites et Séries Géométriques**\n\n" +
      "**Définition:** Suite avec un rapport constant *r*.\n\n" +
      "**Formules clés:** *uₙ = u₁·rⁿ⁻¹*; *Sₙ = u₁(1–rⁿ)/(1–r)*; infinie: *S∞=u₁/(1–r)* si |r|<1.\n\n" +
      "**Question typique:** Déterminer si une série converge; trouver S∞ quand r=½.\n\n" +
      "**Conseils:** Vérifier |r|<1 pour une somme infinie; surveiller r négatif pour les séries alternées.",
    "math-1-4":
      "**Applications Financières**\n\n" +
      "**Définition:** Croissance/décroissance de valeur au taux *i*.\n\n" +
      "**Formules clés:** *A = P(1+i)ⁿ* (composé); *A = P(1–i)ⁿ* (dépréciation)\n\n" +
      "**Question typique:** Valeur future de 1 000 € à un intérêt annuel de 5% sur 3 ans.\n\n" +
      "**Conseils:** Convertir % en décimal; s'assurer du signe correct pour la dépréciation.",
    "math-1-5":
      "**Lois des Exposants & Introduction aux Logarithmes**\n\n" +
      "**Définition:** Règles pour manipuler les puissances; log = exposant inverse.\n\n" +
      "**Formules clés:**\n" +
      "- aᵐ·aⁿ = aᵐ⁺ⁿ, (aᵐ)ᵖ = aᵐᵖ\n" +
      "- logₐx = y ⟺ aʸ = x\n\n" +
      "**Question typique:** Résoudre 2ˣ = 8; résoudre 3ˣ = 20 en utilisant les logarithmes.\n\n" +
      "**Conseils:** Mémoriser les lois des exposants; utiliser le changement de base pour les logarithmes non familiers.",
    "math-1-6":
      "**Preuve Déductive Simple**\n\n" +
      "**Définition:** Argument logique utilisant des axiomes/théorèmes.\n\n" +
      "**Méthodes clés:** Preuve directe, preuve par contradiction.\n\n" +
      "**Question typique:** Prouver que la somme des n premiers entiers = n(n+1)/2.\n\n" +
      "**Conseils:** Exposer clairement les hypothèses et la conclusion; référencer les résultats connus.",
    "math-1-7":
      "**Exposants Rationnels**\n\n" +
      "**Définition:** a^{m/n} = ⁿ√(aᵐ).\n\n" +
      "**Formules clés:**\n" +
      "- a^{1/n} = ⁿ√a; a^{m/n} = (ⁿ√a)ᵐ\n\n" +
      "**Question typique:** Simplifier 27^{2/3}.\n\n" +
      "**Conseils:** Convertir les racines en forme fractionnaire; garder trace de la racine principale.",
    "math-1-8":
      "**Séries Convergentes Infinies**\n\n" +
      "**Définition:** Série géométrique avec |r|<1.\n\n" +
      "**Formule clé:** *S∞=u₁/(1–r)*\n\n" +
      "**Question typique:** Si u₁=5 et r=¼, trouver la somme à l'infini.\n\n" +
      "**Conseils:** Toujours vérifier |r|<1 ou la série diverge.",
    "math-1-9":
      "**Théorème du Binôme**\n\n" +
      "**Définition:** Développement de (a+b)ⁿ.\n\n" +
      "**Formule clé:** (a+b)ⁿ = Σ_{k=0}ⁿ C(n,k) aⁿ⁻ᵏ bᵏ\n\n" +
      "**Question typique:** Trouver le terme en x² dans (2+3x)⁵.\n\n" +
      "**Conseils:** Utiliser le triangle de Pascal pour les coefficients; vérifier la plage d'index k.",
  },
  "math-unit-2": {
    "math-2-1":
      "**Équations Linéaires**\n\n" +
      "**Définition:** y=mx+b, point-pente, forme générale.\n\n" +
      "**Concepts clés:** pente m, intersections, conditions parallèles/perpendiculaires.\n\n" +
      "**Question typique:** Trouver l'équation passant par (2,3) avec une pente de –½.\n\n" +
      "**Conseils:** Toujours identifier deux points ou la pente et l'intersection d'abord.",
    "math-2-2":
      "**Notation de Fonction & Domaine/Image**\n\n" +
      "**Définition:** f: X→Y correspondance; domaine = entrées autorisées, image = sorties.\n\n" +
      "**Concepts clés:** un-à-un, sur; restrictions (dénominateur≠0).\n\n" +
      "**Question typique:** Déterminer le domaine de f(x)=√(x–2)/(x–5).\n\n" +
      "**Conseils:** Exclure x qui rend le dénominateur nul ou le radicande négatif.",
    "math-2-3":
      "**Graphiques & Esquisses**\n\n" +
      "**Définition:** Représentation visuelle de y=f(x).\n\n" +
      "**Concepts clés:** intersections, comportement asymptotique, symétrie.\n\n" +
      "**Question typique:** Esquisser y=x³–3x.\n\n" +
      "**Conseils:** Tracer les zéros et les points de retournement; noter le comportement pair/impair.",
    "math-2-4":
      "**Caractéristiques Clés**\n\n" +
      "**Définition:** extrema, intersections, asymptotes.\n\n" +
      "**Concepts clés:** f′(x)=0 pour maxima/minima; limites pour asymptotes.\n\n" +
      "**Question typique:** Identifier les asymptotes verticales/horizontales de f(x)=(2x²–1)/(x–1).\n\n" +
      "**Conseils:** Utiliser la limite x→±∞ pour l'horizontale; factoriser pour la verticale.",
    "math-2-5":
      "**Fonctions Composées & Inverses**\n\n" +
      "**Définition:** (f∘g)(x)=f(g(x)); f⁻¹ défait f.\n\n" +
      "**Concepts clés:** Les domaines rétrécissent dans la composition; échanger x,y pour trouver l'inverse.\n\n" +
      "**Question typique:** Étant donné f(x)=2x+3, trouver f⁻¹(x).\n\n" +
      "**Conseils:** Toujours vérifier f(f⁻¹(x))=x pour confirmer.",
    "math-2-6":
      "**Fonctions Quadratiques**\n\n" +
      "**Définition:** ax²+bx+c; forme du sommet.\n\n" +
      "**Concepts clés:** sommet à (–b/2a, f(–b/2a)); discriminant b²–4ac.\n\n" +
      "**Question typique:** Écrire x²+4x+1 sous forme du sommet.\n\n" +
      "**Conseils:** Compléter le carré soigneusement.",
    "math-2-7":
      "**Résolution de Quadratiques & Inégalités**\n\n" +
      "**Définition:** Racines via formule/factorisation; inégalités par tableau de signes.\n\n" +
      "**Formule clé:** x=[–b±√(b²–4ac)]/2a.\n\n" +
      "**Question typique:** Résoudre x²–5x+6>0.\n\n" +
      "**Conseils:** Trouver les racines, tester les intervalles pour le signe.",
    "math-2-8":
      "**Fonctions Réciproques & Rationnelles**\n\n" +
      "**Définition:** f(x)=1/x ou rapport de polynômes.\n\n" +
      "**Concepts clés:** trous vs asymptotes; restrictions de domaine.\n\n" +
      "**Question typique:** Esquisser y=(x²–1)/(x–1).\n\n" +
      "**Conseils:** Factoriser le numérateur pour révéler le trou à x=1.",
    "math-2-9":
      "**Fonctions Exponentielles & Logarithmiques**\n\n" +
      "**Définition:** f(x)=aˣ; f(x)=logₐx.\n\n" +
      "**Formules clés:** d/dx aˣ = aˣ ln a; lois des logarithmes.\n\n" +
      "**Question typique:** Résoudre 5ˣ=125.\n\n" +
      "**Conseils:** Réécrire 125=5³ ou utiliser les logarithmes.",
    "math-2-10":
      "**Résolution d'Équations**\n\n" +
      "**Définition:** Trouver x tel que f(x)=g(x).\n\n" +
      "**Concepts clés:** isolation algébrique; intersections de graphiques.\n\n" +
      "**Question typique:** Résoudre eˣ = x+2 graphiquement.\n\n" +
      "**Conseils:** Vérifier les racines extrinsèques dues à l'élévation au carré/pertinence du domaine.",
    "math-2-11":
      "**Transformations**\n\n" +
      "**Définition:** Translations: f(x–h)+k; étirements: a·f(x); réflexions f(–x).\n\n" +
      "**Concepts clés:** L'ordre compte (horiz avant vert).\n\n" +
      "**Question typique:** Esquisser y=–2·f(x+3)+1 étant donné le graphique de base.\n\n" +
      "**Conseils:** Travailler une transformation à la fois.",
  },
  "math-unit-3": {
    "math-3-1":
      "**Diagrammes Étiquetés & Mesure d'Angle**\n\n" +
      "**Définition:** Diagrammes précis avec longueurs/angles marqués.\n\n" +
      "**Concepts clés:** notation ∠, relations supplémentaires/complémentaires.\n\n" +
      "**Question typique:** Étiqueter le triangle ABC, montrer le théorème de l'angle externe.\n\n" +
      "**Conseils:** Redessiner proprement si l'original est désordonné.",
    "math-3-2":
      "**Équations de Droites; Rapports Trigonométriques Exacts**\n\n" +
      "**Définition:** y–y₁=m(x–x₁); sin 30°=½, cos 45°=√2/2 etc.\n\n" +
      "**Concepts clés:** Valeurs pour 0°,30°,45°,60°,90°.\n\n" +
      "**Question typique:** Trouver la perpendiculaire passant par un point donné.\n\n" +
      "**Conseils:** Mémoriser le tableau des rapports; garder les racines exactes.",
    "math-3-3":
      "**Lois du Sinus & du Cosinus**\n\n" +
      "**Définition:**\n" +
      "- Sinus: a/sin A = b/sin B = c/sin C\n" +
      "- Cosinus: c² = a² + b² – 2ab cos C\n\n" +
      "**Question typique:** Résoudre un triangle avec deux côtés donnés et l'angle inclus.\n\n" +
      "**Conseils:** Attention au cas ambigu (SSA) pour 2 solutions possibles.",
    "math-3-4":
      "**Résolution d'Équations Trigonométriques**\n\n" +
      "**Définition:** Trouver x tel que f(x)=0 sur un intervalle.\n\n" +
      "**Concepts clés:** Utiliser les identités (sin²+cos²=1).\n\n" +
      "**Question typique:** Résoudre 2 sin x = 1 pour x∈[0,2π].\n\n" +
      "**Conseils:** Esquisser le cercle unitaire pour localiser toutes les solutions.",
    "math-3-5":
      "**Fonctions Trigonométriques Inverses**\n\n" +
      "**Définition:** arcsin, arccos, arctan avec plages principales.\n\n" +
      "**Concepts clés:** arcsin∈[–π/2,π/2], arccos∈[0,π].\n\n" +
      "**Question typique:** Évaluer arccos(–½).\n\n" +
      "**Conseils:** Toujours indiquer l'angle dans le quadrant correct.",
  },
  "math-unit-4": {
    "math-4-1":
      "**Statistiques Descriptives**\n\n" +
      "**Définition:** Mesures de centre et de dispersion.\n\n" +
      "**Formules clés:** moyenne, médiane, mode, variance σ² = Σ(x–μ)²/n.\n\n" +
      "**Question typique:** Calculer la moyenne et l'écart-type pour un ensemble de données.\n\n" +
      "**Conseils:** Utiliser la technologie mais connaître les étapes manuelles.",
    "math-4-2":
      "**Représentation des Données**\n\n" +
      "**Définition:** Histogrammes, boîtes à moustaches, nuages de points.\n\n" +
      "**Concepts clés:** Identifier l'asymétrie, les quartiles, les valeurs aberrantes.\n\n" +
      "**Question typique:** Interpréter une boîte à moustaches pour l'asymétrie.\n\n" +
      "**Conseils:** Étiqueter clairement les axes et les classes.",
    "math-4-3":
      "**Bases de Probabilité**\n\n" +
      "**Définition:** P(A), espaces échantillonnaux, probabilité conditionnelle.\n\n" +
      "**Formule clé:** P(A∪B)=P(A)+P(B)–P(A∩B).\n\n" +
      "**Question typique:** Calculer P(deux faces) dans trois lancers de pièce.\n\n" +
      "**Conseils:** Dessiner un arbre ou un diagramme de Venn pour organiser.",
    "math-4-4":
      "**Distributions**\n\n" +
      "**Définition:** Binomiale (n,p); Normale (μ,σ).\n\n" +
      "**Formules clés:** P(X=k)=C(n,k)pᵏ(1–p)ⁿ⁻ᵏ; z=(x–μ)/σ.\n\n" +
      "**Question typique:** Utiliser la table normale pour trouver P(X>1,5).\n\n" +
      "**Conseils:** Vérifier si l'approximation normale à la binomiale est valide (np>5).",
    "math-4-5":
      "**Analyse Bivariée**\n\n" +
      "**Définition:** Corrélation et régression.\n\n" +
      "**Formules clés:**\n" +
      "- r = Σ(xᵢ–x̄)(yᵢ–ȳ)/[√Σ(xᵢ–x̄)² √Σ(yᵢ–ȳ)²]\n" +
      "- ŷ = a + b x (droite des moindres carrés)\n\n" +
      "**Question typique:** Interpréter r=–0,85 pour des données de taille vs poids.\n\n" +
      "**Conseils:** Tracer d'abord le nuage de points; surveiller les valeurs aberrantes.",
  },
  "math-unit-5": {
    "math-5-1":
      "**Limites et Continuité**\n\n" +
      "**Définition:** limₓ→a f(x); pas de ruptures/sauts.\n\n" +
      "**Concepts clés:** Factoriser/rationaliser pour éliminer 0/0.\n\n" +
      "**Question typique:** Évaluer limₓ→3 (x²–9)/(x–3).\n\n" +
      "**Conseils:** Si la substitution donne ∞/∞, utiliser la règle de L'Hôpital si autorisé.",
    "math-5-2":
      "**Dérivées**\n\n" +
      "**Définition:** f′(x)=lim_{h→0}[f(x+h)–f(x)]/h.\n\n" +
      "**Concepts clés:** Notations f′, dy/dx.\n\n" +
      "**Question typique:** Trouver la dérivée de x³ à partir de la définition.\n\n" +
      "**Conseils:** Pratiquer quelques-unes à la main pour voir le modèle.",
    "math-5-3":
      "**Techniques de Différentiation**\n\n" +
      "**Définition:** Règles de puissance, produit, quotient, chaîne.\n\n" +
      "**Formules clés:**\n" +
      "- (uv)′=u′v+uv′, (u/v)′=(u′v–uv′)/v²\n\n" +
      "- d/dx f(g(x))=f′(g(x))·g′(x)\n\n" +
      "**Question typique:** Différencier x² eˣ.\n\n" +
      "**Conseils:** Étiqueter clairement u et v; vérifier chaque terme.",
    "math-5-4":
      "**Tangentes et Normales**\n\n" +
      "**Définition:** Droites avec pente f′(x₀) et –1/f′(x₀).\n\n" +
      "**Formule clé:** y–y₀ = m(x–x₀).\n\n" +
      "**Question typique:** Équation de la normale en (2,f(2)).\n\n" +
      "**Conseils:** Calculer d'abord la dérivée, puis substituer le point.",
    "math-5-5":
      "**Applications de la Différentiation**\n\n" +
      "**Définition:** Extrema, taux de variation, optimisation.\n\n" +
      "**Concepts clés:** f′=0 → points critiques; test de la dérivée seconde.\n\n" +
      "**Question typique:** Maximiser l'aire étant donné une contrainte de périmètre.\n\n" +
      "**Conseils:** Toujours vérifier les extrémités dans un intervalle fermé.",
    "math-5-6":
      "**Intégrales Définies et Aire**\n\n" +
      "**Définition:** ∫_a^b f(x)dx = aire nette.\n\n" +
      "**Formule clé:** ∫ xⁿdx = xⁿ⁺¹/(n+1) + C.\n\n" +
      "**Question typique:** Aire entre y=x² et l'axe des x de 0 à 3.\n\n" +
      "**Conseils:** Dessiner la région; identifier les fonctions supérieure-moins-inférieure.",
    "math-5-7":
      "**Intégration (Substitution)**\n\n" +
      "**Définition:** Règle de chaîne inversée.\n\n" +
      "**Concepts clés:** Soit u=intérieur; dx=du/(du/dx).\n\n" +
      "**Question typique:** ∫2x(1+x²)³dx.\n\n" +
      "**Conseils:** Toujours convertir complètement dx en du.",
    "math-5-8":
      "**Applications de l'Intégration**\n\n" +
      "**Définition:** Volumes de révolution, cinématique.\n\n" +
      "**Formule clé:** V=π∫[f(x)]²dx (rondelles).\n\n" +
      "**Question typique:** Volume généré par y=√x autour de l'axe des x.\n\n" +
      "**Conseils:** Esquisser les sections transversales pour choisir la méthode correcte.",
    "math-5-9":
      "**Équations Différentielles**\n\n" +
      "**Définition:** dy/dx = ky résout la croissance/décroissance exponentielle.\n\n" +
      "**Formule clé:** y=Ce^{kx}.\n\n" +
      "**Question typique:** Résoudre dy/dx=3y, y(0)=2.\n\n" +
      "**Conseils:** Séparer les variables; intégrer chaque côté.",
    "math-5-10":
      "**Technologie et Méthodes Numériques**\n\n" +
      "**Définition:** Méthodes calculatrice/application: Newton–Raphson, règle trapézoïdale.\n\n" +
      "**Formule clé:** Newton: xₙ₊₁ = xₙ – f(xₙ)/f′(xₙ).\n\n" +
      "**Question typique:** Approximer la racine de x³–2x–5=0.\n\n" +
      "**Conseils:** Utiliser une bonne estimation initiale; vérifier la convergence.",
  },
  // Physics SL translations
  "physics-unit-a": {
    "physics-a1":
      "**Cinématique**\n\n" +
      "**Définition:** Étude du mouvement sans considérer ses causes.\n\n" +
      "**Formules clés:** v=v₀+at; s=v₀t+½at²; v²=v₀²+2as\n\n" +
      "**Question typique:** Calculer le temps d'arrêt étant donné v₀ et a.\n\n" +
      "**Conseils:** Toujours définir la direction positive; esquisser le mouvement.",
    "physics-a2":
      "**Forces et Quantité de Mouvement**\n\n" +
      "**Définition:** Comment les forces changent le mouvement.\n\n" +
      "**Formules clés:** F=ma; p=mv; impulsion Δp=FΔt\n\n" +
      "**Question typique:** Impulsion nécessaire pour arrêter une masse m.\n\n" +
      "**Conseils:** Conserver la quantité de mouvement dans les collisions; séparer élastique/inélastique.",
    "physics-a3":
      "**Travail, Énergie et Puissance**\n\n" +
      "**Définition:** Transfert d'énergie.\n\n" +
      "**Formules clés:** W=F·s·cosθ; EC=½mv²; P=W/t\n\n" +
      "**Question typique:** Travail effectué en soulevant une masse m d'une hauteur h.\n\n" +
      "**Conseils:** Utiliser la conservation de l'énergie pour éviter les forces complexes.",
  },
  "physics-unit-b": {
    "physics-b1":
      "**Transferts d'Énergie Thermique**\n\n" +
      "**Définition:** Mécanismes de transfert de chaleur.\n\n" +
      "**Formules clés:** Q=mcΔT; loi de conduction Q/t = kAΔT/ℓ\n\n" +
      "**Question typique:** Expliquer le chauffage de l'eau dans un calorimètre.\n\n" +
      "**Conseils:** Distinguer chaleur (Q) vs changement de température (ΔT).",
    "physics-b2":
      "**Effet de Serre**\n\n" +
      "**Définition:** Absorption IR par les gaz atmosphériques.\n\n" +
      "**Concepts clés:** Absorption/émission IR par les gaz; boucles de rétroaction.\n\n" +
      "**Question typique:** Décrire le rôle du CO₂ dans le piégeage de la chaleur.\n\n" +
      "**Conseils:** Relier les bandes spectrales aux molécules de gaz.",
    "physics-b3":
      "**Lois des Gaz**\n\n" +
      "**Définition:** Relations entre P, V, T.\n\n" +
      "**Formules clés:** PV=nRT; pVⁿ=const (adiabatique)\n\n" +
      "**Question typique:** Calculer le changement de pression dans des conditions isothermes.\n\n" +
      "**Conseils:** Utiliser la loi correcte pour le processus (isotherme vs adiabatique).",
    "physics-b5":
      "**Courant et Circuits**\n\n" +
      "**Définition:** Flux de courant électrique et analyse de circuit.\n\n" +
      "**Formules clés:** V=IR; règles série/parallèle; résistance interne: ε=IR+Ir\n\n" +
      "**Question typique:** Trouver ε et r à partir du graphique V–I.\n\n" +
      "**Conseils:** Étiqueter les polarités; appliquer Kirchhoff systématiquement.",
  },
  "physics-unit-c": {
    "physics-c1":
      "**Mouvement Harmonique Simple**\n\n" +
      "**Définition:** Oscillation avec force de rappel proportionnelle au déplacement.\n\n" +
      "**Formules clés:** a=–ω²x; T=2π√(m/k)\n\n" +
      "**Question typique:** Déterminer l'amplitude à partir de l'énergie.\n\n" +
      "**Conseils:** Utiliser la méthode énergétique pour la vitesse à un x donné.",
    "physics-c2":
      "**Modèle Ondulatoire**\n\n" +
      "**Définition:** Perturbation transférant de l'énergie sans déplacement net des particules.\n\n" +
      "**Formule clé:** v=fλ\n\n" +
      "**Question typique:** Trouver la longueur d'onde pour f donné dans un milieu.\n\n" +
      "**Conseils:** Spécifier les propriétés du milieu.",
    "physics-c3":
      "**Phénomènes Ondulatoires**\n\n" +
      "**Définition:** Comportement des ondes interagissant avec des frontières et entre elles.\n\n" +
      "**Formules clés:** Interférence: Δchemin = nλ; minima de diffraction = mλ\n\n" +
      "**Question typique:** Espacement des franges dans une double fente.\n\n" +
      "**Conseils:** Esquisser le diagramme de différence de chemin.",
    "physics-c4":
      "**Ondes Stationnaires et Résonance**\n\n" +
      "**Définition:** Motifs d'ondes stationnaires par superposition.\n\n" +
      "**Formules clés:** fn=n·v/(2L) (cordes); tuyaux: L=λ/2 ou λ/4\n\n" +
      "**Question typique:** Identifier les nœuds/ventres.\n\n" +
      "**Conseils:** Dessiner les formes de mode pour plus de clarté.",
    "physics-c5":
      "**Effet Doppler**\n\n" +
      "**Définition:** Décalage de fréquence dû au mouvement relatif.\n\n" +
      "**Formule clé:** f′=f(v±v₀)/(v∓vs)\n\n" +
      "**Question typique:** Fréquence observée d'une sirène d'ambulance.\n\n" +
      "**Conseils:** Utiliser une convention de signe cohérente.",
  },
  "physics-unit-d": {
    "physics-d1":
      "**Champs Gravitationnels**\n\n" +
      "**Définition:** Région où une masse subit une force.\n\n" +
      "**Formules clés:** g=GM/r²; U=–GMm/r\n\n" +
      "**Question typique:** Calculer la vitesse d'échappement √(2GM/r).\n\n" +
      "**Conseils:** Garder trace du potentiel négatif.",
    "physics-d2":
      "**Champs Électriques et Magnétiques**\n\n" +
      "**Définition:** Régions où les charges/courants subissent des forces.\n\n" +
      "**Formules clés:** E=kQ/r²; V=kQ/r; F=qvB sinθ\n\n" +
      "**Question typique:** Force sur une charge se déplaçant dans un champ B.\n\n" +
      "**Conseils:** Utiliser la règle de la main droite.",
    "physics-d3":
      "**Mouvement dans les Champs EM**\n\n" +
      "**Définition:** Trajectoires de particules dans des champs combinés.\n\n" +
      "**Formule clé:** r=mv/(qB) pour le mouvement circulaire\n\n" +
      "**Question typique:** Rayon de la trajectoire dans un spectromètre de masse.\n\n" +
      "**Conseils:** Décomposer les effets E et B si les deux sont présents.",
  },
  "physics-unit-e": {
    "physics-e1":
      "**Structure Atomique**\n\n" +
      "**Définition:** Arrangement des particules subatomiques.\n\n" +
      "**Formules clés:** ΔE=hf; niveaux d'énergie dans le modèle de Bohr\n\n" +
      "**Question typique:** Longueur d'onde du photon à partir de la transition.\n\n" +
      "**Conseils:** Dessiner d'abord le diagramme des niveaux d'énergie.",
    "physics-e3":
      "**Désintégration Radioactive**\n\n" +
      "**Définition:** Transformation nucléaire spontanée.\n\n" +
      "**Formules clés:** N=N₀e^{–λt}; t₁/₂=ln2/λ\n\n" +
      "**Question typique:** Activité après 3 demi-vies.\n\n" +
      "**Conseils:** Utiliser des raccourcis de demi-vie pour un calcul rapide.",
    "physics-e4":
      "**Fission**\n\n" +
      "**Définition:** Noyau lourd se divisant en noyaux plus légers.\n\n" +
      "**Formules clés:** ΔE=Δmc²; conditions de réaction en chaîne\n\n" +
      "**Question typique:** Énergie par événement de fission.\n\n" +
      "**Conseils:** Convertir le défaut de masse en u → kg.",
    "physics-e5":
      "**Fusion et Étoiles**\n\n" +
      "**Définition:** Noyaux légers se combinant pour former des plus lourds.\n\n" +
      "**Concepts clés:** Chaîne proton–proton; cycle CNO\n\n" +
      "**Question typique:** Expliquer pourquoi la fusion libère plus d'énergie par nucléon.\n\n" +
      "**Conseils:** Référencer la courbe d'énergie de liaison.",
  },
  // Chemistry SL translations
  "chemistry-structure-1": {
    "chemistry-s1-1":
      "**Théorie Cinétique et Phases**\n\n" +
      "**Définition:** Particules en mouvement; pression due aux collisions.\n\n" +
      "**Concepts clés:** Espacement et énergie des particules dans différentes phases.\n\n" +
      "**Question typique:** Expliquer le changement de pression avec l'augmentation de température.\n\n" +
      "**Conseils:** Utiliser des diagrammes pour l'espacement des particules.",
    "chemistry-s1-2":
      "**Atome Nucléaire et Énergie de Liaison**\n\n" +
      "**Définition:** Structure avec noyau dense et nuage d'électrons.\n\n" +
      "**Formules clés:** Isotopes; ΔE=Δmc².\n\n" +
      "**Question typique:** Calculer l'énergie de liaison à partir du défaut de masse.\n\n" +
      "**Conseils:** Convertir u→kg avec précision.",
    "chemistry-s1-3":
      "**Configurations Électroniques**\n\n" +
      "**Définition:** Arrangement des électrons dans les niveaux d'énergie.\n\n" +
      "**Concepts clés:** Principes d'Aufbau, Hund, Pauli.\n\n" +
      "**Question typique:** Écrire la configuration de Fe³⁺.\n\n" +
      "**Conseils:** Se souvenir des exceptions (Cr, Cu).",
    "chemistry-s1-4":
      "**La Mole et Stœchiométrie**\n\n" +
      "**Définition:** Quantité de substance contenant le nombre d'Avogadro de particules.\n\n" +
      "**Formule clé:** n=m/M; nombre d'Avogadro.\n\n" +
      "**Question typique:** Formule empirique à partir du % massique.\n\n" +
      "**Conseils:** Toujours suivre les unités.",
    "chemistry-s1-5":
      "**Loi des Gaz Parfaits**\n\n" +
      "**Définition:** Relation entre pression, volume, température pour les gaz.\n\n" +
      "**Formule clé:** PV=nRT (R=8,314 J mol⁻¹ K⁻¹).\n\n" +
      "**Question typique:** Volume aux conditions normales.\n\n" +
      "**Conseils:** Convertir P en Pa, V en m³.",
  },
  "chemistry-structure-2": {
    "chemistry-s2-1":
      "**Modèle Ionique**\n\n" +
      "**Définition:** Liaison par attraction électrostatique entre ions.\n\n" +
      "**Concepts clés:** Énergie réticulaire; loi de Coulomb.\n\n" +
      "**Question typique:** Compléter le cycle de Born–Haber.\n\n" +
      "**Conseils:** Inverser le signe ΔH pour la réaction inverse.",
    "chemistry-s2-2":
      "**Structures Covalentes et RPECV**\n\n" +
      "**Définition:** Liaison par paires d'électrons partagées.\n\n" +
      "**Concepts clés:** Lewis, formes moléculaires, polarité des liaisons.\n\n" +
      "**Question typique:** Prédire la forme de SF₄.\n\n" +
      "**Conseils:** Compter d'abord les paires libres.",
    "chemistry-s2-3":
      "**Liaison Métallique**\n\n" +
      "**Définition:** Ions positifs dans une mer d'électrons délocalisés.\n\n" +
      "**Concepts clés:** Mer d'électrons; conductivité.\n\n" +
      "**Question typique:** Expliquer la malléabilité des métaux.\n\n" +
      "**Conseils:** Relier aux électrons délocalisés.",
    "chemistry-s2-4":
      "**Matériaux**\n\n" +
      "**Définition:** Relations structure-propriété dans divers matériaux.\n\n" +
      "**Concepts clés:** Polymères, céramiques, nanomatériaux.\n\n" +
      "**Question typique:** Comparer les propriétés du diamant vs graphite.\n\n" +
      "**Conseils:** Lier le type de liaison à la dureté.",
  },
  "chemistry-structure-3": {
    "chemistry-s3-1":
      "**Tendances Périodiques**\n\n" +
      "**Définition:** Modèles dans les propriétés des éléments à travers le tableau périodique.\n\n" +
      "**Concepts clés:** Rayon atomique, EI, EN tendances.\n\n" +
      "**Question typique:** Expliquer l'augmentation de l'EI à travers la période.\n\n" +
      "**Conseils:** Esquisser les flèches de tendance sur le tableau.",
    "chemistry-s3-2":
      "**Groupes Fonctionnels**\n\n" +
      "**Définition:** Arrangements spécifiques d'atomes qui déterminent le comportement chimique.\n\n" +
      "**Concepts clés:** Alcools, aldéhydes, acides, amines, etc.\n\n" +
      "**Question typique:** Nommer un composé avec groupe –COOH.\n\n" +
      "**Conseils:** Garder un ensemble de fiches des structures de groupe.",
  },
  "chemistry-reactivity-1": {
    "chemistry-r1-1":
      "**Changements d'Enthalpie**\n\n" +
      "**Définition:** Changements d'énergie thermique dans les réactions.\n\n" +
      "**Formules clés:** ΔH=m c ΔT; ΔH_rxn via loi de Hess.\n\n" +
      "**Question typique:** Calculer ΔH à partir de données calorimétriques.\n\n" +
      "**Conseils:** Tenir compte de la perte de chaleur vers le calorimètre.",
    "chemistry-r1-2":
      "**Loi de Hess et Cycles**\n\n" +
      "**Définition:** Indépendance du chemin des changements d'enthalpie.\n\n" +
      "**Concept clé:** Additivité des enthalpies.\n\n" +
      "**Question typique:** Utiliser la loi de Hess pour trouver ΔH de réaction.\n\n" +
      "**Conseils:** Inverser les équations inverse le signe.",
    "chemistry-r1-3":
      "**Combustion de Carburant**\n\n" +
      "**Définition:** Libération d'énergie par combustion de carburants.\n\n" +
      "**Concept clé:** ΔH_c à partir de l'équation équilibrée.\n\n" +
      "**Question typique:** Énergie par gramme d'éthanol.\n\n" +
      "**Conseils:** Équilibrer complètement l'équation d'abord.",
    "chemistry-r1-4":
      "**Entropie et Énergie Libre de Gibbs**\n\n" +
      "**Définition:** Mesure du désordre et de la spontanéité de réaction.\n\n" +
      "**Formule clé:** ΔG=ΔH–TΔS.\n\n" +
      "**Question typique:** Prédire la spontanéité à T donnée.\n\n" +
      "**Conseils:** Convertir ΔS en J K⁻¹ mol⁻¹ pour correspondre à ΔH.",
  },
  "chemistry-reactivity-2": {
    "chemistry-r2-1":
      "**Stœchiométrie et Rendement**\n\n" +
      "**Définition:** Relations quantitatives dans les réactions chimiques.\n\n" +
      "**Concepts clés:** Réactif limitant; économie d'atomes.\n\n" +
      "**Question typique:** Rendement théorique à partir de réactifs donnés.\n\n" +
      "**Conseils:** Identifier le réactif limitant avant tout calcul.",
    "chemistry-r2-2":
      "**Lois de Vitesse**\n\n" +
      "**Définition:** Expressions mathématiques pour les vitesses de réaction.\n\n" +
      "**Formule clé:** Vitesse=k[A]^n[B]^m.\n\n" +
      "**Question typique:** Déterminer l'ordre à partir de données concentration–temps.\n\n" +
      "**Conseils:** Utiliser la méthode des vitesses initiales.",
    "chemistry-r2-3":
      "**Équilibre et Le Châtelier**\n\n" +
      "**Définition:** Équilibre dynamique des réactions directe/inverse.\n\n" +
      "**Concepts clés:** Expressions K_c, K_p; réponse au stress.\n\n" +
      "**Question typique:** Prédire le déplacement quand la pression augmente.\n\n" +
      "**Conseils:** Les tableaux ICE gardent le travail organisé.",
  },
  "chemistry-reactivity-3": {
    "chemistry-r3-1":
      "**Acide–Base (Transfert de Proton)**\n\n" +
      "**Définition:** Réactions impliquant le transfert de H+.\n\n" +
      "**Formules clés:** Ka, pKa, pH=–log[H₃O⁺].\n\n" +
      "**Question typique:** pH de l'acide acétique 0,10 M.\n\n" +
      "**Conseils:** Si Ka≪c, utiliser x²/(c–x)≈Ka.",
    "chemistry-r3-2":
      "**Redox (Transfert d'Électrons)**\n\n" +
      "**Définition:** Réactions impliquant le transfert d'électrons.\n\n" +
      "**Concepts clés:** Nombres d'oxydation; demi-équations.\n\n" +
      "**Question typique:** Équilibrer redox en solution acide.\n\n" +
      "**Conseils:** Équilibrer O avec H₂O et H⁺ d'abord.",
    "chemistry-r3-3":
      "**Mécanismes Radicalaires**\n\n" +
      "**Définition:** Réactions impliquant des électrons non appariés.\n\n" +
      "**Concepts clés:** Initiation, propagation, terminaison.\n\n" +
      "**Question typique:** Mécanisme de CH₄ + Cl₂ → CH₃Cl + HCl.\n\n" +
      "**Conseils:** Suivre les électrons célibataires avec la notation point.",
    "chemistry-r3-4":
      "**Réactions Organiques (SN1, SN2, Addition)**\n\n" +
      "**Définition:** Voies de réaction en chimie organique.\n\n" +
      "**Concepts clés:** Force du nucléophile; encombrement stérique du substrat.\n\n" +
      "**Question typique:** Distinguer les lois de vitesse SN1 vs SN2.\n\n" +
      "**Conseils:** Esquisser le diagramme de coordonnée de réaction.",
  },
  // Geography HL translations
  "geography-core": {
    "geography-core-1":
      "**Distribution de la Population**\n\n" +
      "**Définition:** Modèles et facteurs de changement démographique.\n\n" +
      "**Concepts clés:** Modèle de transition démographique; pyramides des âges; migration.\n\n" +
      "**Question typique:** Évaluer le stade de la transition démographique pour un pays de votre choix.\n\n" +
      "**Conseils:** Utiliser des données réelles (statistiques de l'ONU) pour illustrer.",
    "geography-core-2":
      "**Climat Global**\n\n" +
      "**Définition:** Vulnérabilité et résilience aux risques climatiques.\n\n" +
      "**Concepts clés:** Cadre de risque du GIEC; atténuation vs adaptation.\n\n" +
      "**Question typique:** Comparer les stratégies d'adaptation dans deux villes côtières.\n\n" +
      "**Conseils:** Inclure des détails d'études de cas (par exemple, digues vs solutions basées sur les écosystèmes).",
    "geography-core-3":
      "**Consommation et Sécurité des Ressources**\n\n" +
      "**Définition:** Accès à l'eau, à la nourriture, à l'énergie.\n\n" +
      "**Concepts clés:** Eau virtuelle; économie circulaire; écart de ressources.\n\n" +
      "**Question typique:** Évaluer les mesures de sécurité alimentaire dans une région en développement.\n\n" +
      "**Conseils:** Relier les modèles de consommation aux scores IDH.",
  },
  "geography-options": {
    "geography-opt-1":
      "**Eau Douce: Problèmes et Conflits**\n\n" +
      "**Définition:** Distribution et gestion de l'eau douce.\n\n" +
      "**Concepts clés:** Gouvernance des bassins versants; commerce d'eau virtuelle.\n\n" +
      "**Question typique:** Expliquer les tensions concernant l'eau du bassin du Nil.\n\n" +
      "**Conseils:** Cartographier les intérêts en amont vs en aval.",
    "geography-opt-2":
      "**Océans et Marges Côtières**\n\n" +
      "**Définition:** Processus marins et gestion.\n\n" +
      "**Concepts clés:** Érosion côtière; conception d'AMP.\n\n" +
      "**Question typique:** Évaluer l'ingénierie dure vs douce.\n\n" +
      "**Conseils:** Utiliser des images avant/après.",
    "geography-opt-3":
      "**Environnements Extrêmes**\n\n" +
      "**Définition:** Adaptation humaine dans les déserts, zones polaires.\n\n" +
      "**Concepts clés:** Dégel du pergélisol; impacts de l'écotourisme.\n\n" +
      "**Question typique:** Évaluer la durabilité du tourisme en Antarctique.\n\n" +
      "**Conseils:** Inclure des facteurs biophysiques et socio-économiques.",
    "geography-opt-4":
      "**Risques Géophysiques**\n\n" +
      "**Définition:** Tremblements de terre, volcans et phénomènes connexes.\n\n" +
      "**Concepts clés:** Évaluation des risques; facteurs de vulnérabilité.\n\n" +
      "**Question typique:** Comparer les impacts des tremblements de terre dans les pays à revenu élevé vs faible.\n\n" +
      "**Conseils:** Utiliser des études de cas spécifiques avec des impacts quantifiés.",
    "geography-opt-5":
      "**Loisirs, Tourisme et Sport**\n\n" +
      "**Définition:** Modèles spatiaux des activités récréatives.\n\n" +
      "**Concepts clés:** Modèle de Butler; capacité de charge; écotourisme.\n\n" +
      "**Question typique:** Évaluer la durabilité du tourisme de masse dans une station balnéaire.\n\n" +
      "**Conseils:** Inclure les perspectives des parties prenantes.",
    "geography-opt-6":
      "**Alimentation et Santé**\n\n" +
      "**Définition:** Modèles géographiques de nutrition et de maladie.\n\n" +
      "**Concepts clés:** Déserts alimentaires; transition épidémiologique.\n\n" +
      "**Question typique:** Évaluer l'inégalité spatiale dans l'accès aux soins de santé.\n\n" +
      "**Conseils:** Utiliser la cartographie SIG pour illustrer les disparités.",
    "geography-opt-7":
      "**Environnements Urbains**\n\n" +
      "**Définition:** Développement et défis des villes.\n\n" +
      "**Concepts clés:** Modèles urbains; gentrification; villes intelligentes.\n\n" +
      "**Question typique:** Évaluer les solutions de transport durable.\n\n" +
      "**Conseils:** Comparer les villes à différents stades de développement.",
  },
  "geography-hl-extension": {
    "geography-hl-1":
      "**Pouvoir, Lieux et Réseaux**\n\n" +
      "**Définition:** Flux mondiaux de capitaux, de personnes, d'informations.\n\n" +
      "**Concepts clés:** Compression temps-espace; réseaux de villes mondiales.\n\n" +
      "**Question typique:** Analyser le rôle de Londres dans l'économie mondiale.\n\n" +
      "**Conseils:** Utiliser des diagrammes de réseau.",
    "geography-hl-2":
      "**Développement Humain et Diversité**\n\n" +
      "**Définition:** Bien-être et paysages culturels.\n\n" +
      "**Concepts clés:** IDH, IIG; diffusion culturelle.\n\n" +
      "**Question typique:** Critiquer l'IDH comme mesure du développement.\n\n" +
      "**Conseils:** Discuter des limitations (inégalité, fiabilité des données).",
    "geography-hl-3":
      "**Risques Mondiaux et Résilience**\n\n" +
      "**Définition:** Menaces transnationales et réponses.\n\n" +
      "**Concepts clés:** Transition épidémiologique; cadres de cybermenace.\n\n" +
      "**Question typique:** Évaluer la réponse mondiale au COVID-19.\n\n" +
      "**Conseils:** Équilibrer les données quantitatives avec la critique des politiques.",
  },
  "geography-ia": {
    "geography-ia-1":
      "**Travail de Terrain**\n\n" +
      "**Définition:** Investigation géographique indépendante.\n\n" +
      "**Étapes clés:**\n" +
      "1. Formulation de la question\n" +
      "2. Collecte de données primaires (échantillonnage)\n\n" +
      "3. Analyse (graphiques, statistiques)\n" +
      "4. Évaluation et limitations\n\n" +
      "**Question typique:** Concevoir une étude de microclimat dans votre ville.\n\n" +
      "**Conseils:** Garder votre question étroite et les méthodes justifiées.",
  },
  pastPapers: "Épreuves Passées",
  allPapers: "Toutes les Épreuves",
  browseBySubject: "Parcourir par Matière",
  browseByYear: "Parcourir par Année",
  searchPastPapers: "Rechercher des Épreuves",
  searchPastPapersPlaceholder: "Rechercher par titre, description ou mots-clés...",
  noPastPapersFound: "Aucune épreuve trouvée correspondant à vos critères.",
  uploadPastPaper: "Télécharger une Épreuve",
  uploadSuccess: "Téléchargement Réussi",
  pastPaperUploaded: "L'épreuve a été téléchargée avec succès.",
  uploadError: "Erreur de Téléchargement",
  pastPaperUploadFailed: "Échec du téléchargement de l'épreuve. Veuillez réessayer.",
  subject: "Matière",
  subjectPlaceholder: "ex. Mathématiques, Physique",
  subjectCode: "Code de Matière",
  subjectCodePlaceholder: "ex. MATH_HL",
  subjectCodeDescription: "Code optionnel pour la matière",
  year: "Année",
  month: "Mois",
  selectMonth: "Sélectionner un mois",
  may: "Mai",
  november: "Novembre",
  language: "Langue",
  languagePlaceholder: "ex. Anglais, Français",
  paperNumber: "Numéro d'Épreuve",
  level: "Niveau",
  selectLevel: "Sélectionner un niveau",
  both: "Les Deux",
  description: "Description",
  descriptionPlaceholder: "Ajoutez des informations supplémentaires sur cette épreuve...",
  file: "Fichier",
  fileDescription: "Téléchargez un fichier PDF (max 10MB)",
  uploading: "Téléchargement en cours...",
  title: "Titre",
  pastPaperTitlePlaceholder: "ex. Mathématiques HL Épreuve 1",
  filters: "Filtres",
  selectSubject: "Sélectionner une matière",
  searchSubject: "Rechercher une matière",
  noSubjectsFound: "Aucune matière trouvée",
  selectYear: "Sélectionner une année",
  searchYear: "Rechercher une année",
  noYearsFound: "Aucune année trouvée",
  clearFilters: "Effacer les Filtres",
  paper: "Épreuve",
  download: "Télécharger",
  view: "Voir",
  loading: "Chargement...",
  papers: "épreuves",
  found: "trouvées",
  details: "Détails",
  downloadPastPaper: "Télécharger l'Épreuve",
  previewNotAvailable: "Aperçu non disponible",
  openInNewTab: "Ouvrir dans un Nouvel Onglet",
  back: "Retour",
  pastPaperNotFound: "Épreuve non trouvée",
  backToSearch: "Retour à la Recherche",
}

export default translations
