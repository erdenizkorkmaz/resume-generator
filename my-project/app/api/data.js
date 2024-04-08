// Import the filesystem module
import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  // Set the path to the JSON file
  // Adjust the path according to where you've placed your JSON file
  const filePath = path.join(process.cwd(), 'data', 'data.json');

  // Read the JSON file
  const jsonData = fs.readFileSync(filePath, 'utf8');

  // Parse the JSON data
  const data = JSON.parse(jsonData);

  // Return the JSON data
  res.status(200).json(data);
}
