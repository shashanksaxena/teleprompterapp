"use client";

const DB_NAME = "freeteleprompter-recordings";
const STORE_NAME = "recordings";
const RECORDING_KEY = "latest";

type RecordingEntry = {
  id: string;
  blob: Blob;
  durationSeconds: number;
  createdAt: string;
};

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onerror = () => reject(request.error);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
  });
}

async function withStore<T>(mode: IDBTransactionMode, callback: (store: IDBObjectStore) => void): Promise<T> {
  const db = await openDb();

  return new Promise<T>((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, mode);
    const store = transaction.objectStore(STORE_NAME);

    callback(store);

    transaction.oncomplete = () => {
      db.close();
      resolve(undefined as T);
    };
    transaction.onerror = () => {
      db.close();
      reject(transaction.error);
    };
    transaction.onabort = () => {
      db.close();
      reject(transaction.error);
    };
  });
}

export async function saveLatestRecording(blob: Blob, durationSeconds: number) {
  if (typeof window === "undefined" || typeof indexedDB === "undefined") {
    return;
  }

  const entry: RecordingEntry = {
    id: RECORDING_KEY,
    blob,
    durationSeconds,
    createdAt: new Date().toISOString()
  };

  await withStore<void>("readwrite", (store) => {
    store.put(entry);
  });
}

export async function readLatestRecording(): Promise<RecordingEntry | null> {
  if (typeof window === "undefined" || typeof indexedDB === "undefined") {
    return null;
  }

  const db = await openDb();

  return new Promise<RecordingEntry | null>((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(RECORDING_KEY);

    request.onsuccess = () => {
      resolve((request.result as RecordingEntry | undefined) ?? null);
    };
    request.onerror = () => reject(request.error);
    transaction.oncomplete = () => db.close();
    transaction.onerror = () => {
      db.close();
      reject(transaction.error);
    };
  });
}

export async function clearLatestRecording() {
  if (typeof window === "undefined" || typeof indexedDB === "undefined") {
    return;
  }

  await withStore<void>("readwrite", (store) => {
    store.delete(RECORDING_KEY);
  });
}
