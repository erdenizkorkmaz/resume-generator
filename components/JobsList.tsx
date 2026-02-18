import Link from 'next/link';

export interface Job {
  id: string;
  company: string;
  position: string;
  description: string;
  location: string;
  salary_min?: number;
  salary_max?: number;
  salary?: string;
  tags: string[];
  url: string;
  source: string;
  posted_at: string;
  is_contractor: boolean;
}

export interface JobsData {
  last_updated: string;
  total_count: number;
  jobs: Job[];
}

interface JobsListProps {
  jobs: Job[];
}

const formatSalary = (job: Job) => {
  if (job.salary) return job.salary;
  if (job.salary_min && job.salary_max) {
    return `$${(job.salary_min / 1000).toFixed(0)}k - $${(job.salary_max / 1000).toFixed(0)}k`;
  }
  if (job.salary_min) return `$${(job.salary_min / 1000).toFixed(0)}k+`;
  return null;
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export const JobsList = ({ jobs }: JobsListProps) => {
  if (jobs.length === 0) {
    return (
      <div className="text-slate-500 text-center py-4">
        No jobs found. Check back later!
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {jobs.slice(0, 10).map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
};

const JobCard = ({ job }: { job: Job }) => {
  const salary = formatSalary(job);
  const postedDate = formatDate(job.posted_at);
  
  return (
    <Link 
      href={job.url} 
      target="_blank" 
      rel="noopener noreferrer"
      className="group block overflow-hidden rounded-lg bg-white/80 backdrop-blur-sm px-4 py-3 ring-1 ring-slate-700/10 hover:ring-sky-500/50 hover:shadow-md transition-all"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-semibold text-sm text-slate-900 group-hover:text-sky-600 transition-colors truncate">
              {job.position}
            </h4>
            {job.is_contractor && (
              <span className="shrink-0 inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                Contract
              </span>
            )}
          </div>
          <p className="text-xs text-slate-600 mt-0.5">{job.company}</p>
        </div>
        <span className="shrink-0 text-xs text-slate-400">{postedDate}</span>
      </div>
      
      <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
        {job.description}
      </p>
      
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-2 flex-wrap">
          {job.tags.slice(0, 3).map((tag, idx) => (
            <span 
              key={idx} 
              className="text-[10px] rounded bg-slate-100 px-1.5 py-0.5 text-slate-600"
            >
              {tag}
            </span>
          ))}
          {job.tags.length > 3 && (
            <span className="text-[10px] text-slate-400">+{job.tags.length - 3}</span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {salary && (
            <span className="text-xs font-medium text-green-600">{salary}</span>
          )}
          <span className="text-xs text-slate-400">{job.location}</span>
        </div>
      </div>
    </Link>
  );
};

export default JobsList;
