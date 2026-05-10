import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function test() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
    const result = await model.generateContent("Hello!");
    console.log("Success:", result.response.text());
  } catch (err) {
    console.error("Error:", err.message);
    console.error("Cause:", err.cause);
  }
}
test();
