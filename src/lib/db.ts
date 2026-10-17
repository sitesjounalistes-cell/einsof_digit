import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

/* Garde de fraîcheur : si l'instance en cache provient d'une génération
 * Prisma ANTÉRIEURE au modèle SoftwareLink (client régénéré après le
 * démarrage du serveur), on la remplace par une instance construite
 * depuis le client régénéré — évite un redémarrage après `prisma generate`
 * et une erreur « softwareLink is undefined » à l'exécution. */
const cached = globalForPrisma.prisma;
if (
  cached &&
  typeof (cached as unknown as Record<string, unknown>).softwareLink !== "object"
) {
  void cached.$disconnect().catch(() => {});
  globalForPrisma.prisma = undefined;
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
