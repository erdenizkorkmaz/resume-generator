// pages/index.js
import fs from 'fs';
import path from 'path';
import UserProfile from '../components/UserProfile';
import { UserData } from '../types/userData';

async function getUserData(): Promise<UserData> {
  const filePath = path.join(process.cwd(), 'public', 'data.json');
  const jsonData = await fs.readFileSync(filePath, 'utf8');
  return JSON.parse(jsonData);
}

export default async function Home() {
  const userData = await getUserData();
  return <UserProfile data={userData} />;
}
