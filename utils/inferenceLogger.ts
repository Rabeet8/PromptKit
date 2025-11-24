import { ref, push, set, get, query, orderByChild, limitToLast } from 'firebase/database';
import { database, auth } from '@/config/firebase';

export interface InferenceLog {
  userId: string;
  userEmail?: string;
  service: string;
  timestamp: number;
  request: any;
  response: any;
  status: 'success' | 'error';
  errorMessage?: string;
  processingTime?: number; // in milliseconds
}

export const logInference = async (
  service: string,
  request: any,
  response: any,
  status: 'success' | 'error' = 'success',
  errorMessage?: string,
  startTime?: number
): Promise<void> => {
  try {
    const user = auth.currentUser;
    if (!user) {
      console.warn('Cannot log inference: User not authenticated');
      return;
    }

    const processingTime = startTime ? Date.now() - startTime : undefined;

    const logData: any = {
      userId: user.uid,
      userEmail: user.email || undefined,
      service,
      timestamp: Date.now(),
      request,
      response: response || null,
      status,
    };

    if (errorMessage !== undefined) {
      logData.errorMessage = errorMessage;
    }

    if (processingTime !== undefined) {
      logData.processingTime = processingTime;
    }

    // Store in Firebase Realtime Database - general logs
    const logsRef = ref(database, 'inference_logs');
    const newLogRef = push(logsRef);
    await set(newLogRef, logData);

    console.log(`Inference logged: ${service} - ${status}`);
  } catch (error) {
    console.error('Failed to log inference:', error);
  }
};

export const logInferenceStart = (service: string, request: any): number => {
  console.log(`Starting inference: ${service}`, request);
  return Date.now();
};

export const logInferenceSuccess = async (
  service: string,
  request: any,
  response: any,
  startTime: number
): Promise<void> => {
  await logInference(service, request, response, 'success', undefined, startTime);
};

export const logInferenceError = async (
  service: string,
  request: any,
  error: any,
  startTime: number
): Promise<void> => {
  const errorMessage = error?.message || error?.toString() || 'Unknown error';
  await logInference(service, request, null, 'error', errorMessage, startTime);
};

// Utility functions for retrieving logs (for admin/debugging purposes)

export const getInferenceLogs = async (limit: number = 50) => {
  try {
    const logsRef = ref(database, 'inference_logs');
    const logsQuery = query(logsRef, orderByChild('timestamp'), limitToLast(limit));
    const snapshot = await get(logsQuery);

    if (snapshot.exists()) {
      const logs = snapshot.val();
      // Convert to array and sort by timestamp (newest first)
      return Object.values(logs).sort((a: any, b: any) => b.timestamp - a.timestamp);
    }

    return [];
  } catch (error) {
    console.error('Failed to get inference logs:', error);
    return [];
  }
};

export const getUserInferenceLogs = async (userId: string, limit: number = 20) => {
  try {
    const logsRef = ref(database, 'inference_logs');
    const snapshot = await get(logsRef);

    if (snapshot.exists()) {
      const allLogs = snapshot.val();
      const userLogs = Object.values(allLogs)
        .filter((log: any) => log.userId === userId)
        .sort((a: any, b: any) => b.timestamp - a.timestamp)
        .slice(0, limit);

      return userLogs;
    }

    return [];
  } catch (error) {
    console.error('Failed to get user inference logs:', error);
    return [];
  }
};

export const getServiceStats = async () => {
  try {
    const logsRef = ref(database, 'inference_logs');
    const snapshot = await get(logsRef);

    if (snapshot.exists()) {
      const logs = snapshot.val();
      const stats: Record<string, { total: number, success: number, error: number, avgProcessingTime: number }> = {};

      Object.values(logs).forEach((log: any) => {
        const service = log.service;
        if (!stats[service]) {
          stats[service] = { total: 0, success: 0, error: 0, avgProcessingTime: 0 };
        }

        stats[service].total++;
        if (log.status === 'success') {
          stats[service].success++;
        } else {
          stats[service].error++;
        }

        if (log.processingTime) {
          stats[service].avgProcessingTime =
            (stats[service].avgProcessingTime * (stats[service].total - 1) + log.processingTime) / stats[service].total;
        }
      });

      return stats;
    }

    return {};
  } catch (error) {
    console.error('Failed to get service stats:', error);
    return {};
  }
};