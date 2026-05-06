import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_INSTRUCTION = `You are the 'Prompt Max' Engine, a Senior Prompt Engineer specialized in transforming vague user inputs into high-performing, structured master prompts.

When a user provides an 'ordinary prompt', you must expand it using the following framework:
1. Context & Persona: Assign a specific expert role that is most suitable for the task.
2. Task Specification: Define the exact output required with clear goals.
3. Constraints: Add rules for tone, length, style, and what to avoid.
4. Formatting: Use Markdown, tables, or specific structures for maximum clarity.

Your output must be ONLY the "Master Prompt" itself. Do not include introductory text like "Here is your optimized prompt" or "Optimized result:". The user should be able to copy your entire response and paste it directly into an AI chat as their new prompt.

Maintain a professional, expert-level perspective.`;

export async function optimizePrompt(ordinaryPrompt: string): Promise<string> {
  if (!ordinaryPrompt.trim()) return "";

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: ordinaryPrompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    return response.text || "Failed to generate master prompt.";
  } catch (error) {
    console.error("Optimization error:", error);
    throw new Error("Could not optimize prompt. Please check your connection or try again.");
  }
}

export async function imageToPrompt(base64Image: string, mimeType: string): Promise<string> {
  try {
    const imagePart = {
      inlineData: {
        mimeType: mimeType,
        data: base64Image,
      },
    };
    
    const textPart = {
      text: "Analyze this image and create a highly detailed, professional prompt to recreate this image. Include lighting, composition, style, every minor detail, colors, and mood. The output should be a structured 'Master Prompt' that another AI could use to generate an identical or very similar image.",
    };

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: { parts: [imagePart, textPart] },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    return response.text || "Failed to analyze image.";
  } catch (error) {
    console.error("Image analysis error:", error);
    throw new Error("Could not analyze image. Please ensure the file is an image and try again.");
  }
}
