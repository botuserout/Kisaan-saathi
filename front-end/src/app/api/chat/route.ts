import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Fallback to avoid crash if key is missing, but will error on request
const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { query_text, language } = body;

        if (!apiKey) {
            console.error("GEMINI_API_KEY is missing in environment variables.");
            return NextResponse.json(
                { error: "Wait! The GEMINI_API_KEY is missing. Did you restart the server after adding it?" },
                { status: 500 }
            );
        }

        // Switched to gemini-pro (1.0) as requested
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `You are 'Kisan Saathi', an expert AI agricultural advisor for Indian farmers.
    
    User Query: "${query_text}"
    Language Context: ${language || 'English'}
    
    Instructions:
    1. Provide a helpful, practical, and accurate answer relevant to Indian agriculture.
    2. Keep the tone friendly, encouraging, and respectful (like a helpful neighbor).
    3. If the query is about crops, pests, weather, or schemes, provide specific details.
    4. Provide the response in simple format (markdown is supported).
    5. Allow for mix of English and local Indian context terms if appropriate.
    
    Response:`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({ response_text: text });
    } catch (error: any) {
        console.error("Gemini API Error Full:", error);
        // Return the actual error message to the client for debugging
        return NextResponse.json({
            error: `Gemini Error: ${error.message || "Unknown error"}. Check server logs.`
        }, { status: 500 });
    }
}
