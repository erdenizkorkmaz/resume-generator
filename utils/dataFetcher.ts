import { UserData } from '../types/userData';
import fs from 'fs';
import path from 'path';

export async function getData(): Promise<UserData> {
    const filePath = path.join(process.cwd(), 'public', 'frontend.json');
    const jsonData = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(jsonData);
}
