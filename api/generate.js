export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'user',
            content: `Generate a full professional website configuration in JSON for: "${prompt}". 
            Return ONLY JSON. Fields:
            - brand, color, title, desc, iconName, imageSearchTerm (one english word for image search)
            - theme (either "dark" or "light" based on business type)
            - fontStyle (either "modern", "serif", or "mono")
            - features: 3 items {h, p}
            - pricing: 2 plans {name, price, features:[]}
            - testimonials: 2 items {name, text, role}
            - faq: 2 items {q, a}`
          }
        ],
        response_format: { type: 'json_object' }
      })
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}