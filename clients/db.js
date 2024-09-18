import { PrismaClient } from "@prisma/client";

let db = undefined;

export function generateDbConnection(path) {
  if (!db) {
    db = new PrismaClient({
      datasources: {
        db: {
          url: `file:${path}`,
        },
      },
    });
  }
  return db;
}
