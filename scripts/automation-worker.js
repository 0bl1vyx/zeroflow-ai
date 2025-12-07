const { GoogleGenerativeAI } = require("@google/generative-ai");
const nodemailer = require("nodemailer");

async function run() {
  console.log("Starting ZeroFlow AI Agent...");

  // 1. Setup Gemini
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const { CLIENT_NAME, CLIENT_PROBLEM, CLIENT_EMAIL, GMAIL_USER, GMAIL_PASS } = process.env;

  // 2. Generate the Solution Email
  console.log(`Analyzing problem for: ${CLIENT_NAME}`);
  
  const prompt = `
    You are an expert automation engineer at ZeroFlow AI.
    A client named ${CLIENT_NAME} has this manual problem: "${CLIENT_PROBLEM}".
    
    Write a short, high-value email to them.
    - Subject: Automation Strategy for [Problem Summary]
    - Propose a specific n8n workflow to solve it.
    - Estimate time saved (e.g., "This saves ~10 hours/week").
    - Keep it professional but friendly.
    - Sign off as "The ZeroFlow AI Team".
    - Do not include placeholders like [Your Name].
  `;
  
  const result = await model.generateContent(prompt);
  const emailContent = result.response.text();

  // 3. Send Email via Gmail
  console.log("Sending email...");
  
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: GMAIL_USER,
      pass: GMAIL_PASS, 
    },
  });

  await transporter.sendMail({
    from: `"ZeroFlow AI" <${GMAIL_USER}>`,
    to: CLIENT_EMAIL,
    subject: `Your Automation Blueprint: ${CLIENT_NAME}`,
    text: emailContent,
  });

  console.log("✅ Automation complete. Email sent successfully.");
}

run().catch(err => {
  console.error("❌ Error:", err);
  process.exit(1);
});
