// pages/index.js
import fs from 'fs';
import path from 'path';
import UserProfile from '../components/UserProfile';
import { UserData } from '../types/userData';

async function getData() {
  const filePath = path.join(process.cwd(), 'public', 'data.json');
  const jsonData = await fs.readFileSync(filePath, 'utf8');
  const data = await JSON.parse(jsonData);

  return data;
}

export default async function Home() {
  const userData: UserData = await getData();
  return <UserProfile data={userData} />;
}
