import fs from 'fs';
import path from 'path';
import Link from 'next/link';

async function getData() {
  const filePath = path.join(process.cwd(), 'public', 'data.json');
  const jsonData = fs.readFileSync(filePath, 'utf8');

  const data = JSON.parse(jsonData);
  return data;
}

export default async function Home() {
  const data = await getData();

  return (
    <main className="flex min-h-screen flex-col gap-4 p-2 text-slate-900 max-w-[794px] mx-auto">
      <div className="flex flex-col gap-4 p-4 border border-slate-200 bg-slate-100 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex flex-col w-3/4">
            <h1 className="text-2xl text-blue-700 font-medium tracking-tight ">
              {data.name} - {data.job}
            </h1>
            <ul className="flex flex-wrap">
              <li className="w-1/2"><b>Location: </b>{data.location}</li>
              <li className="w-1/2"><b>Mail: </b>{data.mail}</li>
              <li className="w-1/2"><b>Phone: </b>{data.phone}</li>
              <li className="w-1/2"><b>Github: </b><Link href={`https://github.com/${data.github}`}>@{data.github}</Link></li>
            </ul>
          </div>
          {data.company && <div className="text-center text-sm">
            <span>This resume is prepared <br />
              for <b className="text-base">{data.company}</b>
            </span>
          </div>}

        </div>
        <div>
          <p className="text-sm tracking-tight leading-snug">“{data.aboutme}”</p>
        </div>
      </div>
      <div className="flex flex-col">
        <h2 className="text-xl font-medium">Experiences</h2>
        <ul className="flex flex-col">
          { data.experiences.map((item: any, index: number) => {
            return <li key={index} className='py-2'>
              <div className="flex flex-col gap-2">
                <div className="flex flex-col">
                  <div className="flex flex-col">
                    <h3 className="font-medium">{item.company}</h3>
                    <ul className={`${item.dates.length > 1 && 'role-list'}`}>
                      {item.dates.map((date: any, index: number) => {
                        return  <li className='flex gap-2 text-sm tracking-tight leading-snug' key={index}><span className='font-medium'>{date.role}</span><span>{date.start} - {date.end}</span></li>
                      })}
                    </ul>
                  </div>
                </div>

                {item.description && <p className="text-sm tracking-tight leading-snug">{item.description}</p>}

                <ul className="flex flex-row flex-wrap gap-2">
                  { item.projects.map((project: any, index: number) => {
                    return <li key={index} className="inline-flex flex-col py-1 px-3 border border-slate-200 bg-slate-100 rounded-md">
                      <h4 className='font-medium text-blue-700'>{project.name}</h4>
                      <div className='flex flex-wrap max-w-[270px] min-w-[0]'>
                        {project.tech.map((tech: string, index: number) => {
                          return <span key={index} className='text-sm tracking-tight leading-snug '>
                            {tech}
                            {index !== project.tech.length-1 && <span>,&nbsp;</span>}
                          </span>
                        })}
                      </div>
                      {/* <span className='text-sm tracking-tight leading-snug max-w-2/7 '>{project.tech.join(', ')}</span> */}
                    </li>
                  })}
                </ul>
              </div>
            </li>
          })}
        </ul>
      </div>
    </main>
  );
}

