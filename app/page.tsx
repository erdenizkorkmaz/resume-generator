import fs from "fs";
import path from "path";
import Link from "next/link";

async function getData() {
  const filePath = path.join(process.cwd(), "public", "frontend.json");
  const jsonData = fs.readFileSync(filePath, "utf8");

  const data = JSON.parse(jsonData);
  return data;
}

export default async function Home() {
  const data = await getData();

  return (
    <main className="flex min-h-screen flex-col gap-4 p-2 text-[0.65rem] text-slate-900 max-w-[794px] mx-auto font-light antialiased">
      <div className="flex flex-col gap-2 p-4 border border-slate-200 bg-slate-100 rounded-[18px]">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="text-xl font-semibold tracking-tight ">
              {data.name} - {data.job}
            </h1>
            <ul className="flex flex-wrap">
              <li className="w-1/2">
                <b>Location: </b>
                {data.location}
              </li>
              <li className="w-1/2">
                <b>Mail: </b>
                <Link href={`mailto:${data.mail}`}>{data.mail}</Link>
              </li>
              <li className="w-1/2">
                <b>Phone: </b>
                {data.phone}
              </li>
              <li className="w-1/2">
                <b>Github: </b>
                <Link href={`https://github.com/${data.github}`}>@{data.github}</Link>
              </li>
            </ul>
          </div>
          {data.company && (
            <div className="text-end tracking-tight leading-snug">
              <span>
                This resume has been <br /> 
                prepared for <b className="text-base" contentEditable="true">{data.company}</b>
              </span>
            </div>
          )}
        </div>
        <div>
          <p className="tracking-tight leading-snug">“{data.aboutme}”</p>
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
                <h3 className="text-sm font-semibold">Technical Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {data.skills.technical.map((skill: string, index: number) => (
                    <span key={index} className="px-3 py-1 bg-gray-300 rounded-md">
                      {skill}
                    </span>
                  ))}
                </div>
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="text-sm font-semibold">Other Skills</h3>
            <div className="flex flex-wrap gap-2">
              {data.skills.soft.map((skill: string, index: number) => (
                <span key={index} className="px-3 py-1 bg-gray-300 rounded-md">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col mb-4">
        <h2 className="text-base font-semibold">Work Experiences</h2>
        <ul className="flex flex-col gap-[20px] mt-2">
          {data.experiences.map((item: any, index: number) => {
            return (
              <li key={index}>
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col">
                    <div className="flex flex-col">
                      <h3 className="text-sm font-medium">{item.company}</h3>
                      <ul className={`${item.dates.length > 1 && "role-list"}`}>
                        {item.dates.map((date: any, index: number) => {
                          return (
                            <li className="flex gap-2 tracking-tight leading-snug" key={index}>
                              <span className="font-medium">{date.role}</span>
                              <span>
                                {date.start} - {date.end}
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>

                  {item.description && <p className="leading-snug">“{item.description}”</p>}

                  <ul className="flex flex-wrap print-flex print-flex-wrap gap-2">
                    {item.projects.map((project: any, index: number) => {
                      return (
                        <li key={index} className="print-w-1-2 content-center px-3 py-2 bg-gray-200 rounded-lg">
                          <h4 className="font-semibold tracking-tight leading-snug">{project.name}</h4>
                          {project.description && <p className="leading-snug">{project.description}</p>}
                          <div className="flex flex-wrap">
                            {project.tech.join(", ")}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </main>
  );
}
