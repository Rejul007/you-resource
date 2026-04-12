import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: NextRequest) {
  try {
    const { title, description } = await request.json();

    if (!title || !description) {
      return NextResponse.json(
        { error: 'Title and description are required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      // Fallback classification when no API key
      return NextResponse.json({
        subject: 'General Studies',
        topics: ['Study Resources', 'Learning Materials'],
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `You are an educational assistant. Given this study resource request, identify:
1) The main academic subject (e.g., Mathematics, Physics, Computer Science, History, Chemistry, Biology, Economics, Literature, etc.)
2) Specific topics mentioned or implied (list 3-7 specific topics)

Request title: ${title}
Request description: ${description}

Respond ONLY in JSON format: { "subject": "...", "topics": ["...", "..."] }`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }

    const parsed = JSON.parse(jsonMatch[0]);

    if (!parsed.subject || !Array.isArray(parsed.topics)) {
      throw new Error('Invalid response structure');
    }

    return NextResponse.json({
      subject: parsed.subject,
      topics: parsed.topics,
    });
  } catch (error) {
    console.error('Classify error:', error);
    // Return a fallback classification on error
    return NextResponse.json({
      subject: 'General Studies',
      topics: ['Study Resources', 'Learning Materials'],
    });
  }
}
