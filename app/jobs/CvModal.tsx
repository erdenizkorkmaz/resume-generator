'use client';

import { useEffect } from 'react';

interface CvModalProps {
  isOpen: boolean;
  onClose: () => void;
  cvContent: any;
}

export default function CvModal({ isOpen, onClose, cvContent }: CvModalProps) {
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

  // Render structured CV
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white">
          <h2 className="text-lg font-semibold">Customized CV for This Job</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            ✕
          </button>
        </div>
        
        <div className="p-6 overflow-auto max-h-[calc(90vh-80px)]">
          <div className="prose prose-slate max-w-none">
            <div className="border-b pb-4 mb-4">
              <h1 className="text-2xl font-bold text-slate-900">{cvContent.name || 'Erdeniz Korkmaz'}</h1>
              <p className="text-lg text-slate-600">{cvContent.job || 'Fullstack Developer'}</p>
              <div className="flex flex-wrap gap-4 text-sm text-slate-500 mt-2">
                {cvContent.location && <span>📍 {cvContent.location}</span>}
                {cvContent.mail && <span>✉️ {cvContent.mail}</span>}
                {cvContent.phone && <span>📞 {cvContent.phone}</span>}
              </div>
            </div>
            
            {cvContent.aboutme && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">About</h3>
                <p className="text-slate-700">{cvContent.aboutme}</p>
              </div>
            )}
            
            {cvContent.skills && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {cvContent.skills.technical?.map((skill: string, i: number) => (
                    <span key={i} className="bg-slate-100 px-3 py-1 rounded-full text-sm">{skill}</span>
                  ))}
                </div>
              </div>
            )}
            
            {cvContent.experiences && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Experience</h3>
                <div className="space-y-4">
                  {cvContent.experiences.map((exp: any, i: number) => (
                    <div key={i} className="border-l-2 border-slate-200 pl-4">
                      <h4 className="font-medium">{exp.company}</h4>
                      <p className="text-sm text-slate-600">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
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
