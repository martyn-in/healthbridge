import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { messages, userProfile } = await req.json();
    const apiKey = process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ text: "OpenAI API Key is not configured. Please add OPENAI_API_KEY to your environment variables." });
    }

    const systemPrompt = `You are Aira, the clinical AI medical guide for HealthBridge AI.
Provide empathetic, evidence-based, clear, and professional medical information for patient ${userProfile?.name || 'User'}.
Always emphasize that your guidance is educational and does not replace a licensed doctor. If symptoms sound severe or life-threatening (e.g. chest pain, stroke signs, severe dyspnea), urge seeking emergency care immediately. Keep responses concise, supportive, and formatted in clean markdown.`;

    const apiMessages = [
      { role: 'system', content: systemPrompt },
      ...(messages || []).map((m: any) => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text,
      })),
    ];

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey.trim()}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: apiMessages,
        temperature: 0.7,
        max_tokens: 600,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('OpenAI API Error:', errText);
      return NextResponse.json({ text: "I am having trouble reaching the OpenAI Clinical engine right now. Please verify your connection or API configuration." });
    }

    const data = await res.json();
    const replyText = data.choices?.[0]?.message?.content || "I am here to support your healthcare needs. How else can I assist you?";

    return NextResponse.json({ text: replyText });
  } catch (err: any) {
    console.error('Chat Route Error:', err);
    return NextResponse.json({ text: "An error occurred while connecting to HealthBridge AI. Please try again." });
  }
}
