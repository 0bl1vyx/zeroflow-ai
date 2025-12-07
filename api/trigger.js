export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { name, email, problem } = req.body;

  // CHANGE THIS TO YOUR USERNAME
  const repo = 'YOUR_GITHUB_USERNAME/zeroflow-ai'; 

  try {
    const response = await fetch(`https://api.github.com/repos/${repo}/dispatches`, {
        method: 'POST',
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'Authorization': `token ${process.env.GITHUB_PAT}`,
        },
        body: JSON.stringify({
          event_type: 'trigger-automation',
          client_payload: { name, email, problem },
        }),
    });
    if (response.ok) res.status(200).json({ status: 'ok' });
    else res.status(500).json({ error: 'GitHub rejected' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
}
