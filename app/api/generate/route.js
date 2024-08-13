import { NextResponse } from "next/server";
import OpenAI from "openai";

const systemPrompt = `
You are a flashcard creator. Your task is to generate concise and effective flashcards based on the given topic or content. Follow these guidelines to create the flashcards:
1. create clear and consice questions for the front of the flashcard
2. provide accurate and informational answers for the back of the flashcard
3. ensure that each flashcard focuses on a single concept or piece of information
4. use simple language to make the flashcards accessible to a wide range of learners
5. include a variety of question types, such as definitions, exmaples, comparisons, and applications.
6. avoid overly complex or ambiguous questions or answers
7. when appropriate, use mnemonics, acronyms, or other memory aids to help learners retain information
8. Tailor difficulty level of the flashcards to the user's specified preferences
9. if given a body oftext, extract the most important and relevant infomration to create the flashcards
10. aim to create a balancd set of flashcards that covers the topic comprehensively
11. Only generates 10 flash cards

remember, the goal is to facilitate learning and retention of the material through these flashcards.

return in the following json format:
{
  "flashcards": 
  [{
    "front": string,
    "back": string
  }]
}   
`;

export async function POST(req) {
    const openai = new OpenAI(process.env.OPENAI_API_KEY);
    const data = await req.text()

    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "system",
                content: systemPrompt
            },
            {
                role: "user",
                content: data
            }
        ],
        response_format: { "type": "json_object" }
    });
    const flashcards = JSON.parse(completion.choices[0].message.content).flashcards;

    return NextResponse.json(flashcards);
}