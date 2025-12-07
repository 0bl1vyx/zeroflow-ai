// This runs on Vercel's Server, not the browser.
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { name, email, problem } = req.body;

  try {
    const response = await fetch(
      `https://api.github.com/repos/${process.env.GITHUB_REPOSITORY}/dispatches`,
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
      res.status(500).json({ error: 'GitHub Refused' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
}
