import { GoogleGenAI } from "@google/genai";
import { SearchResult } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const searchBiryaniSpots = async (location: string): Promise<SearchResult> => {
  if (!apiKey) {
    throw new Error("API Key is missing.");
  }

  const modelId = "gemini-2.5-flash";
  const userLocation = location.trim() ? `${location}, Kurnool` : "Kurnool";

  const prompt = `
    I am looking for the best restaurants for Biryani in ${userLocation}.
    Please search specifically for recent reviews and ratings.
    
    Structure your response carefully. I want to parse it into a list.
    Use the following format strictly for each restaurant you find (at least 3-5 top recommendations):
    
    ### [Restaurant Name]
    **Rating:** [Rating out of 5]
    **Why it's good:** [A concise summary of user reviews and what makes it special]
    **Famous for:** [Specific types of Biryani or dishes they are known for]

    After the list, provide a brief concluding sentence about the food scene in ${userLocation}.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        // responseMimeType: "application/json" // NOT ALLOWED with googleSearch
        // responseSchema: ... // NOT ALLOWED with googleSearch
      },
    });

    const text = response.text || "No results found.";
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;

    return {
      text,
      groundingMetadata: groundingMetadata as any, // Type assertion for our simplified interface
    };

  } catch (error) {
    console.error("Error fetching data from Gemini:", error);
    throw error;
  }
};