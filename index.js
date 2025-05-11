require("dotenv").config();
const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();

// لیست دامنه‌های مجاز برای CORS
const allowedOrigins = [
  "https://esfahancenter.com",
  "https://www.esfahancenter.com",
  "http://localhost:5500",
  "http://127.0.0.1:5500"
];

// فعال‌سازی CORS فقط برای دامنه‌های مجاز
app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("❌ دسترسی از این دامنه مجاز نیست."));
    }
  }
}));

app.use(express.json());

// مسیر چت‌بات
app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      },
      body: JSON.stringify({
        model: "mistralai/mistral-7b-instruct:free",
        messages: [
          {
            role: "system",
            content: "شما یک راهنمای تخصصی گردشگری اصفهان هستید. فقط درباره جاذبه‌ها، هتل‌ها، رستوران‌ها و تورهای esfahancenter.com پاسخ دهید. اگر سوال نامربوط بود، بگویید: 'متأسفم من فقط در مورد اصفهان کمک می‌کنم.'"
          },
          {
            role: "user",
            content: userMessage
          }
        ]
      })
    });

    const data = await response.json();

    if (data.choices?.[0]?.message?.content) {
      res.json({ reply: data.choices[0].message.content });
    } else {
      res.status(500).json({ reply: "❌ پاسخی دریافت نشد. لطفاً دوباره تلاش کنید." });
    }
  } catch (error) {
    console.error("❌ خطا در سرور:", error);
    res.status(500).json({ reply: "❌ خطا در ارتباط با سرور. لطفاً بعداً تلاش کنید." });
  }
});

// اجرای سرور
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
