// backend/index.js

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;
const deepLApiKey = '725683f1-442e-4e1d-b0f2-a5bab126782d:fx';

const corsOptions = {
  origin: '*', // Allow requests from this origin
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Content-Type, Authorization',
  credentials: true,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

// Root route to verify server deployment
app.get('/', (req, res) => {
  res.send('Backend server is running successfully!');
});

app.post('/translate', async (req, res) => {
  const { text, target_lang } = req.body;

  try {
    const fetch = await import('node-fetch');
    const response = await fetch.default('https://api-free.deepl.com/v2/translate', {
      method: 'POST',
      headers: {
        'Authorization': `DeepL-Auth-Key ${deepLApiKey}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        auth_key: deepLApiKey,
        text: text,
        target_lang: target_lang
      })
    });

    if (!response.ok) {
      console.error('Error Response:', response.status, response.statusText);
      return res.status(response.status).json({ error: 'Translation failed' });
    }

    const data = await response.json();
    res.json({
      translated_text: data.translations[0].text,
     
    });
    console.log('Translation:', data.translations[0].text);

  } catch (error) {
    console.error('Translation Error:', error);
    res.status(500).json({ error: 'Translation failed' });
  }
});



app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
