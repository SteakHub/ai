// server.js
const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const API_KEY = process.env.GEMINI_API_KEY; // store in Render's env vars

app.post('/generate', async (req, res) => {
  const prompt = req.body.prompt;

  try {
    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + API_KEY,
      {
        contents: [{ parts: [{ text: prompt }] }]
      }
    );
    const reply = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
    res.json({ reply });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "Something went wrong." });
  }
});

app.get('/', (req, res) => res.send('AI Backend is running.'));
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
