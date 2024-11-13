import { GoogleGenerativeAI, getGenerativeModel } from "@google/generative-ai";

import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function GET(req) {
    const format = {
        question: "What is the capital of France?",
        options: ["London", "Berlin", "Paris", "Madrid"],
        correctAnswer: "Paris"
    };

    const prompt = `Generate 10 MCQs on the topic of Computer Networks, in JSON format. Each question should match this format: ${JSON.stringify(format)}`;

    const Response = await model.generateContent(prompt);
    
    let questionsArray = [];
    try {
        // Extract and log the questions text
        const questionsText = Response.response.candidates[0].content.parts[0].text;
        console.log("Raw questions text:", questionsText);

        // Check if text is wrapped in a JSON code block
        const cleanedText = questionsText.replace(/```json|```/g, "").trim();

        // Parse the cleaned text into an array
        questionsArray = JSON.parse(cleanedText);
    } catch (error) {
        console.error("Error parsing questions array:", error);
    }

    return NextResponse.json({ questionsArray });
}
