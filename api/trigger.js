export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { name, email, problem } = req.body;

  // !!! UPDATE THIS LINE WITH YOUR USERNAME !!!
  const repoPath = 'YOUR_GITHUB_USERNAME/zeroflow-ai'; 

  console.log("Triggering workflow for:", repoPath);

  try {
    const response = await fetch(
      `https://api.github.com/repos/${repoPath}/dispatches`,
      {
        method: 'POST',
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'Authorization': `token ${process.env.GITHUB_PAT}`,
        },
        body: JSON.stringify({
          event_type: 'trigger-automation',
          client_payload: { name, email, problem },
        }),
      }
    );

    if (response.ok) {
      res.status(200).json({ message: 'Triggered' });
    } else {
      const errorText = await response.text();
      console.error("GitHub Error:", errorText);
      res.status(500).json({ error: 'GitHub Refused', details: errorText });
    }
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ error: 'Server Error' });
  }
}
