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
  console.log(data.experiences.length);
  return (
    <main className="flex min-h-screen flex-col gap-8 p-2">
      <div className="flex flex-col gap-4 p-4 border border-black">
        <div className="flex items-center justify-between">
          <div className="flex flex-col w-2/3">
            <h1 className="text-2xl">
              <span>{data.name}</span>
              <span> - </span>
              <span>{data.job}</span>
            </h1>
            <ul className="flex flex-wrap">
              <li className="w-1/2"><b>Location: </b>{data.location}</li>
              <li className="w-1/2"><b>Mail: </b>{data.mail}</li>
              <li className="w-1/2"><b>Phone: </b>{data.phone}</li>
              <li className="w-1/2"><b>Github: </b><Link href={data.github}>{data.name}</Link></li>
            </ul>
          </div>
          <div className="text-center text-sm">
            <span>This resume is prepared <br />
              for <b className="text-base">{data.company}</b>
            </span>
          </div>
        </div>
        <div>
          <p className="text-sm">{data.aboutme}</p>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="text-xl">Experiences</h2>
        <ul className="flex flex-col gap-4">
          { data.experiences.map((item: any, index: number) => {
            return <li key={index}>
              <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col">
                    <b className="text-lg">{item.company} - {item.role}</b>
                    <span>{item.date.start} - {item.date.end}</span>
                  </div>
                  <p className="text-sm">{item.description}</p>
                </div>
                <ul className="flex flex-wrap gap-2">
                  { item.projects.map((project: any, index: number) => {
                    return <li key={index} className="flex flex-col w-2/5 p-2">
                      <b>{project.name} - {project.role}</b>
                      <span>{project.tech.join(', ')}</span>
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

