import { PrismaClient } from "@prisma/client";
import { database_url } from "./envConfig.js";

export const prisma =
  new PrismaClient({
    datasources: { db: { url: database_url } },
});


export const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log("✅ PostgreSQL Connected Successfully!");
  } catch (error) {
    console.error("❌ Database Connection Error:", error);
    process.exit(1);
  }
};
