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

  if (!API_KEY) {
    return res.status(500).json({ error: "GEMINI_API_KEY is not set. Please configure it in your environment variables." });
  }

  try {
    const model = 'gemini-1.5-flash'; // Or 'gemini-1.5-pro', 'gemini-pro', etc. Choose the model you intend to use.
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`;

    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: prompt
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 1,
        maxOutputTokens: 512,
        candidateCount: 1
      }
    };

    const response = await axios.post(url, requestBody);

    // The response structure for text generation is usually candidates[0].content.parts[0].text
    const reply = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated.";
    res.json({ reply });

  } catch (err) {
    console.error("Error calling Gemini API:");
    if (err.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("Response data:", err.response.data);
      console.error("Response status:", err.response.status);
      console.error("Response headers:", err.response.headers);
      res.status(err.response.status).json({
        error: "Something went wrong with the Gemini API call.",
        details: err.response.data
      });
    } else if (err.request) {
      // The request was made but no response was received
      console.error("No response received:", err.request);
      res.status(500).json({ error: "No response from Gemini API. Network error or API down." });
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Error message:", err.message);
      res.status(500).json({ error: "An unexpected error occurred.", details: err.message });
    }
  }
});

app.get('/', (req, res) => res.send('AI Backend is running.'));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
