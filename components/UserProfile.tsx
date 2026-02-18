"use client"
import { UserData } from '../types/userData';
import { JobsData } from './JobsList';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';

const JobsList = dynamic(() => import('./JobsList'), { ssr: false });

const UserProfile = ({data, jobs}: {data: UserData; jobs?: JobsData}) => {
  return (
    <main className="relative flex min-h-screen flex-col gap-3 p-2 text-[0.65rem] text-slate-900 max-w-[794px] mx-auto font-light antialiased">
      <Image className='absolute opacity-40 -top-[1rem]  w-full max-w-none' src="/beams-home@95.jpg" alt="logo" width={100} height={100} />
      <UserHeader data={data} />
      <UserExperiences experiences={data.experiences} />
      {jobs && jobs.jobs.length > 0 && <JobsSection jobs={jobs} />}
    </main>
  );
};

const UserHeader = ({ data }: { data: UserData }) => (
  <div className="relative flex flex-col gap-2 pb-5 pt-2 border-b border-slate-900/10 z-10">
    <div className="flex items-center justify-between">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-extrabold tracking-tight">
          {data.name} - {data.job}
        </h1>
        <UserContact data={data} />
      </div>
      {data.company && <CompanyInfo company={data.company} />}
    </div>
    <p className="tracking-tight leading-snug text-slate-700">{data.aboutme}</p>
    <UserSkills skills={data.skills} />
    <div className='absolute left-16 top-full -mt-px h-8 overflow-hidden'>
      <div className="flex -mt-px h-[2px] w-56"><div className="w-full flex-none blur-sm [background-image:linear-gradient(90deg,rgba(56,189,248,0)_0%,#0EA5E9_32.29%,rgba(236,72,153,0.3)_67.19%,rgba(236,72,153,0)_100%)]"></div><div className="-ml-[100%] w-full flex-none blur-[1px] [background-image:linear-gradient(90deg,rgba(56,189,248,0)_0%,#0EA5E9_32.29%,rgba(236,72,153,0.3)_67.19%,rgba(236,72,153,0)_100%)]"></div></div>
    </div>
  </div>
);

const UserContact = ({ data }: { data: UserData }) => (
  <ul className="flex flex-wrap">
    <li className="w-1/2"><b className='font-semibold'>Location: </b>{data.location}</li>
    <li className="w-1/2"><b className='font-semibold'>Mail: </b><Link href={`mailto:${data.mail}`}>{data.mail}</Link></li>
    <li className="w-1/2"><b className='font-semibold'>Phone: </b>{data.phone}</li>
    <li className="w-1/2"><b className='font-semibold'>Github: </b><Link href={`https://github.com/${data.github}`}>@{data.github}</Link></li>
  </ul>
);

const CompanyInfo = ({ company }: { company: string }) => (
  <div className="absolute right-0 text-end tracking-tight leading-snug">
    <span>This resume prepared for <br /> <b className="text-base font-semibold tracking-tight leading-snug relative -top-1" contentEditable="true">{company}</b></span>
  </div>
);

const UserSkills = ({ skills }: { skills: UserData['skills'] }) => (
  <div className="flex flex-col gap-2">
    <SkillSet title="Technical Skills" skills={skills.technical} />
    <SkillSet title="Other Skills" skills={skills.soft} />
  </div>
);

const SkillSet = ({ title, skills }: { title: string; skills: string[] }) => (
  <div className="flex flex-col gap-2">
    <h3 className="text-sm font-semibold">{title}</h3>
    <div className="flex flex-wrap gap-2">
      {skills.map((skill, index) => <span key={index} className="rounded-md bg-slate-100/20 backdrop-blur-lg px-1.5 py-0.5 font-medium leading-5 text-slate-700 shadow-sm ring-1 ring-slate-700/10">{skill}</span>)}
    </div>
  </div>
);

const UserExperiences = ({ experiences }: { experiences: UserData['experiences'] }) => (
  <div className="flex flex-col z-10 mt-2">
    <h2 className="text-base font-semibold">Work Experiences</h2>
    <ul className="flex flex-col gap-5 mt-1">
      {experiences.map((experience, index) => <ExperienceDetails key={index} experience={experience} />)}
    </ul>
  </div>
);

const ExperienceDetails = ({ experience }: { experience: UserData['experiences'][number] }) => (
  <li className="flex flex-col gap-2">
    <div className='flex flex-col'>
      <h3 className="text-sm font-medium leading-snug">{experience.company}</h3>
      <RoleDates dates={experience.dates} />
    </div>
    {experience.description && <p className="leading-snug m-0 text-slate-700">{experience.description}</p>}
    <ProjectList projects={experience.projects} />
  </li>
);

const RoleDates = ({ dates }: { dates: UserData['experiences'][number]['dates'] }) => (
  <ul className={`${dates.length > 1 ? "role-list mt-1" : ""}`}>
    {dates.map((date, index) => (
      <li className="flex gap-2 tracking-tight leading-snug" key={index}>
        <span className="font-medium">{date.role}</span> <span>{date.start} - {date.end}</span>
      </li>
    ))}
  </ul>
);

const ProjectList = ({ projects }: { projects: UserData['experiences'][number]['projects'] }) => (
  <ul className="print-flex print-flex-wrap gap-2">
    {projects.map((project, index) => (
      <li key={index} className="print-w-1-2 overflow-hidden rounded-md bg-white px-3.5 py-2.5 ring-1 ring-slate-700/10">
        <h4 className="font-semibold tracking-tight leading-snug">{project.name}</h4>
        {project.description && <p className="leading-snug">{project.description}</p>}
        <div className="flex flex-wrap">{project.tech.join(", ")}</div>
      </li>
    ))}
  </ul>
);

const JobsSection = ({ jobs }: { jobs: JobsData }) => (
  <div className="flex flex-col z-10 mt-4 print:hidden">
    <div className="flex items-center justify-between mb-2">
      <h2 className="text-base font-semibold">Remote AI & Dev Jobs</h2>
      <span className="text-xs text-slate-400">
        Updated {new Date(jobs.last_updated).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
      </span>
    </div>
    <p className="text-xs text-slate-600 mb-3">
      Curated contractor and remote opportunities in AI and software development.
    </p>
    <JobsList jobs={jobs.jobs} />
    <div className="mt-3 text-center">
      <Link 
        href="https://remoteok.com" 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-xs text-sky-600 hover:text-sky-700 font-medium"
      >
        View more on RemoteOK →
      </Link>
    </div>
  </div>
);

export default UserProfile;
