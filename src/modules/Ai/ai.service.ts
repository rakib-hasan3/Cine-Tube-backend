import { GoogleGenerativeAI } from '@google/generative-ai';
import { prisma } from '../../lib/prisma';
import config from '../../config';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

export const getHybridChatResponse = async (
  movieId: string,
  userId: string | undefined,
  message: string
) => {
  // 🔴 1. Validate API key FIRST
  // যদি config থেকে না পায়, তবে সরাসরি process.env থেকে চেক করবে
  const apiKey = config.gemini_api_key || process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Gemini API key is not configured. Please check your .env file.'
    );
  }

  // 🔵 2. Initialize AI safely
  const genAI = new GoogleGenerativeAI(apiKey);

  // 🎬 3. Fetch current movie
  const currentMovie = await prisma.media.findUnique({
    where: { id: movieId, isDeleted: false },
    select: {
      title: true,
      description: true,
      genre: true,
      releaseYear: true,
      director: true,
      cast: true,
    },
  });

  if (!currentMovie) {
    throw new AppError(httpStatus.NOT_FOUND, 'Media not found');
  }

  // ✅ SAFE NORMALIZATION
  const genres = currentMovie.genre ?? [];
  const cast = currentMovie.cast ?? [];

  // 🎥 4. Fetch related movies
  const relatedMovies = await prisma.media.findMany({
    where: {
      isDeleted: false,
      id: { not: movieId },
      genre: genres.length > 0 ? { hasSome: genres } : undefined,
    },
    take: 5,
    orderBy: { createdAt: 'desc' },
    select: {
      title: true,
      genre: true,
      description: true,
    },
  });

  // 🤖 6. AI model
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash-latest',
  });

  // 🧠 7. System prompt
  const systemInstruction = `
You are the Cine-Tube Hybrid AI Assistant.
You help users with movie recommendations and explanations.

---
🎬 Current Movie:
Title: ${currentMovie.title}
Description: ${currentMovie.description || "No description available"}
Genres: ${genres.join(', ') || "N/A"}
Release Year: ${currentMovie.releaseYear || "N/A"}
Director: ${currentMovie.director || "Unknown"}
Cast: ${cast.join(', ') || "N/A"}

---
🎥 Related Movies:
${relatedMovies.length > 0
      ? relatedMovies.map((m) => `- ${m.title} (${(m.genre || []).join(', ')}): ${m.description}`).join('\n')
      : "No related movies found."
    }

---
💬 User Message:
${message}

---
Rules:
- Be helpful and cinematic
- Give movie suggestions if needed
- Keep response short and engaging
`;

  try {
    // 🚀 8. Generate AI response
    const result = await model.generateContent(systemInstruction);
    const responseText = result.response.text();

    return {
      response: responseText,
    };
  } catch (error: any) {
    console.error('AI Service Error:', error);
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to generate AI response: ' + (error.message || 'Unknown error')
    );
  }
};