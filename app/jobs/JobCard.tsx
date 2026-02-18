'use client';

import Link from 'next/link';

interface JobCardProps {
  job: {
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
  };
  onAppliedChange: (jobId: string, applied: boolean, dbId?: string) => void;
  onGenerateCv: (jobId: string, dbId?: string) => void;
  onViewCv: (cvContent: any, jobId: string) => void;
  isGenerating: boolean;
}

export default function JobCard({ job, onAppliedChange, onGenerateCv, onViewCv, isGenerating }: JobCardProps) {
  const { apiData, savedData } = job;
  
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

  return (
    <div className={`bg-white rounded-xl shadow-sm border transition-all ${
      savedData?.applied ? 'border-green-200 bg-green-50/30' : 'border-slate-200 hover:border-sky-300 hover:shadow-md'
    }`}>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-lg text-slate-900 truncate">{apiData.position}</h3>
              {savedData?.applied && (
                <span className="shrink-0 inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                  Applied
                </span>
              )}
            </div>
            <p className="text-slate-600 font-medium">{apiData.company}</p>
          </div>
          <span className="shrink-0 text-sm text-slate-400">{formatDate(apiData.postedAt)}</span>
        </div>
        
        <p className="text-sm text-slate-600 mt-3 line-clamp-2">
          <span dangerouslySetInnerHTML={{ __html: apiData.description }} />
        </p>
        
        <div className="flex flex-wrap gap-2 mt-3">
          {apiData.tags.slice(0, 4).map((tag, idx) => (
            <span 
              key={idx} 
              className="text-xs rounded-full bg-slate-100 px-2.5 py-1 text-slate-600"
            >
              {tag}
            </span>
          ))}
          {apiData.tags.length > 4 && (
            <span className="text-xs text-slate-400">+{apiData.tags.length - 4}</span>
          )}
        </div>
        
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500">{apiData.location}</span>
            {apiData.salary && (
              <span className="text-sm font-medium text-green-600">{apiData.salary}</span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={savedData?.applied || false}
                onChange={(e) => onAppliedChange(apiData.id, e.target.checked, savedData?.id)}
                className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
              />
              <span className="text-sm text-slate-600">Applied</span>
            </label>
          </div>
        </div>
        
        <div className="flex items-center gap-2 mt-4">
          <Link
            href={apiData.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center py-2 px-4 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors text-sm font-medium"
          >
            View Job →
          </Link>
          
          {savedData?.customCv ? (
            <button
              onClick={() => onViewCv(savedData.customCv!.content, apiData.id)}
              className="py-2 px-4 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm font-medium"
            >
              View CV
            </button>
          ) : (
            <button
              onClick={() => onGenerateCv(apiData.id, savedData?.id)}
              disabled={isGenerating}
              className="py-2 px-4 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? 'Generating...' : 'Generate CV'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
