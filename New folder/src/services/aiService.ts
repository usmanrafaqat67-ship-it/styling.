/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI } from "@google/genai";
import { StyleOption } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const aiService = {
  /**
   * Enhances a simple prompt into a cinematic, detailed one.
   */
  async enhancePrompt(simplePrompt: string): Promise<string> {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          {
            text: `Enhance this simple image generation prompt into a highly detailed, cinematic, and descriptive prompt for a professional AI image generator. 
            Original prompt: "${simplePrompt}"
            Include details about lighting, texture, atmosphere, and camera angles. Keep it under 100 words. Output ONLY the enhanced prompt string.`
          }
        ],
      });
      return response.text || simplePrompt;
    } catch (error) {
      console.error("Error enhancing prompt:", error);
      return simplePrompt;
    }
  },

  /**
   * Generates an image based on a prompt and style.
   */
  async generateImage(prompt: string, style: StyleOption): Promise<string> {
    try {
      const styledPrompt = `Style: ${style}. ${prompt}`;
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: [
          {
            text: styledPrompt,
          },
        ],
      });

      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
      throw new Error("No image generated");
    } catch (error) {
      console.error("Error generating image:", error);
      throw error;
    }
  },

  /**
   * Refines an image with face protection instructions.
   */
  async editImage(base64Image: string, instruction: string): Promise<string> {
    try {
      // Removing the prefix if exists
      const cleanBase64 = base64Image.replace(/^data:image\/\w+;base64,/, "");
      
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType: "image/png",
            },
          },
          {
            text: `Instruction: ${instruction}. 
            CRITICAL REQUIREMENT: This is a "Face Protection" edit. 
            Do NOT modify the face of the person in the image. 
            Maintain the exact identity, facial structure, and features. 
            Apply the enhancements ONLY to the background, lighting, and overall color grading. 
            Make it look cinematic and high-quality. Output ONLY the new image.`
          },
        ],
      });

      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
      throw new Error("No edited image returned");
    } catch (error) {
      console.error("Error editing image:", error);
      throw error;
    }
  }
};
