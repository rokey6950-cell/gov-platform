export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed'
    });
  }

  try {
    console.log("KEY FOUND:", !!process.env.ANTHROPIC_API_KEY);
    console.log("REQUEST BODY:", req.body);

    const userText = req.body?.text || req.body?.message || "Hello";

    const payload = {
      model: "claude-3-5-sonnet-latest",
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: userText
        }
      ]
    };

    const response = await fetch(
      'https://api.anthropic.com/v1/messages',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await response.json();

    console.log("CLAUDE RESPONSE:", data);

    return res.status(response.status).json(data);

  } catch (error) {
    console.error("SERVER ERROR:", error);

    return res.status(500).json({
      error: error.message
    });
  }
}
