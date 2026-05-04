import { loadClasses, loadTasks } from "@/lib/utility";
import { icons } from "./icons";

export const tabs: AppTab[] = [
  { name: "index", title: "Home", icon: icons.home },
  { name: "tasks", title: "Tasks", icon: icons.alarm },
  { name: "schudule", title: "Calndar", icon: icons.calndar },
  { name: "settings", title: "Settings", icon: icons.setting },
];

export let CLASSES: Classes[] = [];

export async function initializeClasses(userId: string) {
  const loadedClasses = await loadClasses(userId);
  CLASSES.splice(0, CLASSES.length, ...loadedClasses);
}

export let TASKS: Tasks[] = [];

export async function initializeTasks(userId: string) {
  const loadedTasks = await loadTasks(userId);
  TASKS.splice(0, TASKS.length, ...loadedTasks);
}

export const HOME_USER = {
  name: "",
};
