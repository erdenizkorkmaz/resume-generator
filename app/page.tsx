// pages/index.js
import fs from 'fs';
import path from 'path';
import UserProfile from '../components/UserProfile';
import { UserData } from '../types/userData';
import { JobsData } from '../components/JobsList';

// Force dynamic rendering - fetch fresh data on every request
export const dynamic = 'force-dynamic';

async function getUserData(): Promise<UserData> {
  const filePath = path.join(process.cwd(), 'public', 'data.json');
  const jsonData = await fs.readFileSync(filePath, 'utf8');
  return JSON.parse(jsonData);
}

async function getJobsData(): Promise<JobsData | undefined> {
  try {
    // Fetch fresh data from RemoteOK API at runtime
    const response = await fetch('https://remoteok.com/api', {
      next: { revalidate: 0 } // No cache, always fresh
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    const jobs = Array.isArray(data) ? data.filter(item => item.id && item.company) : [];
    
    // Filter for tech/AI contractor jobs
    const techKeywords = [
      'ai', 'artificial intelligence', 'machine learning', 'ml', 'deep learning',
      'developer', 'engineer', 'engineering', 'software', 'fullstack', 'full-stack',
      'frontend', 'front-end', 'backend', 'back-end', 'react', 'nextjs', 'angular',
      'node', 'nodejs', 'python', 'typescript', 'javascript', 'web developer',
      'software engineer', 'devops', 'cloud', 'aws', 'azure', 'gcp'
    ];
    
    const contractorKeywords = [
      'contract', 'contractor', 'freelance', 'freelancer', 'consultant',
      'part-time', 'part time', 'project-based', 'project based', 'gig',
      'hourly', 'temporary', 'temp'
    ];
    
    const isTechJob = (job: any) => {
      const text = `${job.position || ''} ${job.description || ''} ${job.tags?.join(' ') || ''}`.toLowerCase();
      return techKeywords.some(kw => text.includes(kw.toLowerCase()));
    };
    
    const isContractorJob = (job: any) => {
      const text = `${job.position || ''} ${job.description || ''}`.toLowerCase();
      return contractorKeywords.some(kw => text.includes(kw.toLowerCase()));
    };
    
    const filtered = jobs.filter(job => {
      const techMatch = isTechJob(job);
      const contractorMatch = isContractorJob(job);
      return techMatch && (contractorMatch || job.location === 'Remote' || !job.location);
    });
    
    return {
      last_updated: new Date().toISOString(),
      total_count: filtered.length,
      jobs: filtered.map(job => ({
        id: job.id,
        company: job.company,
        position: job.position,
        description: job.description?.substring(0, 300) + (job.description?.length > 300 ? '...' : '') || '',
        location: job.location || 'Remote',
        salary_min: job.salary_min,
        salary_max: job.salary_max,
        salary: job.salary,
        tags: job.tags || [],
        url: job.apply_url || job.url,
        source: 'RemoteOK',
        posted_at: job.date ? new Date(job.date).toISOString() : new Date().toISOString(),
        is_contractor: isContractorJob(job)
      }))
    };
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return undefined;
  }
}

export default async function Home() {
  const userData = await getUserData();
  const jobsData = await getJobsData();
  return <UserProfile data={userData} jobs={jobsData} />;
}
