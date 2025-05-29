const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Configuration, OpenAIApi } = require("openai");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY // We'll set this on Render dashboard
});
const openai = new OpenAIApi(configuration);

// Memory of the conversation
let messages = [{ role: "system", content: "You are a helpful assistant." }];

app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;
  messages.push({ role: "user", content: userMessage });

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo", // Or "gpt-4" if you want
      messages: messages
    });

    const reply = completion.data.choices[0].message.content;
    messages.push({ role: "assistant", content: reply });

    res.json({ reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ reply: "Sorry, something went wrong." });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
