import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { z } from "zod";
import { db } from "@/db";
import { articles } from "@/db/schema/articles";
import { buildArticlePrompt } from "@/lib/prompt-builder";
import { generateId } from "@/lib/utils";
import OpenAI from "openai";

// Validation schema
const generateRequestSchema = z.object({
  title: z.string().min(1).max(200),
  keywords: z.string().min(1).max(500),
  articleType: z.enum(["None", "How-to guide", "Listicle", "Product review", "News", "Comparison", "Case study", "Opinion piece", "Tutorial", "Roundup post", "Q&A page"]),
  articleSize: z.enum(["X-Small", "Small", "Medium", "Large"]),
  tone: z.enum(["None", "Friendly", "Professional", "Informational", "Transactional", "Inspirational", "Neutral", "Witty", "Casual", "Authoritative", "Encouraging", "Persuasive", "Poetic"]),
  pointOfView: z.enum(["None", "First person singular", "First person plural", "Second person", "Third person"]),
  readability: z.enum(["None", "5th grade", "6th grade", "7th grade", "8th & 9th grade", "10th to 12th grade", "College", "College graduate", "Professional"]),
  aiCleaning: z.enum(["No AI Words Removal", "Basic AI Words Removal", "Extended AI Words Removal"]),
  structure: z.object({
    conclusion: z.boolean(),
    faqSection: z.boolean(),
    tables: z.boolean(),
    h3Headings: z.boolean(),
    lists: z.boolean(),
    italics: z.boolean(),
    bold: z.boolean(),
    quotes: z.boolean(),
    keyTakeaways: z.boolean(),
  }),
  language: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    // Validate session
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in to generate articles." },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = generateRequestSchema.parse(body);

    console.log("Generating article with settings:", {
      title: validatedData.title,
      userId: session.user.id,
      articleSize: validatedData.articleSize,
      language: validatedData.language,
    });

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    if (!process.env.OPENAI_API_KEY) {
      console.error("OpenAI API key not configured");
      return NextResponse.json(
        { error: "AI service configuration error. Please contact support." },
        { status: 500 }
      );
    }

    // Build the prompt
    const prompt = buildArticlePrompt(validatedData);

    console.log("Sending request to OpenAI...");

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Using the most capable model
      messages: [
        {
          role: "system",
          content: "You are an expert SEO content writer who creates high-quality, engaging articles that rank well in search engines. Always follow the specific requirements provided in each prompt."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7, // Balance between creativity and consistency
      max_tokens: getMaxTokens(validatedData.articleSize),
      top_p: 0.9,
      frequency_penalty: 0.1,
      presence_penalty: 0.1,
    });

    const generatedContent = completion.choices[0]?.message?.content;

    if (!generatedContent) {
      console.error("No content generated from OpenAI");
      return NextResponse.json(
        { error: "Failed to generate article content. Please try again." },
        { status: 500 }
      );
    }

    console.log("Successfully generated article content");

    // Save to database
    const articleId = generateId();
    const articleData = {
      id: articleId,
      userId: session.user.id,
      title: validatedData.title,
      content: generatedContent,
      keywords: validatedData.keywords,
      settings: {
        articleType: validatedData.articleType,
        articleSize: validatedData.articleSize,
        tone: validatedData.tone,
        pointOfView: validatedData.pointOfView,
        readability: validatedData.readability,
        aiCleaning: validatedData.aiCleaning,
        structure: validatedData.structure,
        language: validatedData.language,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.insert(articles).values(articleData);

    console.log("Article saved to database:", articleId);

    return NextResponse.json({
      success: true,
      articleId,
      title: validatedData.title,
      content: generatedContent,
      settings: articleData.settings,
    });

  } catch (error) {
    console.error("Article generation error:", error);

    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: "Invalid request data", 
          details: error.issues.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        },
        { status: 400 }
      );
    }

    // Handle OpenAI API errors
    if (error && typeof error === 'object' && 'error' in error) {
      const openaiError = error as any;
      console.error("OpenAI API error:", openaiError);
      
      if (openaiError.error?.type === 'insufficient_quota') {
        return NextResponse.json(
          { error: "AI service temporarily unavailable. Please try again later." },
          { status: 503 }
        );
      }
      
      if (openaiError.error?.type === 'invalid_request_error') {
        return NextResponse.json(
          { error: "Invalid AI service request. Please try again." },
          { status: 400 }
        );
      }
    }

    // Handle database errors
    if (error && typeof error === 'object' && 'code' in error) {
      const dbError = error as any;
      console.error("Database error:", dbError);
      
      if (dbError.code === '23505') { // Unique constraint violation
        return NextResponse.json(
          { error: "Duplicate article detected." },
          { status: 409 }
        );
      }
    }

    // Generic error response
    return NextResponse.json(
      { error: "Failed to generate article. Please try again." },
      { status: 500 }
    );
  }
}

function getMaxTokens(articleSize: string): number {
  const tokenLimits: { [key: string]: number } = {
    'X-Small': 2000,
    'Small': 4000,
    'Medium': 6000,
    'Large': 8000,
  };
  return tokenLimits[articleSize] || 4000;
}

// Handle other HTTP methods
export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed. Use POST to generate articles." },
    { status: 405 }
  );
}