export interface TranslationDictionary {
  [key: string]: any;
}

export const TRANSLATIONS: Record<string, TranslationDictionary> = {
  en: {
    nav: {
      brand: "Paradize",
      tagline: "Read. Reflect. Grow. Together.",
      home: "Home",
      community: "Community",
      discussions: "Discussions",
      events: "Events",
      resources: "Resources",
      aboutUs: "About Us",
      login: "Log In",
      joinNow: "Join Now",
      toggleMenu: "Toggle menu",
      language: "Language"
    },
    hero: {
      badge: "A COMMUNITY FOR CURIOUS MINDS",
      title1: "Read to Understand.",
      title2: "Discuss to ",
      titleAccent: "Grow.",
      subtitle: "A virtual ground for readers to explore ideas, share perspectives, and grow together. Different books. Multiple viewpoints. One journey of constant growth.",
      joinCommunity: "Join the Community",
      howItWorks: "How It Works",
      quoteText: "We don't read to agree. We read to understand.",
      quoteAuthor: "— Paradize Community",
      stats: {
        members: "10K+",
        membersLabel: "Members",
        discussions: "250+",
        discussionsLabel: "Active Discussions",
        events: "50+",
        eventsLabel: "Monthly Events",
        cities: "25+",
        citiesLabel: "Cities (Offline)"
      }
    },
    pills: {
      discussions: {
        title: "Thoughtful Discussions",
        desc: "Dive deep into curated discussions that challenge your thinking."
      },
      perspectives: {
        title: "Multiple Perspectives",
        desc: "Explore every idea from different lenses and backgrounds."
      },
      genres: {
        title: "Diverse Genres",
        desc: "From fiction to philosophy, science to history—read what expands you."
      },
      growth: {
        title: "Personal Growth",
        desc: "Track your journey, reflect on insights, and become your best self."
      },
      events: {
        title: "Events & Meetups",
        desc: "Join live sessions online and offline. Connect. Learn. Belong."
      },
      cafes: {
        title: "Offline Cafés",
        desc: "Real conversations. Great coffee. Lifelong connections."
      }
    },
    showcase: {
      currentlyReading: "Currently Reading Together",
      viewAll: "View all",
      sapiensTitle: "Sapiens",
      sapiensSubtitle: "A Brief History of Humankind",
      sapiensAuthor: "Yuval Noah Harari",
      chapterProgress: "Chapter 6 of 20",
      upcomingEvent: "Upcoming Event",
      liveDiscussion: "LIVE DISCUSSION",
      eventTitle: "The Psychology of Decision Making",
      eventDate: "Sat, 1 June 2024 • 7:00 PM IST",
      attendeesGoing: "+120 going",
      joinEvent: "Join Event",
      joined: "Joined!",
      testimonialsTitle: "What Members Are Saying",
      testimonialQuote: "Paradize has completely changed the way I read and think. The discussions are insightful, respectful, and truly inspiring.",
      testimonialAuthor: "Ananya P.",
      testimonialSince: "Member since 2023",
      yourJourneyTitle: "Your Journey",
      booksRead: "Books Read",
      discussionsJoined: "Discussions Joined",
      insightsShared: "Insights Shared",
      growthStreak: "Growth Streak",
      weeks: "weeks",
      continueJourney: "Continue Your Journey"
    },
    newsletter: {
      heading: "Ideas in your inbox. Growth in your life.",
      subheading: "Weekly reads, discussion highlights, and exclusive invites.",
      placeholder: "Enter your email",
      subscribe: "Subscribe",
      subscribing: "Subscribing...",
      defaultSuccess: "You're subscribed! Welcome to Paradize reads.",
      invalidEmail: "Please enter a valid email address.",
      connectError: "Failed to connect. Please try again."
    },
    footer: {
      copyright: "Paradize Community. All rights reserved.",
      quickLinks: "Quick Links",
      community: "Community",
      events: "Events",
      resources: "Resources",
      faq: "FAQ",
      contactUs: "Contact Us",
      motto: "Built for readers. Driven by conversations."
    },
    howItWorks: {
      title: "How Paradize Works",
      subtitle: "Paradize is built around a simple, powerful cycle designed to turn pages into enduring understanding.",
      step1Title: "Discover What Matters",
      step1Desc: "Find books aligned with your intellectual curiosity and growth goals—curated by readers, not algorithms trying to sell.",
      step2Title: "Read & Reflect Privately",
      step2Desc: "Capture chapter notes and insights in your private Reflection Journal with guided prompts designed for long-term retention.",
      step3Title: "Discuss & Grow Together",
      step3Desc: "Join cohort reading groups and local cafe meetups in Mumbai. Engage in structured, respectful discussions where depth is celebrated.",
      cta: "Join the Community — It's Free"
    },
    faq: {
      title: "Frequently Asked Questions",
      q1: "Is Paradize free to join?",
      a1: "Yes, Paradize is 100% free for readers. Our community is open to everyone passionate about books and ideas.",
      q2: "Where are offline meetups held?",
      a2: "We host weekend reading cafes across Mumbai (Bandra, Colaba, Powai) with additional chapters launching in Pune and Bangalore.",
      q3: "How do reading groups work?",
      a3: "Groups read 2–3 chapters per week, sharing weekly reflections and meeting virtually or in-person for chapter deep-dives."
    },
    toast: {
      eventRegistered: "You're registered for \"The Psychology of Decision Making\"!"
    },
    app: {
      main: "Main",
      community: "Community",
      personal: "Personal",
      dashboard: "Dashboard",
      library: "My Library",
      discover: "Discover",
      discussions: "Discussions",
      groups: "Reading Groups",
      journal: "Reflection Journal",
      profile: "Profile",
      onboarding: "Welcome to Paradize",
      signOut: "Sign Out",
      newDiscussion: "New Discussion",
      reader: "Reader"
    }
  },

  hi: {
    nav: {
      brand: "पैराडाइज़",
      tagline: "पढ़ें। विचार करें। साथ बढ़ें।",
      home: "होम",
      community: "समुदाय",
      discussions: "चर्चाएं",
      events: "कार्यक्रम",
      resources: "संसाधन",
      aboutUs: "हमारे बारे में",
      login: "लॉग इन",
      joinNow: "शामिल हों",
      toggleMenu: "मेनू खोलें",
      language: "भाषा"
    },
    hero: {
      badge: "जिज्ञासु मनों के लिए एक समुदाय",
      title1: "समझने के लिए पढ़ें।",
      title2: "विकास के लिए ",
      titleAccent: "चर्चा करें।",
      subtitle: "पाठकों के लिए विचारों की खोज, नए दृष्टिकोण साझा करने और एक साथ आगे बढ़ने का मंच। अलग-अलग पुस्तकें, अनगिनत दृष्टिकोण, और सतत आत्म-विकास की एक यात्रा।",
      joinCommunity: "समुदाय से जुड़ें",
      howItWorks: "यह कैसे काम करता है",
      quoteText: "हम केवल सहमत होने के लिए नहीं पढ़ते। हम समझने के लिए पढ़ते हैं।",
      quoteAuthor: "— पैराडाइज़ समुदाय",
      stats: {
        members: "10K+",
        membersLabel: "सक्रिय पाठक",
        discussions: "250+",
        discussionsLabel: "सक्रिय चर्चाएं",
        events: "50+",
        eventsLabel: "मासिक कार्यक्रम",
        cities: "25+",
        citiesLabel: "शहर (ऑफ़लाइन)"
      }
    },
    pills: {
      discussions: {
        title: "गहन विचार-विमर्श",
        desc: "ऐसी चुनिंदा चर्चाओं में शामिल हों जो आपकी सोच का विस्तार करती हैं।"
      },
      perspectives: {
        title: "विविध दृष्टिकोण",
        desc: "हर विचार को नए लेंस और विभिन्न पृष्ठभूमियों से समझें।"
      },
      genres: {
        title: "विविध साहित्य",
        desc: "काल्पनिक कथाओं से लेकर दर्शन, विज्ञान और इतिहास तक — वह पढ़ें जो आपको समृद्ध करे।"
      },
      growth: {
        title: "व्यक्तिगत विकास",
        desc: "अपनी यात्रा को ट्रैक करें, अंतर्दृष्टियों पर विचार करें और सर्वश्रेष्ठ रूप बनें।"
      },
      events: {
        title: "इवेंट्स और बैठकें",
        desc: "ऑनलाइन और ऑफ़लाइन सत्रों में भाग लें। जुड़ें, सीखें और अपनापन पाएं।"
      },
      cafes: {
        title: "ऑफ़लाइन कैफ़े",
        desc: "सच्ची बातचीत, बेहतरीन कॉफ़ी और जीवन भर के संबंध।"
      }
    },
    showcase: {
      currentlyReading: "वर्तमान में साथ पढ़ रहे हैं",
      viewAll: "सभी देखें",
      sapiensTitle: "सेपियंस",
      sapiensSubtitle: "मानव जाति का संक्षिप्त इतिहास",
      sapiensAuthor: "युवाल नोआ हरारी",
      chapterProgress: "अध्याय 6 / 20",
      upcomingEvent: "आगामी कार्यक्रम",
      liveDiscussion: "लाइव परिचर्चा",
      eventTitle: "निर्णय लेने का मनोविज्ञान",
      eventDate: "शनि, 1 जून 2024 • शाम 7:00 IST",
      attendeesGoing: "+120 शामिल हो रहे हैं",
      joinEvent: "इवेंट में जुड़ें",
      joined: "जुड़ गए!",
      testimonialsTitle: "सदस्य क्या कह रहे हैं",
      testimonialQuote: "पैराडाइज़ ने मेरे पढ़ने और सोचने के तरीके को पूरी तरह बदल दिया है। यहाँ की चर्चाएं अत्यंत ज्ञानवर्धक और प्रेरक हैं।",
      testimonialAuthor: "अनन्या पी.",
      testimonialSince: "2023 से सदस्य",
      yourJourneyTitle: "आपकी यात्रा",
      booksRead: "पढ़ी गई पुस्तकें",
      discussionsJoined: "चर्चाओं में भाग लिया",
      insightsShared: "साझा की गई अंतर्दृष्टियां",
      growthStreak: "विकास क्रम",
      weeks: "सप्ताह",
      continueJourney: "अपनी यात्रा जारी रखें"
    },
    newsletter: {
      heading: "इनबॉक्स में विचार। जीवन में सकारात्मक विकास।",
      subheading: "साप्ताहिक पुस्तकें, चर्चाओं के मुख्य अंश और विशेष आमंत्रण।",
      placeholder: "अपना ईमेल दर्ज करें",
      subscribe: "सदस्यता लें",
      subscribing: "प्रतीक्षा करें...",
      defaultSuccess: "आपकी सदस्यता सफल रही! पैराडाइज़ में स्वागत है।",
      invalidEmail: "कृपया एक मान्य ईमेल पता दर्ज करें।",
      connectError: "संपर्क विफल। कृपया पुनः प्रयास करें।"
    },
    footer: {
      copyright: "पैराडाइज़ कम्युनिटी। सर्वाधिकार सुरक्षित।",
      quickLinks: "त्वरित लिंक",
      community: "समुदाय",
      events: "कार्यक्रम",
      resources: "संसाधन",
      faq: "सामान्य प्रश्न",
      contactUs: "संपर्क करें",
      motto: "पाठकों के लिए निर्मित। सार्थक चर्चाओं से प्रेरित।"
    },
    howItWorks: {
      title: "पैराडाइज़ कैसे काम करता है",
      subtitle: "पैराडाइज़ एक सरल और शक्तिशाली चक्र पर आधारित है जो पुस्तक के पन्नों को स्थायी ज्ञान में बदलता है।",
      step1Title: "सार्थक पुस्तकों की खोज करें",
      step1Desc: "अपनी बौद्धिक जिज्ञासा और व्यक्तिगत लक्ष्यों के अनुकूल पुस्तकें खोजें — साथी पाठकों द्वारा संकलित।",
      step2Title: "एकांत में पढ़ें और विचार करें",
      step2Desc: "अपने व्यक्तिगत चिंतन जर्नल में अध्याय के नोट्स और अंतर्दृष्टियां दर्ज करें।",
      step3Title: "साथ में चर्चा करें और बढ़ें",
      step3Desc: "मुंबई में वाचन समूहों और स्थानीय कैफ़े सत्रों में भाग लें जहाँ गहन विचारों का सम्मान होता है।",
      cta: "समुदाय से जुड़ें — यह पूरी तरह निःशुल्क है"
    },
    faq: {
      title: "अक्सर पूछे जाने वाले प्रश्न",
      q1: "क्या पैराडाइज़ से जुड़ना निःशुल्क है?",
      a1: "हाँ, पाठकों के लिए पैराडाइज़ 100% निःशुल्क है। हमारा समुदाय पुस्तकों और विचारों के प्रति उत्साही हर व्यक्ति के लिए खुला है।",
      q2: "ऑफ़लाइन बैठकें कहाँ आयोजित की जाती हैं?",
      a2: "हम मुंबई (बांद्रा, कोलाबा, पवई) में सप्ताहांत रीडिंग कैफ़े आयोजित करते हैं, और जल्द ही पुणे व बैंगलोर में विस्तार कर रहे हैं।",
      q3: "रीडिंग ग्रुप्स कैसे काम करते हैं?",
      a3: "समूह प्रति सप्ताह 2-3 अध्याय पढ़ते हैं, साप्ताहिक चिंतन साझा करते हैं और ऑनलाइन या प्रत्यक्ष रूप से मिलते हैं।"
    },
    toast: {
      eventRegistered: "आप \"निर्णय लेने का मनोविज्ञान\" सत्र के लिए पंजीकृत हो गए हैं!"
    },
    app: {
      main: "मुख्य",
      community: "समुदाय",
      personal: "व्यक्तिगत",
      dashboard: "डैशबोर्ड",
      library: "मेरी लाइब्रेरी",
      discover: "खोजें",
      discussions: "चर्चाएं",
      groups: "रीडिंग ग्रुप्स",
      journal: "चिंतन जर्नल",
      profile: "प्रोफ़ाइल",
      onboarding: "पैराडाइज़ में स्वागत है",
      signOut: "लॉग आउट",
      newDiscussion: "नई चर्चा शुरू करें",
      reader: "पाठक"
    }
  },

  es: {
    nav: {
      brand: "Paradize",
      tagline: "Lee. Reflexiona. Crece. Juntos.",
      home: "Inicio",
      community: "Comunidad",
      discussions: "Debates",
      events: "Eventos",
      resources: "Recursos",
      aboutUs: "Sobre Nosotros",
      login: "Iniciar Sesión",
      joinNow: "Únete Ahora",
      toggleMenu: "Menú",
      language: "Idioma"
    },
    hero: {
      badge: "UNA COMUNIDAD PARA MENTES CURIOSAS",
      title1: "Lee para Comprender.",
      title2: "Debate para ",
      titleAccent: "Crecer.",
      subtitle: "Un espacio virtual para lectores donde explorar ideas, compartir perspectivas y evolucionar juntos. Diferentes libros. Múltiples puntos de vista. Un solo viaje de crecimiento.",
      joinCommunity: "Únete a la Comunidad",
      howItWorks: "Cómo Funciona",
      quoteText: "No leemos para coincidir. Leemos para comprender.",
      quoteAuthor: "— Comunidad Paradize",
      stats: {
        members: "10K+",
        membersLabel: "Miembros",
        discussions: "250+",
        discussionsLabel: "Debates Activos",
        events: "50+",
        eventsLabel: "Eventos Mensuales",
        cities: "25+",
        citiesLabel: "Ciudades (Presencial)"
      }
    },
    pills: {
      discussions: {
        title: "Debates Profundos",
        desc: "Sumérgete en conversaciones que desafían tu pensamiento."
      },
      perspectives: {
        title: "Múltiples Perspectivas",
        desc: "Explora cada idea desde diferentes ángulos y vivencias."
      },
      genres: {
        title: "Diversos Géneros",
        desc: "De la ficción a la filosofía, de la ciencia a la historia: lee lo que expande tu mente."
      },
      growth: {
        title: "Crecimiento Personal",
        desc: "Registra tu progreso, reflexiona y conviértete en tu mejor versión."
      },
      events: {
        title: "Eventos y Encuentros",
        desc: "Participa en sesiones online y presenciales. Conecta y aprende."
      },
      cafes: {
        title: "Cafés Literarios",
        desc: "Conversaciones reales, buen café y amistades para toda la vida."
      }
    },
    showcase: {
      currentlyReading: "Leyendo Juntos Actualmente",
      viewAll: "Ver todo",
      sapiensTitle: "Sapiens",
      sapiensSubtitle: "De animales a dioses",
      sapiensAuthor: "Yuval Noah Harari",
      chapterProgress: "Capítulo 6 de 20",
      upcomingEvent: "Próximo Evento",
      liveDiscussion: "DEBATE EN VIVO",
      eventTitle: "La Psicología de la Toma de Decisiones",
      eventDate: "Sáb, 1 Junio 2024 • 19:00 IST",
      attendeesGoing: "+120 asistirán",
      joinEvent: "Unirse al Evento",
      joined: "¡Registrado!",
      testimonialsTitle: "Lo Que Dicen Nuestros Miembros",
      testimonialQuote: "Paradize ha transformado por completo mi forma de leer y reflexionar. Los debates son respetuosos, profundos e inspiradores.",
      testimonialAuthor: "Ananya P.",
      testimonialSince: "Miembro desde 2023",
      yourJourneyTitle: "Tu Progreso",
      booksRead: "Libros Leídos",
      discussionsJoined: "Debates Realizados",
      insightsShared: "Reflexiones Compartidas",
      growthStreak: "Racha de Crecimiento",
      weeks: "semanas",
      continueJourney: "Continuar Mi Viaje"
    },
    newsletter: {
      heading: "Ideas en tu bandeja. Crecimiento en tu vida.",
      subheading: "Lecturas semanales, debates destacados e invitaciones exclusivas.",
      placeholder: "Introduce tu correo",
      subscribe: "Suscribirse",
      subscribing: "Suscribiendo...",
      defaultSuccess: "¡Suscripción exitosa! Te damos la bienvenida a Paradize.",
      invalidEmail: "Por favor, introduce un correo electrónico válido.",
      connectError: "Error de conexión. Inténtalo de nuevo."
    },
    footer: {
      copyright: "Comunidad Paradize. Todos los derechos reservados.",
      quickLinks: "Enlaces Rápidos",
      community: "Comunidad",
      events: "Eventos",
      resources: "Recursos",
      faq: "Preguntas Frecuentes",
      contactUs: "Contacto",
      motto: "Creado para lectores. Impulsado por el diálogo."
    },
    howItWorks: {
      title: "Cómo Funciona Paradize",
      subtitle: "Paradize gira en torno a un ciclo simple y transformador que convierte las páginas en sabiduría duradera.",
      step1Title: "Descubre Lo Que Importa",
      step1Desc: "Encuentra libros alineados con tus inquietudes intelectuales y metas personales.",
      step2Title: "Lee y Reflexiona en Privado",
      step2Desc: "Captura notas de capítulos e ideas en tu Diario de Reflexión personal.",
      step3Title: "Debate y Crece en Comunidad",
      step3Desc: "Únete a círculos de lectura y encuentros en cafés donde se celebra la profundidad de pensamiento.",
      cta: "Únete a la Comunidad — Es Gratis"
    },
    faq: {
      title: "Preguntas Frecuentes",
      q1: "¿Es gratis unirse a Paradize?",
      a1: "Sí, Paradize es 100% gratuito para los lectores. Nuestra comunidad está abierta a todo el mundo.",
      q2: "¿Dónde se celebran los encuentros presenciales?",
      a2: "Organizamos clubes de lectura en cafés de Mumbai y pronto en otras ciudades del mundo.",
      q3: "¿Cómo funcionan los grupos de lectura?",
      a3: "Los grupos leen 2 o 3 capítulos por semana, compartiendo reflexiones semanales en sesiones virtuales o presenciales."
    },
    toast: {
      eventRegistered: "¡Te has registrado en \"La Psicología de la Toma de Decisiones\"!"
    },
    app: {
      main: "Principal",
      community: "Comunidad",
      personal: "Personal",
      dashboard: "Panel",
      library: "Mi Biblioteca",
      discover: "Descubrir",
      discussions: "Debates",
      groups: "Clubes de Lectura",
      journal: "Diario de Reflexión",
      profile: "Perfil",
      onboarding: "Bienvenido a Paradize",
      signOut: "Cerrar Sesión",
      newDiscussion: "Nuevo Debate",
      reader: "Lector"
    }
  },

  fr: {
    nav: {
      brand: "Paradize",
      tagline: "Lire. Réfléchir. Grandir. Ensemble.",
      home: "Accueil",
      community: "Communauté",
      discussions: "Discussions",
      events: "Événements",
      resources: "Ressources",
      aboutUs: "À Propos",
      login: "Connexion",
      joinNow: "Rejoindre",
      toggleMenu: "Menu",
      language: "Langue"
    },
    hero: {
      badge: "UNE COMMUNAUTÉ POUR ESPRITS CURIEUX",
      title1: "Lire pour Comprendre.",
      title2: "Débattre pour ",
      titleAccent: "Grandir.",
      subtitle: "Un espace pour les lecteurs désireux d'explorer des idées, partager des perspectives et grandir ensemble. Des livres variés. Des regards multiples. Un voyage d'élévation continue.",
      joinCommunity: "Rejoindre la Communauté",
      howItWorks: "Comment ça marche",
      quoteText: "Nous ne lisons pas pour être d'accord. Nous lisons pour comprendre.",
      quoteAuthor: "— Communauté Paradize",
      stats: {
        members: "10K+",
        membersLabel: "Lecteurs",
        discussions: "250+",
        discussionsLabel: "Discussions Actives",
        events: "50+",
        eventsLabel: "Événements Mensuels",
        cities: "25+",
        citiesLabel: "Villes (En personne)"
      }
    },
    pills: {
      discussions: {
        title: "Discussions Approfondies",
        desc: "Plongez dans des échanges soigneusement modérés qui nourrissent votre réflexion."
      },
      perspectives: {
        title: "Regards Multiples",
        desc: "Explorez chaque idée sous des angles divers et complémentaires."
      },
      genres: {
        title: "Genres Variés",
        desc: "De la fiction à la philosophie, des sciences à l'histoire : lisez ce qui vous élève."
      },
      growth: {
        title: "Croissance Personnelle",
        desc: "Suivez votre progression, consignez vos réflexions et devenez la meilleure version de vous-même."
      },
      events: {
        title: "Événements & Rencontres",
        desc: "Rejoignez des sessions en direct, en ligne ou en présentiel. Créez des liens durables."
      },
      cafes: {
        title: "Cafés Littéraires",
        desc: "Des conversations authentiques, un bon café et des liens enrichissants."
      }
    },
    showcase: {
      currentlyReading: "Lecture Collective en Cours",
      viewAll: "Tout voir",
      sapiensTitle: "Sapiens",
      sapiensSubtitle: "Une brève histoire de l'humanité",
      sapiensAuthor: "Yuval Noah Harari",
      chapterProgress: "Chapitre 6 sur 20",
      upcomingEvent: "Prochain Événement",
      liveDiscussion: "ÉCHANGE EN DIRECT",
      eventTitle: "La Psychologie de la Prise de Décision",
      eventDate: "Sam, 1 Juin 2024 • 19:00 IST",
      attendeesGoing: "+120 participants",
      joinEvent: "Participer",
      joined: "Inscrit !",
      testimonialsTitle: "Ce Que Disent Nos Membres",
      testimonialQuote: "Paradize a complètement transformé ma façon de lire et de penser. Les discussions sont bienveillantes, stimulantes et profondes.",
      testimonialAuthor: "Ananya P.",
      testimonialSince: "Membre depuis 2023",
      yourJourneyTitle: "Votre Parcours",
      booksRead: "Livres Lus",
      discussionsJoined: "Discussions Rejointes",
      insightsShared: "Idées Partagées",
      growthStreak: "Série Continue",
      weeks: "semaines",
      continueJourney: "Poursuivre Mon Parcours"
    },
    newsletter: {
      heading: "Des idées dans votre boîte. Du sens dans votre vie.",
      subheading: "Lectures de la semaine, synthèses de débats et invitations exclusives.",
      placeholder: "Votre adresse e-mail",
      subscribe: "S'inscrire",
      subscribing: "Inscription...",
      defaultSuccess: "Inscription validée ! Bienvenue au sein de Paradize.",
      invalidEmail: "Veuillez saisir une adresse e-mail valide.",
      connectError: "Échec de connexion. Veuillez réessayer."
    },
    footer: {
      copyright: "Communauté Paradize. Tous droits réservés.",
      quickLinks: "Liens Rapides",
      community: "Communauté",
      events: "Événements",
      resources: "Ressources",
      faq: "FAQ",
      contactUs: "Nous Contacter",
      motto: "Conçu pour les lecteurs. Porté par le dialogue."
    },
    howItWorks: {
      title: "Comment Fonctionne Paradize",
      subtitle: "Paradize repose sur un cycle harmonieux qui transforme chaque page en une compréhension durable.",
      step1Title: "Découvrez l'Essentiel",
      step1Desc: "Trouvez des ouvrages en accord avec votre curiosité intellectuelle et vos aspirations de développement.",
      step2Title: "Lisez et Réfléchissez en Privé",
      step2Desc: "Prenez des notes et formulez vos réflexions dans votre Journal Personnel.",
      step3Title: "Échangez et Grandissez Ensemble",
      step3Desc: "Participez à des groupes de lecture et à des cafés littéraires où la profondeur prime sur la rapidité.",
      cta: "Rejoindre la Communauté — Gratuitement"
    },
    faq: {
      title: "Questions Fréquemment Posées",
      q1: "L'accès à Paradize est-il gratuit ?",
      a1: "Oui, Paradize est 100 % gratuit pour les lecteurs. Notre communauté accueille tous les passionnés d'idées.",
      q2: "Où se déroulent les rencontres en présentiel ?",
      a2: "Nous organisons des rencontres à Mumbai (Bandra, Colaba, Powai) et préparons l'ouverture de nouveaux cercles.",
      q3: "Comment fonctionnent les cercles de lecture ?",
      a3: "Les membres lisent 2 à 3 chapitres par semaine et se réunissent pour échanger leurs réflexions."
    },
    toast: {
      eventRegistered: "Vous êtes inscrit à \"La Psychologie de la Prise de Décision\" !"
    },
    app: {
      main: "Principal",
      community: "Communauté",
      personal: "Personnel",
      dashboard: "Tableau de Bord",
      library: "Ma Bibliothèque",
      discover: "Découvrir",
      discussions: "Discussions",
      groups: "Cercles de Lecture",
      journal: "Journal de Réflexion",
      profile: "Profil",
      onboarding: "Bienvenue sur Paradize",
      signOut: "Déconnexion",
      newDiscussion: "Nouvelle Discussion",
      reader: "Lecteur"
    }
  },

  de: {
    nav: {
      brand: "Paradize",
      tagline: "Lesen. Reflektieren. Gemeinsam wachsen.",
      home: "Startseite",
      community: "Gemeinschaft",
      discussions: "Diskussionen",
      events: "Veranstaltungen",
      resources: "Ressourcen",
      aboutUs: "Über uns",
      login: "Anmelden",
      joinNow: "Beitreten",
      toggleMenu: "Menü",
      language: "Sprache"
    },
    hero: {
      badge: "EINE GEMEINSCHAFT FÜR NEUGIERIGE KÖPFE",
      title1: "Lesen, um zu Verstehen.",
      title2: "Diskutieren, um zu ",
      titleAccent: "Wachsen.",
      subtitle: "Ein Refugium für Leser, um Ideen zu erforschen, Sichtweisen zu teilen und gemeinsam zu wachsen. Unterschiedliche Bücher. Vielfältige Perspektiven. Ein Weg stetiger Entwicklung.",
      joinCommunity: "Der Gemeinschaft beitreten",
      howItWorks: "So funktioniert es",
      quoteText: "Wir lesen nicht, um zuzustimmen. Wir lesen, um zu verstehen.",
      quoteAuthor: "— Paradize Gemeinschaft",
      stats: {
        members: "10K+",
        membersLabel: "Mitglieder",
        discussions: "250+",
        discussionsLabel: "Aktive Diskussionen",
        events: "50+",
        eventsLabel: "Monatliche Events",
        cities: "25+",
        citiesLabel: "Städte (Vor Ort)"
      }
    },
    pills: {
      discussions: {
        title: "Tiefgründige Gespräche",
        desc: "Tauchen Sie in fundierte Diskussionen ein, die Denkanstöße geben."
      },
      perspectives: {
        title: "Vielfältige Perspektiven",
        desc: "Betrachten Sie jede Idee aus verschiedenen Blickwinkeln."
      },
      genres: {
        title: "Breites Themenspektrum",
        desc: "Von Belletristik bis Philosophie, von Wissenschaft bis Geschichte."
      },
      growth: {
        title: "Persönliche Reife",
        desc: "Dokumentieren Sie Ihren Weg und entfalten Sie Ihr volles Potenzial."
      },
      events: {
        title: "Events & Treffen",
        desc: "Nehmen Sie an Online- und Vor-Ort-Sitzungen teil. Knüpfen Sie echte Bande."
      },
      cafes: {
        title: "Lesecafés",
        desc: "Echte Gespräche, vorzüglicher Kaffee und bereichernde Begegnungen."
      }
    },
    showcase: {
      currentlyReading: "Aktuell gemeinsame Lektüre",
      viewAll: "Alle ansehen",
      sapiensTitle: "Sapiens",
      sapiensSubtitle: "Eine kurze Geschichte der Menschheit",
      sapiensAuthor: "Yuval Noah Harari",
      chapterProgress: "Kapitel 6 von 20",
      upcomingEvent: "Nächste Veranstaltung",
      liveDiscussion: "LIVE-GESPRÄCH",
      eventTitle: "Die Psychologie der Entscheidungsfindung",
      eventDate: "Sa, 1. Juni 2024 • 19:00 Uhr IST",
      attendeesGoing: "+120 Zusagen",
      joinEvent: "Teilnehmen",
      joined: "Angemeldet!",
      testimonialsTitle: "Stimmen aus der Community",
      testimonialQuote: "Paradize hat die Art, wie ich lese und nachdenke, grundlegend bereichert. Die Gespräche sind niveauvoll, respektvoll und inspirierend.",
      testimonialAuthor: "Ananya P.",
      testimonialSince: "Mitglied seit 2023",
      yourJourneyTitle: "Deine Entwicklung",
      booksRead: "Gelesene Bücher",
      discussionsJoined: "Geführte Diskussionen",
      insightsShared: "Geteilte Erkenntnisse",
      growthStreak: "Wachstumsfolge",
      weeks: "Wochen",
      continueJourney: "Reise fortsetzen"
    },
    newsletter: {
      heading: "Inspiration im Postfach. Wachstum im Leben.",
      subheading: "Wöchentliche Leseempfehlungen, Diskussions-Highlights und Einladungen.",
      placeholder: "E-Mail-Adresse eingeben",
      subscribe: "Abonnieren",
      subscribing: "Wird abonniert...",
      defaultSuccess: "Erfolgreich abonniert! Willkommen bei Paradize.",
      invalidEmail: "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
      connectError: "Verbindungsfehler. Bitte erneut versuchen."
    },
    footer: {
      copyright: "Paradize Community. Alle Rechte vorbehalten.",
      quickLinks: "Schnellzugriff",
      community: "Gemeinschaft",
      events: "Veranstaltungen",
      resources: "Ressourcen",
      faq: "Häufige Fragen",
      contactUs: "Kontakt",
      motto: "Für Leser gestaltet. Durch Gespräche belebt."
    },
    howItWorks: {
      title: "So funktioniert Paradize",
      subtitle: "Paradize folgt einem klaren Zyklus, der Buchseiten in nachhaltige Erkenntnis verwandelt.",
      step1Title: "Entdecken, was zählt",
      step1Desc: "Finden Sie Bücher, die zu Ihrer Neugier und Ihren individuellen Zielen passen.",
      step2Title: "Lesen & Privat reflektieren",
      step2Desc: "Halten Sie Kapitelnotizen in Ihrem persönlichen Tagebuch fest.",
      step3Title: "Austauschen & Gemeinsam wachsen",
      step3Desc: "Treffen Sie Gleichgesinnte in Lesekreisen und Cafés, wo Tiefe gewürdigt wird.",
      cta: "Der Community beitreten — Kostenlos"
    },
    faq: {
      title: "Häufig gestellte Fragen",
      q1: "Ist Paradize kostenlos?",
      a1: "Ja, die Nutzung von Paradize ist für Leserinnen und Leser zu 100 % kostenfrei.",
      q2: "Wo finden persönliche Treffen statt?",
      a2: "Wir treffen uns an Wochenenden in Mumbai und eröffnen fortlaufend neue Zirkel.",
      q3: "Wie sind die Lesekreise organisiert?",
      a3: "Wir lesen gemeinsam 2 bis 3 Kapitel pro Woche und tauschen unsere Erkenntnisse aus."
    },
    toast: {
      eventRegistered: "Sie sind für \"Die Psychologie der Entscheidungsfindung\" angemeldet!"
    },
    app: {
      main: "Hauptbereich",
      community: "Gemeinschaft",
      personal: "Persönlich",
      dashboard: "Übersicht",
      library: "Meine Bibliothek",
      discover: "Entdecken",
      discussions: "Diskussionen",
      groups: "Lesekreise",
      journal: "Reflexionstagebuch",
      profile: "Profil",
      onboarding: "Willkommen bei Paradize",
      signOut: "Abmelden",
      newDiscussion: "Neue Diskussion",
      reader: "Leser"
    }
  },

  bn: {
    nav: {
      brand: "প্যারাডাইজ",
      tagline: "পড়ুন। ভাবুন। একসাথে বাড়ুন।",
      home: "হোম",
      community: "কমিউনিটি",
      discussions: "আলোচনা",
      events: "অনুষ্ঠান",
      resources: "রিসোর্স",
      aboutUs: "আমাদের সম্পর্কে",
      login: "লগইন",
      joinNow: "যুক্ত হোন",
      toggleMenu: "মেনু",
      language: "ভাষা"
    },
    hero: {
      badge: "সন্ধিৎসু মনের জন্য একটি মুক্তাঙ্গন",
      title1: "বোঝার জন্য পড়ুন।",
      title2: "উত্তরণের জন্য ",
      titleAccent: "আলোচনা করুন।",
      subtitle: "পাঠকদের ভাবনা প্রকাশ, ভিন্ন দৃষ্টিভঙ্গি বিনিময় এবং একসাথে বিকাশের স্থান। বিভিন্ন বই। বহুমাত্রিক মতামত। আত্মোন্নয়নের অনন্য অভিযাত্রা।",
      joinCommunity: "কমিউনিটিতে যোগ দিন",
      howItWorks: "এটি কীভাবে কাজ করে",
      quoteText: "আমরা একমত হওয়ার জন্য পড়ি না। আমরা বোঝার জন্য পড়ি।",
      quoteAuthor: "— প্যারাডাইজ পরিবার",
      stats: {
        members: "10K+",
        membersLabel: "সদস্য",
        discussions: "250+",
        discussionsLabel: "চলমান আলোচনা",
        events: "50+",
        eventsLabel: "মাসিক আসর",
        cities: "25+",
        citiesLabel: "শহর (অফলাইন)"
      }
    },
    pills: {
      discussions: {
        title: "গভীর ভাবনামূলক আলোচনা",
        desc: "এমন সংলাপে অংশ নিন যা আপনার চিন্তাচেতনাকে প্রসারিত করে।"
      },
      perspectives: {
        title: "বহুমাত্রিক দৃষ্টিভঙ্গি",
        desc: "প্রতিটি ধারণাকে বিভিন্ন দৃষ্টিকোণ থেকে গভীরভাবে পরখ করুন।"
      },
      genres: {
        title: "বৈচিত্র্যময় সাহিত্য",
        desc: "সাহিত্য থেকে দর্শন, বিজ্ঞান থেকে ইতিহাস — যা আপনার মনকে সমৃদ্ধ করে।"
      },
      growth: {
        title: "ব্যক্তিগত উৎকর্ষ",
        desc: "আপনার পাঠপ্রক্রিয়া ট্র্যাক করুন, অন্তর্জ্ঞান সঞ্চয় করুন এবং নিজের সেরা রূপটি গড়ুন।"
      },
      events: {
        title: "অনুষ্ঠান ও আড্ডা",
        desc: "অনলাইন ও অফলাইন অধিবেশনে অংশ নিন। জানুন, শিখুন এবং আপন করে নিন।"
      },
      cafes: {
        title: "অফলাইন ক্যাফে",
        desc: "জীবন্ত কথপোকথন, চমৎকার কফি এবং আজীবনের আন্তরিক বন্ধুত্ব।"
      }
    },
    showcase: {
      currentlyReading: "বর্তমানে একসাথে পাঠ চলছে",
      viewAll: "সব দেখুন",
      sapiensTitle: "স্যাপিয়েন্স",
      sapiensSubtitle: "মানবজাতির সংক্ষিপ্ত ইতিহাস",
      sapiensAuthor: "ইউভাল নোয়া হারারি",
      chapterProgress: "অধ্যায় ৬ / ২০",
      upcomingEvent: "আসন্ন অধিবেশন",
      liveDiscussion: "সরাসরি সংলাপ",
      eventTitle: "সিদ্ধান্ত গ্রহণের মনস্তত্ত্ব",
      eventDate: "শনিবার, ১ জুন ২০২৪ • সন্ধ্যা ৭:০০ IST",
      attendeesGoing: "+১২০ জন যুক্ত হচ্ছেন",
      joinEvent: "অনুষ্ঠানে যোগ দিন",
      joined: "যুক্ত হয়েছেন!",
      testimonialsTitle: "সদস্যদের অনুভূতি",
      testimonialQuote: "প্যারাডাইজ আমার বই পড়ার এবং ভাবার ধরনকে সম্পূর্ণ বদলে দিয়েছে। এখানকার আলোচনা গভীর ও অনুপ্রেরণাদায়ক।",
      testimonialAuthor: "অনন্যা পি.",
      testimonialSince: "২০২৩ থেকে সদস্য",
      yourJourneyTitle: "আপনার পাঠযাত্রা",
      booksRead: "পঠিত বই",
      discussionsJoined: "অংশ নেওয়া আলোচনা",
      insightsShared: "শেয়ার করা ভাবনা",
      growthStreak: "ধারাবাহিকতা",
      weeks: "সপ্তাহ",
      continueJourney: "যাত্রা অব্যাহত রাখুন"
    },
    newsletter: {
      heading: "ইনবক্সে নতুন ভাবনা। জীবনে নতুন আলো।",
      subheading: "সাপ্তাহিক পঠিত বইয়ের নির্যাস এবং বিশেষ অধিবেশনের নিমন্ত্রণ।",
      placeholder: "আপনার ইমেল লিখুন",
      subscribe: "সাবস্ক্রাইব করুন",
      subscribing: "অপেক্ষা করুন...",
      defaultSuccess: "সফলভাবে যুক্ত হয়েছেন! প্যারাডাইজে আপনাকে স্বাগতম।",
      invalidEmail: "দয়া করে একটি সঠিক ইমেল ঠিকানা প্রদান করুন।",
      connectError: "সংযোগ ব্যর্থ হয়েছে। পুনরায় চেষ্টা করুন।"
    },
    footer: {
      copyright: "প্যারাডাইজ কমিউনিটি। সর্বস্বত্ব সংরক্ষিত।",
      quickLinks: "দ্রুত লিঙ্ক",
      community: "কমিউনিটি",
      events: "অনুষ্ঠান",
      resources: "রিসোর্স",
      faq: "সাধারণ জিজ্ঞাসা",
      contactUs: "যোগাযোগ",
      motto: "পাঠকদের জন্য নিবেদিত। প্রাণবন্ত সংলাপে উদ্ভাসিত।"
    },
    howItWorks: {
      title: "প্যারাডাইজ কীভাবে কাজ করে",
      subtitle: "প্যারাডাইজ একটি সহজ অথচ গভীর প্রক্রিয়ায় বইয়ের পাতাগুলোকে চিরস্থায়ী প্রজ্ঞায় রূপান্তর করে।",
      step1Title: "জরুরি বই সন্ধান করুন",
      step1Desc: "আপনার কৌতূহল ও লক্ষ্যের সাথে সঙ্গতিপূর্ণ বই খুঁজে নিন।",
      step2Title: "নিভৃতে পাঠ ও মনন",
      step2Desc: "ব্যক্তিগত জার্নালে গুরুত্বপূর্ণ অধ্যায়ের নোট ও প্রতিফলন লিপিবদ্ধ রাখুন।",
      step3Title: "একসাথে আলোচনা ও আত্মোন্নয়ন",
      step3Desc: "পাঠচক্রে ও ক্যাফে আড্ডায় যোগ দিন যেখানে চিন্তার গভীরতাকে উদযাপন করা হয়।",
      cta: "কমিউনিটিতে যোগ দিন — সম্পূর্ণ বিনামূল্যে"
    },
    faq: {
      title: "সাধারণ জিজ্ঞাসা",
      q1: "প্যারাডাইজে যোগ দেওয়া কি বিনামূল্যে?",
      a1: "হ্যাঁ, পাঠকদের জন্য প্যারাডাইজ শতভাগ বিনামূল্যে উন্মুক্ত।",
      q2: "অফলাইন বৈঠক কোথায় অনুষ্ঠিত হয়?",
      a2: "আমরা মুম্বাইতে সাপ্তাহিক রিডিং ক্যাফে আয়োজন করি এবং দ্রুত অন্যান্য শহরেও বিস্তার করছি।",
      q3: "পাঠচক্রগুলো কীভাবে পরিচালিত হয়?",
      a3: "গ্রুপগুলো প্রতি সপ্তাহে ২-৩টি অধ্যায় পড়ে এবং সপ্তাহান্তে গভীর আলোচনায় মিলিত হয়।"
    },
    toast: {
      eventRegistered: "আপনি \"সিদ্ধান্ত গ্রহণের মনস্তত্ত্ব\" অধিবেশনে সফলভাবে নিবন্ধিত হয়েছেন!"
    },
    app: {
      main: "প্রধান",
      community: "কমিউনিটি",
      personal: "ব্যক্তিগত",
      dashboard: "ড্যাশবোর্ড",
      library: "আমার লাইব্রেরি",
      discover: "আবিষ্কার",
      discussions: "আলোচনা",
      groups: "পাঠচক্র",
      journal: "ভাবনার জার্নাল",
      profile: "প্রোফাইল",
      onboarding: "প্যারাডাইজে স্বাগতম",
      signOut: "লগআউট",
      newDiscussion: "নতুন আলোচনা শুরু করুন",
      reader: "পাঠক"
    }
  }
};

