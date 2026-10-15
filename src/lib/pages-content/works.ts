import type { Lang } from "@/lib/i18n/translations";
import type { Localized } from "@/lib/page-content";

/**
 * Travaux réels fournis par le client (sites livrés, liens vérifiés le 2025).
 * Règle anti-invention : chaque entrée provient d'un lien communiqué par
 * le client ; le descriptif reprend le titre / la méta-description du site
 * lui-même. Captures d'écran réelles : /images/works/*.jpg
 */

export interface WorkEntry {
  /** identifiant stable (nom de fichier capture, etc.) */
  slug: string;
  /** nom de marque tel qu'affiché par le site lui-même */
  name: string;
  url: string;
  domain: string;
  /** capture d'écran pleine page (aperçu animé au survol) */
  shot: string;
  /** logo téléchargé depuis le site — null → texte typographique */
  logo: string | null;
  /** secteur, par langue */
  sector: Record<Lang, string>;
  /** description courte fidèle au site, par langue */
  desc: Record<Lang, string>;
}

export const WORKS: WorkEntry[] = [
  {
    slug: "captis",
    name: "Captis",
    url: "https://www.captisguinee.com/",
    domain: "captisguinee.com",
    shot: "/images/works/captis.jpg",
    logo: "/logos/captis.svg",
    sector: {
      fr: "Communication 360°",
      en: "360° Communication",
      es: "Comunicación 360°",
      zh: "360° 传播机构",
      de: "360°-Kommunikation",
    },
    desc: {
      fr: "Agence de communication 360° : une vitrine en ligne qui présente l'offre de services et ouvre le contact.",
      en: "A 360° communication agency: an online showcase presenting the service offer and opening the contact.",
      es: "Agencia de comunicación 360°: una vitrina en línea que presenta la oferta de servicios y abre el contacto.",
      zh: "360° 传播机构：在线展示服务项目并开启业务联系的展示窗口。",
      de: "Eine 360°-Kommunikationsagentur: ein Online-Auftritt, der das Leistungsangebot präsentiert und den Kontakt öffnet.",
    },
  },
  {
    slug: "ecometus",
    name: "Ecometus Guinée",
    url: "https://www.ecometusguinee.online/",
    domain: "ecometusguinee.online",
    shot: "/images/works/ecometus.jpg",
    logo: "/logos/ecometus.png",
    sector: {
      fr: "Industrie & BTP",
      en: "Industry & Construction",
      es: "Industria y construcción",
      zh: "工业与建筑",
      de: "Industrie & Bau",
    },
    desc: {
      fr: "Construction métallique, tuyauterie industrielle, soudure, BTP et ingénierie en Guinée.",
      en: "Metal construction, industrial piping, welding, construction and engineering in Guinea.",
      es: "Construcción metálica, tubería industrial, soldadura, construcción e ingeniería en Guinea.",
      zh: "几内亚的金属结构制造、工业管道、焊接、建筑与工程服务。",
      de: "Metallbau, Industrie-Rohrleitungen, Schweißarbeiten, Bau und Ingenieurwesen in Guinea.",
    },
  },
  {
    slug: "interseas",
    name: "Inter Seas Logistique",
    url: "https://www.interseaslogistic.online/",
    domain: "interseaslogistic.online",
    shot: "/images/works/interseas.jpg",
    logo: null,
    sector: {
      fr: "Logistique & transit",
      en: "Logistics & Transit",
      es: "Logística y tránsito",
      zh: "物流与清关",
      de: "Logistik & Transit",
    },
    desc: {
      fr: "Transit douanier, logistique, consignation maritime et location d'engins — partenaire de confiance en Guinée.",
      en: "Customs transit, logistics, maritime consignation and equipment rental — a trusted partner in Guinea.",
      es: "Tránsito aduanero, logística, consignación marítima y alquiler de equipos: socio de confianza en Guinea.",
      zh: "几内亚值得信赖的合作伙伴：报关转运、物流、海事代理与设备租赁。",
      de: "Zolltransit, Logistik, Seefracht-Konsignation und Gerätevermietung — ein vertrauenswürdiger Partner in Guinea.",
    },
  },
  {
    slug: "emrod",
    name: "EMROD",
    url: "https://www.emroddf.com/",
    domain: "emroddf.com",
    shot: "/images/works/emrod.jpg",
    logo: null,
    sector: {
      fr: "Artisanat & mobilier",
      en: "Craft & Furniture",
      es: "Artesanía y mobiliario",
      zh: "工艺与家具",
      de: "Handwerk & Möbel",
    },
    desc: {
      fr: "Création artisanale de mobilier d'exception sur mesure à Conakry : menuiserie haut de gamme et aménagement intérieur.",
      en: "Artisanal creation of bespoke exceptional furniture in Conakry: high-end joinery and interior design.",
      es: "Creación artesanal de mobiliario de excepción a medida en Conakri: carpintería de alta gama e interiorismo.",
      zh: "科纳克里的定制精品家具工坊：高端木作与室内空间设计。",
      de: "Handwerkliche Fertigung maßgeschneiderter Möbel in Conakry: hochwertige Schreinerei und Innenausbau.",
    },
  },
  {
    slug: "referencemedia",
    name: "Referencemedia",
    url: "https://www.referencemedia.online/",
    domain: "referencemedia.online",
    shot: "/images/works/referencemedia.jpg",
    logo: "/logos/referencemedia.png",
    sector: {
      fr: "Portail d'information",
      en: "Information Portal",
      es: "Portal de información",
      zh: "资讯门户",
      de: "Informationsportal",
    },
    desc: {
      fr: "Portail éditorial : sciences, histoire, technologie, santé, culture, société, économie et nature — des dossiers rigoureux et sourcés.",
      en: "Editorial portal: science, history, technology, health, culture, society, economy and nature — rigorous, well-sourced features.",
      es: "Portal editorial: ciencias, historia, tecnología, salud, cultura, sociedad, economía y naturaleza: dossieres rigurosos y documentados.",
      zh: "编辑型门户：科学、历史、科技、健康、文化、社会、经济与自然——严谨且有据可查的专题报道。",
      de: "Redaktionelles Portal: Wissenschaft, Geschichte, Technologie, Gesundheit, Kultur, Gesellschaft, Wirtschaft und Natur — fundierte, belegte Dossiers.",
    },
  },
  {
    slug: "fmk224",
    name: "FMK224",
    url: "https://www.fmk224.online/",
    domain: "fmk224.online",
    shot: "/images/works/fmk224.jpg",
    logo: "/logos/fmk224.png",
    sector: {
      fr: "Média d'actualité",
      en: "News Media",
      es: "Medio de noticias",
      zh: "新闻媒体",
      de: "Nachrichtenmedien",
    },
    desc: {
      fr: "Toute l'actualité de la Guinée : reportages, enquêtes et directs — « Voir Vrai • Dire Vrai • Informer Juste ».",
      en: "All the news from Guinea: reports, investigations and live coverage — \"See True • Speak True • Inform Right\".",
      es: "Toda la actualidad de Guinea: reportajes, investigaciones y directos: «Ver Verdad • Decir Verdad • Informar Justo».",
      zh: "几内亚全部新闻：报道、调查与直播——「见真实・言真实・报公正」。",
      de: "Alle Nachrichten aus Guinea: Reportagen, Recherchen und Live-Berichte — „Wahr sehen • Wahr sprechen • Richtig informieren“.",
    },
  },
  {
    slug: "topguinee",
    name: "Topguinee",
    url: "https://www.topguinee.online/",
    domain: "topguinee.online",
    shot: "/images/works/topguinee.jpg",
    logo: "/logos/topguinee.png",
    sector: {
      fr: "Média d'actualité",
      en: "News Media",
      es: "Medio de noticias",
      zh: "新闻媒体",
      de: "Nachrichtenmedien",
    },
    desc: {
      fr: "Actualité de la Guinée et du monde : politique, économie, société, sport, culture — flash info en continu, podcasts et chroniques FM.",
      en: "News from Guinea and the world: politics, economy, society, sport, culture — continuous news flashes, podcasts and FM chronicles.",
      es: "Actualidad de Guinea y del mundo: política, economía, sociedad, deporte, cultura: flashes informativos continuos, pódcast y crónicas FM.",
      zh: "几内亚及国际新闻：政治、经济、社会、体育、文化——全天候快讯、播客与 FM 专栏。",
      de: "Nachrichten aus Guinea und der Welt: Politik, Wirtschaft, Gesellschaft, Sport, Kultur — laufende Blitzeinmeldungen, Podcasts und FM-Kolumnen.",
    },
  },
  {
    slug: "samoumedia",
    name: "Samou Média",
    url: "https://www.samoumedia.com/",
    domain: "samoumedia.com",
    shot: "/images/works/samoumedia.jpg",
    logo: "/logos/samoumedia.jpg",
    sector: {
      fr: "Média d'actualité",
      en: "News Media",
      es: "Medio de noticias",
      zh: "新闻媒体",
      de: "Nachrichtenmedien",
    },
    desc: {
      fr: "Informer, éclairer, rassembler : l'actualité de Samou Benty, Forécariah et de la Guinée en continu.",
      en: "Inform, enlighten, bring together: the news of Samou Benty, Forécariah and Guinea, around the clock.",
      es: "Informar, iluminar, reunir: la actualidad de Samou Benty, Forécariah y Guinea en continuo.",
      zh: "传递信息、启迪民智、凝聚人心：全天候报道 Samou Benty、Forécariah 及几内亚的新闻。",
      de: "Informieren, erhellen, verbinden: die Nachrichten aus Samou Benty, Forécariah und Guinea — rund um die Uhr.",
    },
  },
];
