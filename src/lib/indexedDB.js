import { openDB } from "idb";

const STORE_NAME = "students";
const DB_NAME = "attendanceDB";

export async function initDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("students")) {
        const store = db.createObjectStore("students", { keyPath: "id", autoIncrement: true });
        store.createIndex("className", "className", { unique: false });
      }

      if (!db.objectStoreNames.contains("attendance")) {
        const store = db.createObjectStore("attendance", { keyPath: "id", autoIncrement: true });
        store.createIndex("studentId", "studentId", { unique: false });
        store.createIndex("date", "date", { unique: false });
      }
    },
  });
}


export async function saveStudentOffline(student) {
  const db = await initDB();
  await db.add(STORE_NAME, { ...student, synced: false, createdAt: Date.now() });
}

export async function getUnsyncedStudents() {
  const db = await initDB();
  const all = await db.getAll(STORE_NAME);
  return all.filter((s) => !s.synced);
}

export async function markAsSynced(id) {
  const db = await initDB();
  const student = await db.get(STORE_NAME, id);
  if (student) {
    student.synced = true;
    await db.put(STORE_NAME, student);
  }
}


export async function getAllStudentsOffline(className = null) {
  const db = await initDB();
  const all = await db.getAll(STORE_NAME);
  if (className) {
    return all.filter((s) => s.className === className);
  }
  return all;
}


export async function saveAttendanceOffline(attendance) {
  const db = await initDB();
  await db.add("attendance", { ...attendance, synced: false, createdAt: Date.now() });
}

export async function getUnsyncedAttendance() {
  const db = await initDB();
  const all = await db.getAll("attendance");
  return all.filter((a) => !a.synced);
}

export async function markAttendanceSynced(id) {
  const db = await initDB();
  const record = await db.get("attendance", id);
  if (record) {
    record.synced = true;
    await db.put("attendance", record);
  }
}
