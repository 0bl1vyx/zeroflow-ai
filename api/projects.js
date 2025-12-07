import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  // Define path to projects folder
  // Note: In Vercel, static files are sometimes tricky. 
  // We check standard 'public/projects' or root 'projects'.
  const projectsDirectory = path.join(process.cwd(), 'projects');

  try {
    // Read directory
    const fileNames = fs.readdirSync(projectsDirectory);
    
    // Filter for images only
    const images = fileNames.filter(file => 
      /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
    );

    res.status(200).json(images);
  } catch (error) {
    // Graceful fallback if folder is missing
    console.error("Error reading projects directory:", error);
    res.status(200).json([]); 
  }
}
