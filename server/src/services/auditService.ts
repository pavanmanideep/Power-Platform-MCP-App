import { v4 as uuidv4 } from 'uuid';
import type { ImportJob } from '../types/index.js';

class AuditService {
  private readonly jobs: ImportJob[] = [];

  recordImport(job: Omit<ImportJob, 'id'>): ImportJob {
    const savedJob: ImportJob = { ...job, id: uuidv4() };
    this.jobs.unshift(savedJob);
    return savedJob;
  }

  listJobs(): ImportJob[] {
    return [...this.jobs];
  }

  getDashboardMetrics() {
    const today = new Date().toISOString().slice(0, 10);
    return {
      totalTables: 18,
      recordsImportedToday: this.jobs.filter((job) => job.timestamp.startsWith(today)).reduce((sum, job) => sum + job.successCount, 0),
      failedImports: this.jobs.filter((job) => job.status === 'failed').length,
      activeJobs: this.jobs.filter((job) => job.status === 'processing' || job.status === 'queued').length,
      recentActivities: this.jobs.slice(0, 5),
    };
  }
}

export default new AuditService();
