require("dotenv").config();
const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": "https://esfahancenter.com",
        "X-Title": "esfahancenter-chat"
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "شما یک راهنمای تخصصی گردشگری اصفهان هستید. فقط درباره جاذبه‌ها، هتل‌ها، رستوران‌ها و تورهای esfahancenter.com پاسخ دهید. اگر سوال نامربوط بود، بگویید: 'متأسفم من فقط در مورد اصفهان کمک می‌کنم.'"
          },
          { role: "user", content: userMessage }
        ]
      })
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content;

    if (reply) {
      res.json({ reply });
    } else {
      res.status(500).json({ reply: "پاسخی دریافت نشد." });
    }
  } catch (error) {
    console.error("خطا:", error);
    res.status(500).json({ reply: "خطا در ارتباط با سرور." });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
