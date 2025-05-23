require("dotenv").config();
const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();

// دامنه‌های مجاز برای دسترسی
const allowedOrigins = [
  "https://esfahancenter.com",
  "https://www.esfahancenter.com",
  "http://localhost:5500",
  "http://127.0.0.1:5500",
  "https://esfahancenter-2.onrender.com" 
  "https://esfahancenter.onrender.com"// دامنه جدید اضافه شده
];

// تنظیمات CORS
app.use(cors({
  origin: function(origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("❌ دسترسی از این دامنه مجاز نیست."));
    }
  }
}));

app.use(express.json());

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
      res.status(500).json({ reply: "پاسخی دریافت نشد." });
    }
  } catch (error) {
    console.error("خطا:", error);
    res.status(500).json({ reply: "خطا در ارتباط با سرور." });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
