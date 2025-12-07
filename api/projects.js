import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  // This looks inside the 'public/projects' folder (or just 'projects' depending on build)
  const projectsDirectory = path.join(process.cwd(), 'projects');

  try {
    const fileNames = fs.readdirSync(projectsDirectory);
    
    // Filter to only keep image files
    const images = fileNames.filter(file => 
      /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
    );

    res.status(200).json(images);
  } catch (error) {
    // Fallback if folder isn't found (prevents crash)
    console.error(error);
    res.status(200).json([]); 
  }
}
