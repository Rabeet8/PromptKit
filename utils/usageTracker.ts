import { ref, get, set, increment } from "firebase/database";
import { auth, database } from "@/config/firebase";

export const trackServiceUsage = async (serviceName: string) => {
  const user = auth.currentUser;
  if (!user) return;

  try {
    const usageRef = ref(database, `users/${user.uid}/usage/${serviceName}`);
    await set(usageRef, increment(1));
  } catch (error) {
    console.log("Failed to track usage:", error);
  }
};

export const getServiceUsage = async (serviceName: string): Promise<number> => {
  const user = auth.currentUser;
  if (!user) return 0;

  try {
    const usageRef = ref(database, `users/${user.uid}/usage/${serviceName}`);
    const snapshot = await get(usageRef);
    return snapshot.exists() ? snapshot.val() : 0;
  } catch (error) {
    console.log("Failed to get usage:", error);
    return 0;
  }
};

export const getAllServiceUsage = async (): Promise<Record<string, number>> => {
  const user = auth.currentUser;
  if (!user) return {};

  try {
    const usageRef = ref(database, `users/${user.uid}/usage`);
    const snapshot = await get(usageRef);
    return snapshot.exists() ? snapshot.val() : {};
  } catch (error) {
    console.log("Failed to get all usage:", error);
    return {};
  }
};