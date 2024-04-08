import fs from 'fs';
import path from 'path';
import Link from 'next/link';

async function getData() {
  const filePath = path.join(process.cwd(), 'public', 'data.json');
  const jsonData = fs.readFileSync(filePath, 'utf8');
 
  // Parse the JSON data
  const data = JSON.parse(jsonData);

  // Return the JSON data
  return data;
}

export default async function Home() {
  const data = await getData()
  return (
    <main className="flex min-h-screen flex-col gap-8">
      <div className="flex flex-col gap-4">
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
            <span>This resume is prepared <br/>
                  for <b className="text-base">Microsoft</b>
            </span>
          </div>
        </div>
        <div>
          <p className="text-sm">I'm a web developer with 7+ years of experience in Angular, React, Flutter, Node.js, .NET, and MongoDB. I developed and designed modern and secure web applications that stand out in the Fintech, Tourism, and Education sectors. I'm committed to delivering seamless cross-browser performance, high-quality testing, and impactful UI/UX design. Beyond coding, I adept myself in designing mobile/desktop applications and managing small projects with Agile/Scrum.</p>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="text-xl">Experiences</h2>
        <ul className="flex flex-col gap-4">
          <li>
            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-2">
                <div className="flex flex-col">
                  <b className="text-lg">Lorem LTD. - Director</b>
                  <span>September 2017 - October 2021</span>
                </div>
                <p className="text-sm">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptate, deleniti! Alias earum culpa dolor dolorem
  cupiditate perferendis velit doloribus a ipsam explicabo ex quaerat minus nam repellendus, omnis cumque
  voluptatibus. orem ipsum dolor, sit amet consectetur adipisicing elit.</p>
              </div>
              <ul className="flex flex-wrap gap-2">
                <li className="flex flex-col w-2/5">
                  <b>Lorem Project - Team Leader</b>
                  <span>Angular, Node.js, MongoDB</span>
                </li>
                <li className="flex flex-col w-2/5">
                  <b>Lorem Project - Team Leader</b>
                  <span>Angular, Node.js, MongoDB</span>
                </li>
              </ul>
            </div>
          </li>
          <li>
            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-2">
                <div className="flex flex-col">
                  <b className="text-lg">Lorem LTD. - Director</b>
                  <span>September 2017 - October 2021</span>
                </div>
                <p className="text-sm">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptate, deleniti! Alias earum culpa dolor dolorem
  cupiditate perferendis velit doloribus a ipsam explicabo ex quaerat minus nam repellendus, omnis cumque
  voluptatibus. orem ipsum dolor, sit amet consectetur adipisicing elit.</p>
              </div>
              <ul className="flex flex-wrap gap-2">
                <li className="flex flex-col w-2/5">
                  <b>Lorem Project - Team Leader</b>
                  <span>Angular, Node.js, MongoDB</span>
                </li>
                <li className="flex flex-col w-2/5">
                  <b>Lorem Project - Team Leader</b>
                  <span>Angular, Node.js, MongoDB</span>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
    </main>
  );
}

