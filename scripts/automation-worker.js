const { GoogleGenerativeAI } = require("@google/generative-ai");
const nodemailer = require("nodemailer");

async function run() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const { CLIENT_NAME, CLIENT_PROBLEM, CLIENT_EMAIL, GMAIL_USER, GMAIL_PASS } = process.env;

  // 1. Generate Solution
  const prompt = `
    You are an expert n8n automation engineer at ZeroFlow AI.
    A client named ${CLIENT_NAME} has this problem: "${CLIENT_PROBLEM}".
    Write a short, professional email to them.
    - Subject: Automation Strategy for [Problem Summary]
    - Propose a specific n8n workflow solution.
    - Estimate time saved.
    - Sign off as "The ZeroFlow AI Team".
  `;
  
  const result = await model.generateContent(prompt);
  const emailContent = result.response.text();

  // 2. Send Email
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: GMAIL_USER,
      pass: GMAIL_PASS, 
    },
  });

  await transporter.sendMail({
    from: `"ZeroFlow AI" <${GMAIL_USER}>`,
    replyTo: "YOUR-PROTON-MAIL@proton.me", // <--- UPDATE THIS
    to: CLIENT_EMAIL,
    subject: `Your Automation Blueprint: ${CLIENT_NAME}`,
    text: emailContent,
  });

  console.log("Email sent.");
}

run().catch(console.error);
