import { GoogleGenerativeAI } from "@google/generative-ai";
import config from "../../config";
import dotenv from "dotenv";

dotenv.config();

const checkModels = async () => {
  const apiKey = config.gemini_api_key || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("No API key found in config or .env");
    return;
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const testModels = ["gemini-2.0-flash", "gemini-1.5-flash", "gemini-pro"];

  for (const modelName of testModels) {
    try {
      console.log(`Testing model: ${modelName}...`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent("Say hello in one word.");
      const text = result.response.text();
      console.log(`✅ SUCCESS [${modelName}]: ${text.trim()}`);
    } catch (error: any) {
      console.error(`❌ FAIL [${modelName}]: ${error.message?.split('\n')[0]}`);
    }
  }
};

checkModels();