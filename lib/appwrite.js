import {
  Account,
  Avatars,
  Client,
  ID,
  Locale,
  TablesDB,
} from "react-native-appwrite";

const APPWRITE_ENDPOINT =
  process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT ?? "https://cloud.appwrite.io/v1";
const APPWRITE_PROJECT_ID =
  process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID ?? "69f8a9b10028abe91f1d";
const APPWRITE_PROJECT_NAME =
  process.env.EXPO_PUBLIC_APPWRITE_PROJECT_NAME ?? "URSApp";
const APPWRITE_PLATFORM =
  process.env.EXPO_PUBLIC_APPWRITE_PLATFORM ?? "com.hamza.urs";
const APPWRITE_DATABASE_ID =
  process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID ??
  process.env.EXPO_PUBLIC_APPWRITE_DB_ID;
const APPWRITE_CLASSES_TABLE_ID =
  process.env.EXPO_PUBLIC_APPWRITE_CLASSES_TABLE_ID ??
  process.env.EXPO_PUBLIC_APPWRITE_TABLE_CLASSES ??
  process.env.EXPO_PUBLIC_APPWRITE_CLASSES_COLLECTION_ID;
const APPWRITE_TASKS_TABLE_ID =
  process.env.EXPO_PUBLIC_APPWRITE_TASKS_TABLE_ID ??
  process.env.EXPO_PUBLIC_APPWRITE_TABLE_TASKS ??
  process.env.EXPO_PUBLIC_APPWRITE_TASKS_COLLECTION_ID;

export const client = new Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID)
  .setPlatform(APPWRITE_PLATFORM);

export const account = new Account(client);
export const avatars = new Avatars(client);
export const tablesDB = new TablesDB(client);
export const locale = new Locale(client);

export async function pingAppwrite() {
  try {
    const response = await locale.get();
    console.log(`Appwrite ping (${APPWRITE_PROJECT_NAME}) success:`, response);
    return true;
  } catch (error) {
    console.error(`Appwrite ping (${APPWRITE_PROJECT_NAME}) failed:`, error);
    return false;
  }
}

function requireDatabaseConfig() {
  if (!APPWRITE_DATABASE_ID || !APPWRITE_CLASSES_TABLE_ID) {
    throw new Error(
      "Missing Appwrite classes config. Add EXPO_PUBLIC_APPWRITE_DATABASE_ID and EXPO_PUBLIC_APPWRITE_CLASSES_TABLE_ID (or EXPO_PUBLIC_APPWRITE_CLASSES_COLLECTION_ID) to .env",
    );
  }
}

function requireTasksCollectionConfig() {
  if (!APPWRITE_DATABASE_ID || !APPWRITE_TASKS_TABLE_ID) {
    throw new Error(
      "Missing Appwrite tasks config. Add EXPO_PUBLIC_APPWRITE_DATABASE_ID and EXPO_PUBLIC_APPWRITE_TASKS_TABLE_ID (or EXPO_PUBLIC_APPWRITE_TASKS_COLLECTION_ID) to .env",
    );
  }
}

export async function saveClassToAppwrite({
  name,
  instructor,
  date,
  classroom,
  color,
  userId,
}) {
  requireDatabaseConfig();
  console.log("Appwrite classes target:", {
    projectId: APPWRITE_PROJECT_ID,
    databaseId: APPWRITE_DATABASE_ID,
    tableId: APPWRITE_CLASSES_TABLE_ID,
  });

  return tablesDB.createRow(
    APPWRITE_DATABASE_ID,
    APPWRITE_CLASSES_TABLE_ID,
    ID.unique(),
    {
      name,
      instructor,
      date,
      classroom,
      color,
      userid: userId,
    },
  );
}

export async function saveTaskToAppwrite({
  name,
  subject,
  dueDate,
  priority,
  color,
  userId,
}) {
  requireTasksCollectionConfig();
  console.log("Appwrite tasks target:", {
    projectId: APPWRITE_PROJECT_ID,
    databaseId: APPWRITE_DATABASE_ID,
    tableId: APPWRITE_TASKS_TABLE_ID,
  });

  return tablesDB.createRow(
    APPWRITE_DATABASE_ID,
    APPWRITE_TASKS_TABLE_ID,
    ID.unique(),
    {
      name,
      subject,
      dueDate,
      priority,
      color: color ?? "#f5c542",
      userid: userId,
    },
  );
}

export async function updateClassRowInAppwrite({
  rowId,
  name,
  instructor,
  date,
  classroom,
  color,
  userId,
}) {
  requireDatabaseConfig();
  return tablesDB.updateRow({
    databaseId: APPWRITE_DATABASE_ID,
    tableId: APPWRITE_CLASSES_TABLE_ID,
    rowId,
    data: {
      name,
      instructor,
      date,
      classroom,
      color,
      userid: userId,
    },
  });
}

export async function updateTaskRowInAppwrite({
  rowId,
  name,
  subject,
  dueDate,
  priority,
  color,
  userId,
}) {
  requireTasksCollectionConfig();
  return tablesDB.updateRow({
    databaseId: APPWRITE_DATABASE_ID,
    tableId: APPWRITE_TASKS_TABLE_ID,
    rowId,
    data: {
      name,
      subject,
      dueDate,
      priority,
      color: color ?? "#f5c542",
      userid: userId,
    },
  });
}

export async function deleteClassRowFromAppwrite(rowId) {
  if (!rowId) return;
  requireDatabaseConfig();
  await tablesDB.deleteRow({
    databaseId: APPWRITE_DATABASE_ID,
    tableId: APPWRITE_CLASSES_TABLE_ID,
    rowId,
  });
}

export async function deleteTaskRowFromAppwrite(rowId) {
  if (!rowId) return;
  requireTasksCollectionConfig();
  await tablesDB.deleteRow({
    databaseId: APPWRITE_DATABASE_ID,
    tableId: APPWRITE_TASKS_TABLE_ID,
    rowId,
  });
}