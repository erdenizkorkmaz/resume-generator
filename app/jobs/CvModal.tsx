'use client';

import { useEffect } from 'react';

interface CvModalProps {
  isOpen: boolean;
  onClose: () => void;
  cvContent: any;
  onRegenerate?: () => void;
  hasExistingCv?: boolean;
}

export default function CvModal({ isOpen, onClose, cvContent, onRegenerate, hasExistingCv }: CvModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !cvContent) return null;

  // If it's raw response, show as preformatted
  if (cvContent.raw) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
        <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Customized CV</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              ✕
            </button>
          </div>
          
          <div className="p-4 overflow-auto max-h-[calc(90vh-80px)]">
            <pre className="whitespace-pre-wrap text-sm">{cvContent.raw}</pre>
          </div>
        </div>
      </div>
    );
  }

  // Render structured CV - same style as homepage
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-xl max-w-[794px] w-full max-h-[90vh] overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white">
          <h2 className="text-lg font-semibold">Customized CV for This Job</h2>
          <div className="flex items-center gap-2">
            {hasExistingCv && onRegenerate && (
              <button
                onClick={onRegenerate}
                className="px-3 py-1.5 text-sm bg-sky-100 text-sky-700 rounded-lg hover:bg-sky-200 transition-colors"
              >
                Regenerate
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
        
        <div className="p-6 overflow-auto max-h-[calc(90vh-80px)]">
          <div className="flex flex-col gap-3 text-[0.65rem] text-slate-900 font-light antialiased">
            <!-- Header -->
            <div className="relative flex flex-col gap-2 pb-5 pt-2 border-b border-slate-900/10">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <h1 className="text-2xl font-extrabold tracking-tight">
                    {cvContent.name || 'Erdeniz Korkmaz'} - {cvContent.job || 'Fullstack Developer'}
                  </h1>
                  <ul className="flex flex-wrap">
                    <li className="w-1/2"><b className='font-semibold'>Location: </b>{cvContent.location || 'London, UK'}</li>
                    <li className="w-1/2"><b className='font-semibold'>Mail: </b>{cvContent.mail || 'erdeniz@dakik.co.uk'}</li>
                    <li className="w-1/2"><b className='font-semibold'>Phone: </b>{cvContent.phone || '+44 07950497404'}</li>
                    <li className="w-1/2"><b className='font-semibold'>Github: </b>@{(cvContent.github || 'erdenizkorkmaz')}</li>
                  </ul>
                </div>
              </div>
              
              <p className="tracking-tight leading-snug text-slate-700">{cvContent.aboutme}</p>
              
              <!-- Skills -->
              {cvContent.skills && (
                <div className="flex flex-col gap-2 mt-2">
                  {cvContent.skills.technical && cvContent.skills.technical.length > 0 && (
                    <div className="flex flex-col gap-2">
                      <h3 className="text-sm font-semibold">Technical Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {cvContent.skills.technical.map((skill: string, index: number) => (
                          <span key={index} className="rounded-md bg-slate-100/20 backdrop-blur-lg px-1.5 py-0.5 font-medium leading-5 text-slate-700 shadow-sm ring-1 ring-slate-700/10">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {cvContent.skills.soft && cvContent.skills.soft.length > 0 && (
                    <div className="flex flex-col gap-2">
                      <h3 className="text-sm font-semibold">Other Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {cvContent.skills.soft.map((skill: string, index: number) => (
                          <span key={index} className="rounded-md bg-slate-100/20 backdrop-blur-lg px-1.5 py-0.5 font-medium leading-5 text-slate-700 shadow-sm ring-1 ring-slate-700/10">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              <div className='absolute left-16 top-full -mt-px h-8 overflow-hidden'>
                <div className="flex -mt-px h-[2px] w-56">
                  <div className="w-full flex-none blur-sm [background-image:linear-gradient(90deg,rgba(56,189,248,0)_0%,#0EA5E9_32.29%,rgba(236,72,153,0.3)_67.19%,rgba(236,72,153,0)_100%)]"></div>
                  <div className="-ml-[100%] w-full flex-none blur-[1px] [background-image:linear-gradient(90deg,rgba(56,189,248,0)_0%,#0EA5E9_32.29%,rgba(236,72,153,0.3)_67.19%,rgba(236,72,153,0)_100%)]"></div>
                </div>
              </div>
            </div>
            
            <!-- Experience -->
            {cvContent.experiences && cvContent.experiences.length > 0 && (
              <div className="flex flex-col z-10 mt-2">
                <h2 className="text-base font-semibold">Work Experiences</h2>
                <ul className="flex flex-col gap-5 mt-1">
                  {cvContent.experiences.map((experience: any, index: number) => (
                    <li key={index} className="flex flex-col gap-2">
                      <div className='flex flex-col'>
                        <h3 className="text-sm font-medium leading-snug">{experience.company}</h3>
                        <ul className={experience.dates?.length > 1 ? "role-list mt-1" : ""}>
                          {experience.dates?.map((date: any, idx: number) => (
                            <li className="flex gap-2 tracking-tight leading-snug" key={idx}>
                              <span className="font-medium">{date.role}</span> 
                              <span>{date.start} - {date.end}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      {experience.description && (
                        <p className="leading-snug m-0 text-slate-700">{experience.description}</p>
                      )}
                      
                      <!-- Projects -->
                      {experience.projects && experience.projects.length > 0 && (
                        <ul className="flex flex-wrap gap-2">
                          {experience.projects.map((project: any, pidx: number) => (
                            <li key={pidx} className="w-full md:w-[calc(50%-4px)] overflow-hidden rounded-md bg-white px-3.5 py-2.5 ring-1 ring-slate-700/10">
                              <h4 className="font-semibold tracking-tight leading-snug">{project.name}</h4>
                              {project.description && <p className="leading-snug">{project.description}</p>}
                              <div className="flex flex-wrap text-xs text-slate-600">{project.tech?.join(", ")}</div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <!-- Raw JSON view option -->
            <details className="mt-6">
              <summary className="cursor-pointer text-sm text-slate-500 hover:text-slate-700">View Raw JSON</summary>
              <pre className="mt-2 p-4 bg-slate-50 rounded-lg text-xs overflow-auto">
                {JSON.stringify(cvContent, null, 2)}
              </pre>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}
