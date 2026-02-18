'use client';

import { useState } from 'react';
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
    customCv: {
      id: string;
      content: any;
      generatedAt: string;
    } | null;
  } | null;
}

interface JobsClientProps {
  initialJobs: Job[];
}

export default function JobsClient({ initialJobs }: JobsClientProps) {
  const [jobs, setJobs] = useState(initialJobs);
  const [selectedCv, setSelectedCv] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [generatingCv, setGeneratingCv] = useState<string | null>(null);

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
          ? { ...j, savedData: { ...j.savedData, id: targetDbId!, applied } }
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
                ...j.savedData, 
                id: targetDbId!, 
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

  return (
    <>
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
    </>
  );
}
