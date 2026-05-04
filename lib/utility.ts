import * as SecureStore from "expo-secure-store";

export function buildAlarmDate(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
) {
  return new Date(year, month - 1, day, hour, minute, 0, 0);
}

export function formatAlarmDate(date: Date) {
  return date.toISOString();
}

export async function saveClasses(classes: Classes[], userId: string): Promise<boolean> {
  try {
    const jsonValue = JSON.stringify(classes);
    await SecureStore.setItemAsync(`user_classes_${userId}`, jsonValue);
    return true;
  } catch (e) {
    console.error("Failed to save classes:", e);
    return false;
  }
}

export async function loadClasses(userId: string): Promise<Classes[]> {
  try {
    const jsonValue = await SecureStore.getItemAsync(`user_classes_${userId}`);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error("Failed to load classes:", e);
    return [];
  }
}

export async function saveTheme(theme: "light" | "dark", userId: string) {
  try {
    await SecureStore.setItemAsync(`user_theme_${userId}`, theme);
  } catch (e) {
    console.error("Failed to save theme:", e);
  }
}

export async function loadTheme(
  userId: string,
): Promise<"light" | "dark" | null> {
  try {
    const theme = await SecureStore.getItemAsync(`user_theme_${userId}`);
    return theme === "dark" || theme === "light" ? theme : null;
  } catch (e) {
    console.error("Failed to load theme:", e);
    return null;
  }
}

export async function saveTasks(tasks: Tasks[], userId: string): Promise<boolean> {
  try {
    const jsonValue = JSON.stringify(tasks);
    await SecureStore.setItemAsync(`user_tasks_${userId}`, jsonValue);
    return true;
  } catch (e) {
    console.error("Failed to save tasks:", e);
    return false;
  }
}

export async function loadTasks(userId: string): Promise<Tasks[]> {
  try {
    const jsonValue = await SecureStore.getItemAsync(`user_tasks_${userId}`);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error("Failed to load tasks:", e);
    return [];
  }
}
