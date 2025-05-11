require("dotenv").config();
const express = require("express");
const fetch = require("node-fetch");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content:
              "شما یک راهنمای تخصصی گردشگری اصفهان هستید. فقط درباره جاذبه‌ها، هتل‌ها، رستوران‌ها و تورهای esfahancenter.com پاسخ دهید.",
          },
          { role: "user", content: userMessage },
        ],
      }),
    });

    const data = await response.json();

    console.log("🔵 پاسخ DeepSeek:", JSON.stringify(data, null, 2));

    if (data.choices?.[0]?.message?.content) {
      res.json({ reply: data.choices[0].message.content });
    } else {
      res.status(500).json({ reply: "پاسخی دریافت نشد (از API)." });
    }
  } catch (error) {
    console.error("❌ خطای ارتباط با DeepSeek:", error);
    res.status(500).json({ reply: "خطا در ارتباط با سرور." });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
