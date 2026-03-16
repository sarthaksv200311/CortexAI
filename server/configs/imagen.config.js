import { GoogleGenAI } from "@google/genai";

const imagen = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default imagen;
