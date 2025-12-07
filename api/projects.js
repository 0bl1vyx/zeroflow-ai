import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  // Vercel serverless environments are tricky. We check multiple potential locations.
  const possiblePaths = [
    path.join(process.cwd(), 'public', 'projects'), // Standard Next.js/Vercel structure
    path.join(process.cwd(), 'projects'),           // Root structure
    path.join(__dirname, '..', 'public', 'projects') // Relative fallback
  ];

  let foundImages = [];
  let debugPath = "";

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      try {
        const files = fs.readdirSync(p);
        foundImages = files.filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file));
        if (foundImages.length > 0) break; // Stop if we found images
      } catch (e) {
        console.error(`Error reading ${p}:`, e);
      }
    }
  }

  // Return empty array instead of crashing if nothing found
  res.status(200).json(foundImages);
}
