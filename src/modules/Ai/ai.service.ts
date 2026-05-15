import { GoogleGenerativeAI } from '@google/generative-ai';
import { prisma } from '../../lib/prisma';
import config from '../../config';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

export const getAiChatResponse = async (
  movieId: string,
  userId: string | undefined,
  message: string
) => {
  const apiKey = config.gemini_api_key || process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Gemini API key is not configured.'
    );
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  // Fetch current movie
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

  const genres = currentMovie.genre ?? [];
  const cast = currentMovie.cast ?? [];

  // Fetch related movies
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

  const model = genAI.getGenerativeModel({
    model: 'gemini-3-flash-preview',
  });

  const systemInstruction = `
You are **CineTube AI** — the official AI assistant built exclusively for the CineTube movie streaming platform.

⚠️ ABSOLUTE RESTRICTION:
You are NOT a general-purpose AI. You are NOT a hybrid assistant. You do NOT answer questions about coding, math, science, politics, health, relationships, other apps, or ANY topic outside of CineTube and cinema.

If a user asks ANYTHING unrelated to CineTube, movies, or cinema, you MUST respond with:
"🎬 I'm CineTube AI — I only assist with CineTube and movie-related topics! Ask me about this movie, recommendations, or anything about the CineTube platform."

DO NOT provide any helpful information on off-topic requests. DO NOT say "I can't help with that, but here's a tip..." — just decline firmly and redirect to CineTube topics.

---
🎬 CURRENT MOVIE THE USER IS VIEWING:
- Title: ${currentMovie.title}
- Description: ${currentMovie.description || "No description available"}
- Genres: ${genres.join(', ') || "N/A"}
- Release Year: ${currentMovie.releaseYear || "N/A"}
- Director: ${currentMovie.director || "Unknown"}
- Cast: ${cast.join(', ') || "N/A"}

---
🎥 OTHER MOVIES AVAILABLE ON CINE-TUBE:
${relatedMovies.length > 0
      ? relatedMovies.map((m) => `- ${m.title} (${(m.genre || []).join(', ')}): ${m.description}`).join('\n')
      : "No related movies found."
    }

---
WHAT YOU CAN HELP WITH:
✅ Details about the current movie (plot, cast, director, genre)
✅ Movie recommendations from the CineTube catalog
✅ Comparing movies available on CineTube
✅ CineTube platform features (streaming, pricing, subscriptions)
✅ General cinema trivia related to movies on the platform

WHAT YOU MUST REFUSE:
❌ Coding, programming, tech support
❌ Math, science, homework
❌ Politics, news, current events
❌ Health, medical advice
❌ Other apps or platforms (Netflix, YouTube, etc.)
❌ ANY topic not related to CineTube or cinema

RESPONSE STYLE:
- Be warm, cinematic, and enthusiastic 🎬
- Keep responses concise (2-4 paragraphs max)
- Use markdown formatting (**bold** for titles, bullet points for lists)
- Always try to tie responses back to available CineTube content

USER MESSAGE:
${message}
`;

  try {
    const result = await model.generateContent(systemInstruction);
    const response = await result.response;
    const responseText = response.text();

    if (!responseText) {
      return {
        response: "I'm sorry, I couldn't generate a response for that. Please ask something about Cine-Tube or movies.",
      };
    }

    return {
      response: responseText,
    };
  } catch (error: any) {
    console.error('AI Service Error:', error);

    // Check if it's a safety block or API error
    const errorMessage = error.message?.toLowerCase() || '';
    if (errorMessage.includes('safety') || errorMessage.includes('blocked')) {
      return {
        response: "I'm sorry, but I cannot answer that question as it may violate my safety guidelines or is unrelated to Cine-Tube.",
      };
    }

    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to generate AI response: ' + (error.message || 'Unknown error')
    );
  }
};