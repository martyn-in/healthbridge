import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { text, type } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 });
    }

    let prompt = "";
    if (type === "symptoms") {
      prompt = `You are a medical AI assistant. Analyze the following symptoms and provide potential causes and recommendations. \n\nIMPORTANT: ALWAYS include a medical disclaimer that you are an AI and not a substitute for a professional doctor.\n\nSymptoms: ${text}`;
    } else if (type === "report") {
      prompt = `You are an expert medical data analyst. Analyze this extracted medical report text. Identify abnormal values (like high sugar, high cholesterol) and provide an easy-to-understand explanation for the patient.\n\nText: ${text}`;
    } else {
      prompt = `Analyze this medical information: ${text}`;
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Cost effective for basic analysis
      messages: [{ role: "user", content: prompt }],
    });

    return NextResponse.json({
      result: completion.choices[0].message.content,
    });
  } catch (error: any) {
    console.error("AI Analysis Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
