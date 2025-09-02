import { GoogleGenAI, Type } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const commonConfig = {
  temperature: 0.8,
  topP: 0.95,
  topK: 40,
};

export const generateStoryTitles = async (age: number, country: string, genre: string): Promise<string[]> => {
    const prompt = `
        Generate 5 unique, short, and creative bedtime story titles.
        The titles are for a ${age}-year-old child from ${country}.
        The genre of the stories is "${genre}".
        The titles should be enchanting and magical, under 10 words each.
        The response must be a JSON object with a single key "titles", which contains an array of exactly 5 unique string titles.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
              ...commonConfig,
              responseMimeType: "application/json",
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  titles: {
                    type: Type.ARRAY,
                    description: "A list of exactly 5 unique story titles, where each title is a string.",
                    items: {
                        type: Type.STRING
                    }
                  }
                },
                required: ["titles"]
              }
            }
        });
        
        const responseJson = JSON.parse(response.text);
        if (!responseJson.titles || !Array.isArray(responseJson.titles) || responseJson.titles.length === 0) {
            console.warn("Gemini API returned invalid titles object:", response.text);
            throw new Error("The magic ink seems to have run out! The generated titles are empty.");
        }
        return responseJson.titles;

    } catch (error) {
        console.error("Error generating story titles with Gemini API:", error);
        throw new Error("Could not generate story titles.");
    }
};


export const generateStoryFromTitle = async (title: string, age: number, country: string, genre: string): Promise<string> => {
  const prompt = `
    Write a short, calming, and highly engaging bedtime story based on the title: "${title}".
    The story is for a ${age}-year-old child from ${country} and should be in the genre of "${genre}".
    The story must have a positive and gentle message, perfect for helping a child fall asleep.
    Make it imaginative and magical, with friendly characters.
    Keep the story under 350 words. Ensure the language is simple and appropriate for the specified age.
    Only output the raw text of the story, with no extra formatting or labels.
  `;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          ...commonConfig,
        }
    });

    const storyText = response.text.trim();
    if (!storyText) {
      throw new Error("The magic ink seems to have run out! The generated story is empty.");
    }
    return storyText;
  } catch (error) {
    console.error("Error generating story with Gemini API:", error);
    throw new Error("Could not generate story.");
  }
};
