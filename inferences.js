const { initializeApp } = require('firebase/app');
const { getDatabase, ref, get, query, orderByChild, limitToLast } = require('firebase/database');

const firebaseConfig = {
  apiKey: "AIzaSyBdFJRnASzSwNrERZFmSGw0YY9t1t2fxBI",
  authDomain: "boostpro-c526d.firebaseapp.com",
  databaseURL: "https://boostpro-c526d-default-rtdb.firebaseio.com",
  projectId: "boostpro-c526d",
  storageBucket: "boostpro-c526d.firebasestorage.app",
  messagingSenderId: "218686343827",
  appId: "1:218686343827:web:10bcdeec9939b0d89a9b66"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

class InferenceAnalyzer {
  constructor() {
    this.db = database;
  }

  // Get all inference logs with user information
  async getAllInferenceLogs(limit = 1000) {
    try {
      console.log(`Fetching last ${limit} inference logs...`);
      const logsRef = ref(this.db, 'inference_logs');
      const logsQuery = query(logsRef, orderByChild('timestamp'), limitToLast(limit));
      const snapshot = await get(logsQuery);

      if (snapshot.exists()) {
        const logs = snapshot.val();
        const logsArray = Object.values(logs).sort((a, b) => b.timestamp - a.timestamp);

        console.log(`Found ${logsArray.length} inference logs`);
        return logsArray;
      }

      console.log('No inference logs found');
      return [];
    } catch (error) {
      console.error('Error fetching inference logs:', error);
      return [];
    }
  }

  // Get inference logs for a specific user
  async getUserInferenceLogs(userId, limit = 100) {
    try {
      console.log(`Fetching inference logs for user: ${userId}`);
      const logsRef = ref(this.db, 'inference_logs');
      const snapshot = await get(logsRef);

      if (snapshot.exists()) {
        const allLogs = snapshot.val();
        const userLogs = Object.values(allLogs)
          .filter(log => log.userId === userId)
          .sort((a, b) => b.timestamp - a.timestamp)
          .slice(0, limit);

        console.log(`Found ${userLogs.length} logs for user ${userId}`);
        return userLogs;
      }

      console.log(`No logs found for user ${userId}`);
      return [];
    } catch (error) {
      console.error('Error fetching user inference logs:', error);
      return [];
    }
  }

  // Get user profiles to enrich inference data
  async getUserProfiles() {
    try {
      console.log('Fetching user profiles...');
      const usersRef = ref(this.db, 'users');
      const snapshot = await get(usersRef);

      if (snapshot.exists()) {
        const users = snapshot.val();
        console.log(`Found ${Object.keys(users).length} user profiles`);
        return users;
      }

      console.log('No user profiles found');
      return {};
    } catch (error) {
      console.error('Error fetching user profiles:', error);
      return {};
    }
  }

  // Combine inference logs with user information
  async getEnrichedInferenceLogs(limit = 500) {
    try {
      console.log('Getting enriched inference logs...');

      // Get inference logs and user profiles in parallel
      const [logs, users] = await Promise.all([
        this.getAllInferenceLogs(limit),
        this.getUserProfiles()
      ]);

      // Enrich logs with user information
      const enrichedLogs = logs.map(log => ({
        ...log,
        userProfile: users[log.userId] || null,
        timestampFormatted: new Date(log.timestamp).toISOString(),
        processingTimeFormatted: log.processingTime ? `${log.processingTime}ms` : 'N/A'
      }));

      console.log(`Enriched ${enrichedLogs.length} inference logs with user data`);
      return enrichedLogs;
    } catch (error) {
      console.error('Error enriching inference logs:', error);
      return [];
    }
  }

  // Generate usage statistics
  async generateUsageStats() {
    try {
      console.log('Generating usage statistics...');
      const logs = await this.getAllInferenceLogs(10000); // Get more logs for stats

      const stats = {
        totalInferences: logs.length,
        serviceBreakdown: {},
        userActivity: {},
        timeRange: {
          earliest: logs.length > 0 ? new Date(logs[logs.length - 1].timestamp).toISOString() : null,
          latest: logs.length > 0 ? new Date(logs[0].timestamp).toISOString() : null
        },
        successRate: 0,
        averageProcessingTime: 0
      };

      let totalSuccess = 0;
      let totalProcessingTime = 0;
      let processingTimeCount = 0;

      logs.forEach(log => {
        // Service breakdown
        if (!stats.serviceBreakdown[log.service]) {
          stats.serviceBreakdown[log.service] = {
            total: 0,
            success: 0,
            error: 0,
            avgProcessingTime: 0
          };
        }

        stats.serviceBreakdown[log.service].total++;

        if (log.status === 'success') {
          stats.serviceBreakdown[log.service].success++;
          totalSuccess++;
        } else {
          stats.serviceBreakdown[log.service].error++;
        }

        // User activity
        if (!stats.userActivity[log.userId]) {
          stats.userActivity[log.userId] = {
            totalInferences: 0,
            services: {},
            email: log.userEmail || 'Unknown'
          };
        }

        stats.userActivity[log.userId].totalInferences++;

        if (!stats.userActivity[log.userId].services[log.service]) {
          stats.userActivity[log.userId].services[log.service] = 0;
        }
        stats.userActivity[log.userId].services[log.service]++;

        // Processing time
        if (log.processingTime) {
          totalProcessingTime += log.processingTime;
          processingTimeCount++;

          stats.serviceBreakdown[log.service].avgProcessingTime =
            (stats.serviceBreakdown[log.service].avgProcessingTime *
             (stats.serviceBreakdown[log.service].total - 1) +
             log.processingTime) / stats.serviceBreakdown[log.service].total;
        }
      });

      stats.successRate = logs.length > 0 ? (totalSuccess / logs.length) * 100 : 0;
      stats.averageProcessingTime = processingTimeCount > 0 ? totalProcessingTime / processingTimeCount : 0;

      console.log('Usage statistics generated successfully');
      return stats;
    } catch (error) {
      console.error('Error generating usage stats:', error);
      return null;
    }
  }

  // Export data to JSON file
  async exportToFile(filename = 'inference_logs.json') {
    try {
      console.log(`Exporting data to ${filename}...`);
      const enrichedLogs = await this.getEnrichedInferenceLogs();
      const stats = await this.generateUsageStats();

      const exportData = {
        exportDate: new Date().toISOString(),
        summary: stats,
        logs: enrichedLogs
      };

      // In Node.js, we'd write to file, but since this might run in different environments,
      // we'll just return the data for now
      console.log(`Data ready for export. ${enrichedLogs.length} logs processed.`);
      return exportData;
    } catch (error) {
      console.error('Error exporting data:', error);
      return null;
    }
  }
}

// CLI interface
async function main() {
  const analyzer = new InferenceAnalyzer();

  const command = process.argv[2];

  switch (command) {
    case 'logs':
      const limit = parseInt(process.argv[3]) || 50;
      const logs = await analyzer.getAllInferenceLogs(limit);
      console.log(JSON.stringify(logs, null, 2));
      break;

    case 'user':
      const userId = process.argv[3];
      if (!userId) {
        console.error('Please provide a user ID: node inferences.js user <userId>');
        process.exit(1);
      }
      const userLogs = await analyzer.getUserInferenceLogs(userId);
      console.log(JSON.stringify(userLogs, null, 2));
      break;

    case 'enriched':
      const enrichedLogs = await analyzer.getEnrichedInferenceLogs();
      console.log(JSON.stringify(enrichedLogs, null, 2));
      break;

    case 'stats':
      const stats = await analyzer.generateUsageStats();
      console.log(JSON.stringify(stats, null, 2));
      break;

    case 'export':
      const exportData = await analyzer.exportToFile();
      console.log(JSON.stringify(exportData, null, 2));
      break;

    default:
      console.log(`
Inference Analyzer CLI

Usage:
  node inferences.js logs [limit]          - Get recent inference logs
  node inferences.js user <userId>         - Get logs for specific user
  node inferences.js enriched              - Get logs with user profile data
  node inferences.js stats                 - Generate usage statistics
  node inferences.js export                - Export all data to JSON

Examples:
  node inferences.js logs 100
  node inferences.js user abc123
  node inferences.js stats
      `);
  }
}

// Export for use as module
module.exports = InferenceAnalyzer;

// Run CLI if called directly
if (require.main === module) {
  main().catch(console.error);
}