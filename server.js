const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;
const API_KEY = process.env.GEMINI_API_KEY; // Set this in Render's env vars

app.post('/generate', async (req, res) => {
  const prompt = req.body.prompt;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required." });
  }

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
      {
        prompt: {
          text: prompt
        },
        temperature: 1,
        maxOutputTokens: 512,
        candidateCount: 1
      }
    );

    const reply = response.data.candidates?.[0]?.content?.text || "No response";
    res.json({ reply });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "Something went wrong." });
  }
});

app.get('/', (req, res) => res.send('AI Backend is running.'));
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
