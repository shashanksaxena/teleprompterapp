import { MongoClient } from "mongodb";
import { randomBytes, scryptSync } from "node:crypto";

const globalForMongo = globalThis as typeof globalThis & {
  mongoClientPromise?: Promise<MongoClient>;
};

function getMongoUri() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("Missing MONGODB_URI environment variable.");
  }

  return uri;
}

export function getMongoClient() {
  if (!globalForMongo.mongoClientPromise) {
    const client = new MongoClient(getMongoUri());
    globalForMongo.mongoClientPromise = client.connect();
  }

  return globalForMongo.mongoClientPromise;
}

export function createAdminPasswordHash(password: string) {
  const salt = randomBytes(16).toString("hex");
  return `${salt}:${scryptSync(password, salt, 64).toString("hex")}`;
}

export async function getDb() {
  const client = await getMongoClient();
  return client.db(process.env.MONGODB_DB || "simplepos");
}

export async function getTeleprompterCollection() {
  const db = await getDb();
  return db.collection("teleprompter");
}
