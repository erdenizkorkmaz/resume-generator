"use client"
import { UserData } from '../types/userData';
import Link from 'next/link';

const UserProfile = ({data}: {data: UserData}) => {
  return (
    <main className="flex min-h-screen flex-col gap-2 p-2 text-[0.65rem] text-slate-900 max-w-[794px] mx-auto font-light antialiased">
      <UserHeader data={data} />
      <UserExperiences experiences={data.experiences} />
    </main>
  );
};

const UserHeader = ({ data }: { data: UserData }) => (
  <div className="flex flex-col gap-2 pb-4 pt-2 px-4 border border-slate-200 bg-slate-100 rounded-[18px]">
    <div className="flex items-center justify-between">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold tracking-tight">
          {data.name} - {data.job}
        </h1>
        <UserContact data={data} />
      </div>
      {data.company && <CompanyInfo company={data.company} />}
    </div>
    <p className="tracking-tight leading-snug">“{data.aboutme}”</p>
    <UserSkills skills={data.skills} />
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
  <div className="text-end tracking-tight leading-snug">
    <span>This resume has been <br /> prepared for <b className="text-base" contentEditable="true">{company}</b></span>
  </div>
);

const UserSkills = ({ skills }: { skills: UserData['skills'] }) => (
  <div className="flex flex-col gap-3">
    <SkillSet title="Technical Skills" skills={skills.technical} />
    <SkillSet title="Other Skills" skills={skills.soft} />
  </div>
);

const SkillSet = ({ title, skills }: { title: string; skills: string[] }) => (
  <div className="flex flex-col gap-1">
    <h3 className="text-sm font-semibold">{title}</h3>
    <div className="flex flex-wrap gap-2">
      {skills.map((skill, index) => <span key={index} className="px-2 py-1 bg-slate-200 border border-slate-300 rounded-md">{skill}</span>)}
    </div>
  </div>
);

const UserExperiences = ({ experiences }: { experiences: UserData['experiences'] }) => (
  <div className="flex flex-col">
    <h2 className="text-base font-semibold">Work Experiences</h2>
    <ul className="flex flex-col gap-[16px] mt-1">
      {experiences.map((experience, index) => <ExperienceDetails key={index} experience={experience} />)}
    </ul>
  </div>
);

const ExperienceDetails = ({ experience }: { experience: UserData['experiences'][number] }) => (
  <li className="flex flex-col gap-[6px]">
    <h3 className="text-sm font-medium leading-snug">{experience.company}</h3>
    <RoleDates dates={experience.dates} />
    {experience.description && <p className="leading-snug">“{experience.description}”</p>}
    <ProjectList projects={experience.projects} />
  </li>
);

const RoleDates = ({ dates }: { dates: UserData['experiences'][number]['dates'] }) => (
  <ul className={`${dates.length > 1 ? "role-list" : ""}`}>
    {dates.map((date, index) => (
      <li className="flex gap-2 tracking-tight leading-snug" key={index}>
        <span className="font-medium">{date.role}</span> <span>{date.start} - {date.end}</span>
      </li>
    ))}
  </ul>
);

const ProjectList = ({ projects }: { projects: UserData['experiences'][number]['projects'] }) => (
  <ul className="print-flex print-flex-wrap gap-2 mt-1">
    {projects.map((project, index) => (
      <li key={index} className="print-w-1-2 content-center px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg">
        <h4 className="font-semibold tracking-tight leading-snug">{project.name}</h4>
        {project.description && <p className="leading-snug">{project.description}</p>}
        <div className="flex flex-wrap">{project.tech.join(", ")}</div>
      </li>
    ))}
  </ul>
);

export default UserProfile;
