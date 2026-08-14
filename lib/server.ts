import { randomUUID } from "crypto";

export function nowIso() {
  return new Date().toISOString();
}

export function createServerId() {
  return randomUUID();
}
