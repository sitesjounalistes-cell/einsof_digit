import type { Localized } from "@/lib/page-content";

/**
 * Habillage de la page article /blog/[slug] — le contenu de l'article
 * vient de la base (/api/posts) ; ce module porte uniquement les
 * libellés d'interface de la page, en 5 langues.
 */

export interface ArticleContent {
  /** libellé du lien retour vers /blog */
  back: string;
  /** libellé du temps de lecture (ex. « 4 min de lecture ») */
  readingMin: string;
  alsoTitle: string;
  alsoSub: string;
  notFoundTitle: string;
  notFoundText: string;
  backToList: string;
  loading: string;
  cta: {
    title: string;
    gold: string;
    primaryLabel: string;
    secondaryLabel: string;
  };
}

export const ARTICLE: Localized<ArticleContent> = {
  fr: {
    back: "Journal",
    readingMin: "min de lecture",
    alsoTitle: "Lire aussi",
    alsoSub: "Deux autres articles choisis pour aller plus loin sur le sujet.",
    notFoundTitle: "Article introuvable.",
    notFoundText:
      "Cet article n'existe pas ou n'est plus publié. Retrouvez l'ensemble de nos articles sur la page du journal.",
    backToList: "Retour au journal",
    loading: "Chargement de l'article…",
    cta: {
      title: "Un projet ?",
      gold: "Parlons-en.",
      primaryLabel: "Nous contacter",
      secondaryLabel: "Voir nos services",
    },
  },
  en: {
    back: "Journal",
    readingMin: "min read",
    alsoTitle: "Read more",
    alsoSub: "Two more articles chosen to go further on the topic.",
    notFoundTitle: "Article not found.",
    notFoundText:
      "This article does not exist or is no longer published. Find all of our articles on the journal page.",
    backToList: "Back to the journal",
    loading: "Loading the article…",
    cta: {
      title: "A project?",
      gold: "Let's talk about it.",
      primaryLabel: "Contact us",
      secondaryLabel: "See our services",
    },
  },
  es: {
    back: "Diario",
    readingMin: "min de lectura",
    alsoTitle: "Lea también",
    alsoSub: "Dos artículos más elegidos para profundizar en el tema.",
    notFoundTitle: "Artículo no encontrado.",
    notFoundText:
      "Este artículo no existe o ya no está publicado. Encuentre todos nuestros artículos en la página del diario.",
    backToList: "Volver al diario",
    loading: "Cargando el artículo…",
    cta: {
      title: "¿Un proyecto?",
      gold: "Hablemos de ello.",
      primaryLabel: "Contactarnos",
      secondaryLabel: "Ver nuestros servicios",
    },
  },
  zh: {
    back: "日志",
    readingMin: "分钟阅读",
    alsoTitle: "延伸阅读",
    alsoSub: "另外两篇精选文章，帮助您更深入地了解这个主题。",
    notFoundTitle: "找不到该文章。",
    notFoundText: "该文章不存在或已下线。请在日志页面查看我们的全部文章。",
    backToList: "返回日志",
    loading: "文章加载中…",
    cta: {
      title: "有项目？",
      gold: "聊聊吧。",
      primaryLabel: "联系我们",
      secondaryLabel: "查看我们的服务",
    },
  },
  de: {
    back: "Journal",
    readingMin: "Min. Lesezeit",
    alsoTitle: "Weiterlesen",
    alsoSub: "Zwei weitere Artikel, um tiefer in das Thema einzusteigen.",
    notFoundTitle: "Artikel nicht gefunden.",
    notFoundText:
      "Dieser Artikel existiert nicht oder wird nicht mehr veröffentlicht. Alle Artikel finden Sie auf der Journal-Seite.",
    backToList: "Zurück zum Journal",
    loading: "Artikel wird geladen…",
    cta: {
      title: "Ein Projekt?",
      gold: "Sprechen wir darüber.",
      primaryLabel: "Kontakt aufnehmen",
      secondaryLabel: "Unsere Services ansehen",
    },
  },
};
