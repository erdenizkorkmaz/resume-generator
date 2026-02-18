import { prisma } from '@/lib/prisma';
import JobsClient from './JobsClient';

export const dynamic = 'force-dynamic';

async function getJobs() {
  try {
    // Fetch from RemoteOK API
    const response = await fetch('https://remoteok.com/api', {
      next: { revalidate: 0 }
    });
    
    if (!response.ok) throw new Error('Failed to fetch');
    
    const data = await response.json();
    const jobs = Array.isArray(data) ? data.filter(item => item.id && item.company) : [];
    
    // Filter for tech/AI contractor jobs
    const techKeywords = ['ai', 'artificial intelligence', 'machine learning', 'ml', 'developer', 'engineer', 'software', 'fullstack', 'frontend', 'backend', 'react', 'nextjs', 'angular', 'node', 'nodejs', 'python', 'typescript'];
    const contractorKeywords = ['contract', 'contractor', 'freelance', 'consultant', 'part-time', 'project-based'];
    
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
    
    // Get saved jobs from database
    const savedJobs = await prisma.job.findMany({
      include: { customCv: true },
    });
    
    // Merge API data with saved data
    const mergedJobs = filtered.map(apiJob => {
      const saved = savedJobs.find(sj => sj.remoteOkId === String(apiJob.id));
      return {
        apiData: {
          id: String(apiJob.id),
          company: apiJob.company,
          position: apiJob.position,
          description: apiJob.description?.substring(0, 300) + (apiJob.description?.length > 300 ? '...' : '') || '',
          location: apiJob.location || 'Remote',
          salary: apiJob.salary || (apiJob.salary_min && apiJob.salary_max ? `$${Math.round(apiJob.salary_min/1000)}k-$${Math.round(apiJob.salary_max/1000)}k` : null),
          tags: apiJob.tags || [],
          url: apiJob.apply_url || apiJob.url,
          postedAt: apiJob.date,
        },
        savedData: saved || null,
      };
    });
    
    return mergedJobs;
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return [];
  }
}

export default async function JobsPage() {
  const jobs = await getJobs();
  
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Remote AI & Dev Jobs</h1>
          <p className="text-slate-600 mt-2">
            {jobs.length} contractor and remote opportunities found
          </p>
        </header>
        
        <JobsClient initialJobs={jobs} />
      </div>
    </main>
  );
}
