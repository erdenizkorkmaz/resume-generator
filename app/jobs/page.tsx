'use client';

import { useState, useEffect } from 'react';
import JobCard from './JobCard';
import CvModal from './CvModal';

interface Job {
  apiData: {
    id: string;
    company: string;
    position: string;
    description: string;
    location: string;
    salary: string | null;
    tags: string[];
    url: string;
    postedAt: string;
  };
  savedData: {
    id: string;
    applied: boolean;
    customCv?: {
      id: string;
      content: any;
      generatedAt: string;
    } | null;
  } | null;
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCv, setSelectedCv] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [generatingCv, setGeneratingCv] = useState<string | null>(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      // Fetch from RemoteOK API
      const response = await fetch('https://remoteok.com/api');
      if (!response.ok) throw new Error('Failed to fetch');
      
      const data = await response.json();
      const apiJobs = Array.isArray(data) ? data.filter(item => item.id && item.company) : [];
      
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
      
      const filtered = apiJobs.filter(job => {
        const techMatch = isTechJob(job);
        const contractorMatch = isContractorJob(job);
        return techMatch && (contractorMatch || job.location === 'Remote' || !job.location);
      });
      
      // Fetch saved jobs from our API
      let savedJobs: any[] = [];
      try {
        const savedResponse = await fetch('/api/jobs');
        if (savedResponse.ok) {
          savedJobs = await savedResponse.json();
        }
      } catch (e) {
        console.log('Could not fetch saved jobs');
      }
      
      // Merge API data with saved data
      const mergedJobs: Job[] = filtered.map(apiJob => {
        const saved = savedJobs.find((sj: any) => sj.remoteOkId === String(apiJob.id));
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
          savedData: saved ? {
            id: saved.id,
            applied: saved.applied,
            customCv: saved.customCv ? {
              id: saved.customCv.id,
              content: saved.customCv.content,
              generatedAt: saved.customCv.generatedAt,
            } : null,
          } : null,
        };
      });
      
      setJobs(mergedJobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAppliedChange = async (jobId: string, applied: boolean, dbId?: string) => {
    try {
      let targetDbId = dbId;
      
      // If no dbId, we need to create the job first
      if (!targetDbId) {
        const job = jobs.find(j => j.apiData.id === jobId)?.apiData;
        if (!job) return;
        
        const res = await fetch('/api/jobs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            remoteOkId: job.id,
            company: job.company,
            position: job.position,
            description: job.description,
            location: job.location,
            url: job.url,
            tags: job.tags,
            salary: job.salary,
            postedAt: job.postedAt,
          }),
        });
        
        if (!res.ok) throw new Error('Failed to create job');
        const newJob = await res.json();
        targetDbId = newJob.id;
      }
      
      // Update applied status
      const res = await fetch(`/api/jobs/${targetDbId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applied }),
      });
      
      if (!res.ok) throw new Error('Failed to update job');
      
      // Update local state
      setJobs(prev => prev.map(j => 
        j.apiData.id === jobId 
          ? { 
              ...j, 
              savedData: { 
                id: targetDbId!, 
                applied,
                customCv: j.savedData?.customCv ?? null
              } 
            }
          : j
      ));
    } catch (error) {
      console.error('Error updating applied status:', error);
      alert('Failed to update. Please try again.');
    }
  };

  const handleGenerateCv = async (jobId: string, dbId?: string) => {
    setGeneratingCv(jobId);
    
    try {
      let targetDbId = dbId;
      
      // If no dbId, create job first
      if (!targetDbId) {
        const job = jobs.find(j => j.apiData.id === jobId)?.apiData;
        if (!job) return;
        
        const res = await fetch('/api/jobs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            remoteOkId: job.id,
            company: job.company,
            position: job.position,
            description: job.description,
            location: job.location,
            url: job.url,
            tags: job.tags,
            salary: job.salary,
            postedAt: job.postedAt,
          }),
        });
        
        if (!res.ok) throw new Error('Failed to create job');
        const newJob = await res.json();
        targetDbId = newJob.id;
      }
      
      // Generate CV
      const res = await fetch(`/api/jobs/${targetDbId}/generate-cv`, {
        method: 'POST',
      });
      
      if (!res.ok) throw new Error('Failed to generate CV');
      const data = await res.json();
      
      // Update local state
      setJobs(prev => prev.map(j => 
        j.apiData.id === jobId 
          ? { 
              ...j, 
              savedData: { 
                id: targetDbId!, 
                applied: j.savedData?.applied ?? false,
                customCv: data.customCv 
              } 
            }
          : j
      ));
      
      // Open modal to show the CV
      setSelectedCv(data.customCv.content);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error generating CV:', error);
      alert('Failed to generate CV. Please try again.');
    } finally {
      setGeneratingCv(null);
    }
  };

  const handleViewCv = (cvContent: any) => {
    setSelectedCv(cvContent);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900">Remote AI & Dev Jobs</h1>
            <p className="text-slate-600 mt-2">Loading jobs...</p>
          </header>
          <div className="grid gap-4 md:grid-cols-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 animate-pulse">
                <div className="h-6 bg-slate-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-slate-200 rounded w-1/2 mb-4"></div>
                <div className="h-20 bg-slate-200 rounded mb-4"></div>
                <div className="flex gap-2">
                  <div className="h-8 bg-slate-200 rounded w-20"></div>
                  <div className="h-8 bg-slate-200 rounded w-20"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Remote AI & Dev Jobs</h1>
          <p className="text-slate-600 mt-2">
            {jobs.length} contractor and remote opportunities found
          </p>
        </header>
        
        <div className="grid gap-4 md:grid-cols-2">
          {jobs.map((job) => (
            <JobCard
              key={job.apiData.id}
              job={job}
              onAppliedChange={handleAppliedChange}
              onGenerateCv={handleGenerateCv}
              onViewCv={handleViewCv}
              isGenerating={generatingCv === job.apiData.id}
            />
          ))}
        </div>
        
        {jobs.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            No jobs found. Please try again later.
          </div>
        )}
        
        <CvModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          cvContent={selectedCv}
        />
      </div>
    </main>
  );
}
