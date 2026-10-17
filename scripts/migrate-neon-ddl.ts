/**
 * Création du schéma PostgreSQL (Neon) — DDL équivalent à `prisma db push`
 * (mêmes conventions de types : TEXT, TIMESTAMP(3) sans fuseau, BOOLEAN,
 * SERIAL pour autoincrement ; DB-level defaults uniquement pour now() et
 * les scalaires statiques, comme Prisma).
 *
 * Usage : bun scripts/migrate-neon-ddl.ts
 */
import { SQL } from "bun";

const url = process.env.DATABASE_URL;
if (!url) { console.error("DATABASE_URL manquant"); process.exit(1); }
const sql = new SQL(url);

const DDL = `
-- Nettoyage (base neuve ou re-migration)
DROP TABLE IF EXISTS "DemoBooking" CASCADE;
DROP TABLE IF EXISTS "DemoSlot" CASCADE;
DROP TABLE IF EXISTS "PushSubscription" CASCADE;
DROP TABLE IF EXISTS "EmailLog" CASCADE;
DROP TABLE IF EXISTS "Setting" CASCADE;
DROP TABLE IF EXISTS "NotificationLog" CASCADE;
DROP TABLE IF EXISTS "Podcast" CASCADE;
DROP TABLE IF EXISTS "Testimonial" CASCADE;
DROP TABLE IF EXISTS "Partner" CASCADE;
DROP TABLE IF EXISTS "SoftwareLink" CASCADE;
DROP TABLE IF EXISTS "SiteSettings" CASCADE;
DROP TABLE IF EXISTS "Document" CASCADE;
DROP TABLE IF EXISTS "PortfolioCategory" CASCADE;
DROP TABLE IF EXISTS "Project" CASCADE;
DROP TABLE IF EXISTS "BlogPost" CASCADE;
DROP TABLE IF EXISTS "AnalyticsEvent" CASCADE;
DROP TABLE IF EXISTS "Consent" CASCADE;
DROP TABLE IF EXISTS "ChatMessage" CASCADE;
DROP TABLE IF EXISTS "ChatSession" CASCADE;
DROP TABLE IF EXISTS "ContactMessage" CASCADE;
DROP TABLE IF EXISTS "TrialRequest" CASCADE;
DROP TABLE IF EXISTS "LeadEvent" CASCADE;
DROP TABLE IF EXISTS "Lead" CASCADE;

CREATE TABLE "Lead" (
  "id" TEXT NOT NULL,
  "firstName" TEXT NOT NULL,
  "lastName" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "email" TEXT,
  "company" TEXT,
  "sector" TEXT,
  "message" TEXT,
  "source" TEXT NOT NULL DEFAULT 'contact',
  "status" TEXT NOT NULL DEFAULT 'new',
  "interests" TEXT,
  "locale" TEXT NOT NULL DEFAULT 'fr',
  "consentContact" BOOLEAN NOT NULL DEFAULT false,
  "consentAt" TIMESTAMP(3),
  "notes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "LeadEvent" (
  "id" TEXT NOT NULL,
  "leadId" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "data" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "LeadEvent_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "TrialRequest" (
  "id" TEXT NOT NULL,
  "leadId" TEXT NOT NULL,
  "saasSlug" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'requested',
  "trialDays" INTEGER NOT NULL DEFAULT 7,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "TrialRequest_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ContactMessage" (
  "id" TEXT NOT NULL,
  "leadId" TEXT NOT NULL,
  "subject" TEXT,
  "message" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'new',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ContactMessage_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ChatSession" (
  "id" TEXT NOT NULL,
  "visitorId" TEXT NOT NULL,
  "locale" TEXT NOT NULL DEFAULT 'fr',
  "mode" TEXT NOT NULL DEFAULT 'text',
  "entryPath" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "endedAt" TIMESTAMP(3),
  CONSTRAINT "ChatSession_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ChatMessage" (
  "id" SERIAL NOT NULL,
  "sessionId" TEXT NOT NULL,
  "role" TEXT NOT NULL,
  "content" TEXT,
  "feedback" INTEGER,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ChatMessage_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Consent" (
  "id" TEXT NOT NULL,
  "visitorId" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "granted" BOOLEAN NOT NULL,
  "locale" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Consent_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AnalyticsEvent" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "props" TEXT,
  "path" TEXT,
  "locale" TEXT,
  "visitorId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "AnalyticsEvent_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "BlogPost" (
  "id" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "excerpt" TEXT NOT NULL,
  "body" TEXT NOT NULL,
  "category" TEXT NOT NULL DEFAULT 'agence',
  "readingMin" INTEGER NOT NULL DEFAULT 3,
  "isPublished" BOOLEAN NOT NULL DEFAULT false,
  "publishedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "metaTitle" TEXT,
  "metaDescription" TEXT,
  "keywords" TEXT,
  "adsJson" TEXT NOT NULL DEFAULT '[]',
  "coverImageUrl" TEXT,
  "isFeatured" BOOLEAN NOT NULL DEFAULT false,
  "videoUrl" TEXT,
  CONSTRAINT "BlogPost_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PortfolioCategory" (
  "id" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "nameJson" TEXT NOT NULL,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "PortfolioCategory_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Project" (
  "id" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "client" TEXT,
  "sector" TEXT,
  "year" INTEGER NOT NULL,
  "summary" TEXT NOT NULL,
  "description" TEXT,
  "linkUrl" TEXT,
  "imageUrl" TEXT,
  "categoryId" TEXT,
  "isPublished" BOOLEAN NOT NULL DEFAULT false,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "SiteSettings" (
  "id" TEXT NOT NULL DEFAULT 'singleton',
  "phonesJson" TEXT NOT NULL DEFAULT '[]',
  "emailsJson" TEXT NOT NULL DEFAULT '[]',
  "socialsJson" TEXT NOT NULL DEFAULT '[]',
  "managerPhotoUrl" TEXT,
  "managerPhotoAlt" TEXT,
  "managerMessageJson" TEXT,
  "managerName" TEXT,
  "managerRole" TEXT,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "SiteSettings_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "SoftwareLink" (
  "slug" TEXT NOT NULL,
  "demoUrl" TEXT,
  "videoUrl" TEXT,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "SoftwareLink_pkey" PRIMARY KEY ("slug")
);

CREATE TABLE "Partner" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "logoUrl" TEXT,
  "websiteUrl" TEXT,
  "description" TEXT,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Partner_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Testimonial" (
  "id" TEXT NOT NULL,
  "authorName" TEXT NOT NULL,
  "authorRole" TEXT,
  "company" TEXT,
  "sector" TEXT,
  "quote" TEXT NOT NULL,
  "rating" INTEGER,
  "authorPhotoUrl" TEXT,
  "videoUrl" TEXT,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "isPublished" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Testimonial_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Podcast" (
  "id" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "titleJson" TEXT NOT NULL,
  "descriptionJson" TEXT,
  "audioUrl" TEXT NOT NULL,
  "sourceUrl" TEXT,
  "durationSec" INTEGER,
  "coverImageUrl" TEXT,
  "isPublished" BOOLEAN NOT NULL DEFAULT false,
  "publishedAt" TIMESTAMP(3),
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Podcast_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "NotificationLog" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "body" TEXT NOT NULL,
  "url" TEXT,
  "kind" TEXT NOT NULL DEFAULT 'promo',
  "sentTo" INTEGER NOT NULL DEFAULT 0,
  "delivered" INTEGER NOT NULL DEFAULT 0,
  "failed" INTEGER NOT NULL DEFAULT 0,
  "opened" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "NotificationLog_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Document" (
  "id" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "category" TEXT,
  "fileUrl" TEXT NOT NULL,
  "fileKind" TEXT,
  "visibility" TEXT NOT NULL DEFAULT 'public',
  "isPublished" BOOLEAN NOT NULL DEFAULT false,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "EmailLog" (
  "id" TEXT NOT NULL,
  "toEmail" TEXT NOT NULL,
  "subject" TEXT NOT NULL,
  "template" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "provider" TEXT NOT NULL DEFAULT 'mock',
  "error" TEXT,
  "leadId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "EmailLog_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PushSubscription" (
  "id" TEXT NOT NULL,
  "endpoint" TEXT NOT NULL,
  "p256dh" TEXT NOT NULL,
  "auth" TEXT NOT NULL,
  "locale" TEXT,
  "visitorId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "PushSubscription_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Setting" (
  "key" TEXT NOT NULL,
  "value" TEXT NOT NULL,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Setting_pkey" PRIMARY KEY ("key")
);

CREATE TABLE "DemoSlot" (
  "id" TEXT NOT NULL,
  "startsAt" TIMESTAMP(3) NOT NULL,
  "capacity" INTEGER NOT NULL DEFAULT 1,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "DemoSlot_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "DemoBooking" (
  "id" TEXT NOT NULL,
  "slotId" TEXT NOT NULL,
  "leadId" TEXT NOT NULL,
  "saasSlug" TEXT,
  "status" TEXT NOT NULL DEFAULT 'confirmed',
  "locale" TEXT NOT NULL DEFAULT 'fr',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "DemoBooking_pkey" PRIMARY KEY ("id")
);

-- Index uniques
CREATE UNIQUE INDEX "TrialRequest_leadId_saasSlug_key" ON "TrialRequest"("leadId", "saasSlug");
CREATE UNIQUE INDEX "BlogPost_slug_key" ON "BlogPost"("slug");
CREATE UNIQUE INDEX "PortfolioCategory_slug_key" ON "PortfolioCategory"("slug");
CREATE UNIQUE INDEX "Project_slug_key" ON "Project"("slug");
CREATE UNIQUE INDEX "SoftwareLink_slug_key" ON "SoftwareLink"("slug");
CREATE UNIQUE INDEX "Podcast_slug_key" ON "Podcast"("slug");
CREATE UNIQUE INDEX "Document_slug_key" ON "Document"("slug");
CREATE UNIQUE INDEX "PushSubscription_endpoint_key" ON "PushSubscription"("endpoint");

-- Clés étrangères (mêmes comportements que le schéma Prisma)
ALTER TABLE "LeadEvent" ADD CONSTRAINT "LeadEvent_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TrialRequest" ADD CONSTRAINT "TrialRequest_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ContactMessage" ADD CONSTRAINT "ContactMessage_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "ChatSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Project" ADD CONSTRAINT "Project_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "PortfolioCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "DemoBooking" ADD CONSTRAINT "DemoBooking_slotId_fkey" FOREIGN KEY ("slotId") REFERENCES "DemoSlot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "DemoBooking" ADD CONSTRAINT "DemoBooking_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
`;

async function main() {
  await sql.unsafe(DDL);
  const tables = await sql`SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename`;
  console.log(`Schéma créé : ${tables.length} tables`);
  for (const t of tables) console.log("  -", t.tablename);
  await sql.end();
}

main().catch((e) => { console.error("ÉCHEC DDL:", String(e).slice(0, 500)); process.exit(1); });
