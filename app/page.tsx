// pages/index.js
import fs from 'fs';
import path from 'path';
import UserProfile from '../components/UserProfile';
import { UserData } from '../types/userData';
import { JobsData } from '../components/JobsList';

async function getUserData(): Promise<UserData> {
  const filePath = path.join(process.cwd(), 'public', 'data.json');
  const jsonData = await fs.readFileSync(filePath, 'utf8');
  return JSON.parse(jsonData);
}

async function getJobsData(): Promise<JobsData | undefined> {
  try {
    const filePath = path.join(process.cwd(), 'public', 'jobs.json');
    const jsonData = await fs.readFileSync(filePath, 'utf8');
    return JSON.parse(jsonData);
  } catch (error) {
    console.log('Jobs data not found, skipping...');
    return undefined;
  }
}

export default async function Home() {
  const userData = await getUserData();
  const jobsData = await getJobsData();
  return <UserProfile data={userData} jobs={jobsData} />;
}
