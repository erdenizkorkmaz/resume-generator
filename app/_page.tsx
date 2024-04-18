import fs from 'fs';
import path from 'path';
import Link from 'next/link';

async function getData() {
  const filePath = path.join(process.cwd(), 'public', 'frontend.json');
  const jsonData = fs.readFileSync(filePath, 'utf8');

  const data = JSON.parse(jsonData);
  return data;
}

export default async function Home() {
  const data = await getData();

  return (
    <main className="flex min-h-screen flex-col gap-4 p-2 text-xs text-gray-900 max-w-[794px] mx-auto">
      <div className="flex flex-col gap-4 p-4 border border-gray-200 bg-gray-100 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex flex-col w-3/5">
            <h1 className="text-xl text-gray-800 font-medium tracking-tight ">
              {data.name} - {data.job}
            </h1>
            <ul className="flex flex-wrap">
              <li className="w-1/2"><b>Location: </b>{data.location}</li>
              <li className="w-1/2"><b>Mail: </b><Link href={`mailto:${data.mail}`}></Link>{data.mail}</li>
              <li className="w-1/2"><b>Phone: </b>{data.phone}</li>
              <li className="w-1/2"><b>Github: </b><Link href={`https://github.com/${data.github}`}>@{data.github}</Link></li>
            </ul>
          </div>
          {data.company && <div className="text-end tracking-tight leading-snug">
            <span>This resume is prepared <br />
              for <b className="text-base" contentEditable="true">{data.company}</b>
            </span>
          </div>}

        </div>
        <div>
          <p className="tracking-tight leading-snug">“{data.aboutme}”</p>
        </div>
      </div>
      <div className="flex flex-col">
        <h2 className="text-lg font-medium mb-2">Experiences</h2>
        <ul className="flex flex-col gap-5">
          { data.experiences.map((item: any, index: number) => {
            return <li key={index}>
              <div className="flex flex-col gap-2">
                <div className="flex flex-col">
                  <div className="flex flex-col">
                    <h3 className="text-sm font-medium">{item.company}</h3>
                    <ul className={`${item.dates.length > 1 && 'role-list'}`}>
                      {item.dates.map((date: any, index: number) => {
                        return  <li className='flex gap-2 tracking-tight leading-snug' key={index}><span className='font-medium'>{date.role}</span><span>{date.start} - {date.end}</span></li>
                      })}
                    </ul>
                  </div>
                </div>

                {item.description && <p className="leading-snug">“{item.description}”</p>}

                {item.bulletPoints.map((bullet: string, index: number) => {
                  return <p key={index} className="leading-snug">- {bullet}</p>
                })}

                <ul className="flex flex-col flex-wrap gap-1">
                  { item.projects.map((project: any, index: number) => {
                    return <li key={index} className="flex flex-col gap-1 py-1 px-4 border-b">
                      <h4 className='font-medium text-gray-800 tracking-tight leading-snug'>{project.name}</h4>
                      <div className='flex flex-wrap text-gray-500'>
                        {project.tech.map((tech: string, index: number) => {
                          return <span key={index} className='tracking-tight leading-snug '>
                            {tech}
                            {index !== project.tech.length-1 && <span>,&nbsp;</span>}
                          </span>
                        })}
                      </div>
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

