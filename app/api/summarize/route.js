import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Define the system prompt for summarization
const systemPrompt = `
You are an AI summarizer. Your task is to generate concise bullet points summarizing the following text. Follow these guidelines:
1. Provide a list of clear and concise bullet points.
2. Each bullet point should capture a key idea or important piece of information from the text.
3. Avoid unnecessary details and focus on the main points.
4. The bullet points should be easy to read and understand.

Return the summary in the following format:
- Bullet point 1
- Bullet point 2
- Bullet point 3
...and so on.
`;

// Define the POST handler
export async function POST(req) {
    const openai = new OpenAI(process.env.OPENAI_API_KEY);

    // Parse the request body as JSON
    const { text } = await req.json(); // Ensure the request is JSON and contains 'text'

    // Call the OpenAI API to get the summary
    const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini', // Ensure you're using a model suitable for your needs
        messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: text }
        ]
    });

    // Extract the summary from the response
    const summary = completion.choices[0].message.content.trim();

    // Return the summary as JSON
    return NextResponse.json({ summary });
}
