import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { articles } from "@/db/schema/articles";
import { eq } from "drizzle-orm";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Validate session
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const articleId = params.id;

    if (!articleId) {
      return NextResponse.json(
        { error: "Article ID is required" },
        { status: 400 }
      );
    }

    // Delete the article (only if it belongs to the user)
    const deleteResult = await db
      .delete(articles)
      .where(
        eq(articles.id, articleId)
      )
      .returning({ id: articles.id });

    if (deleteResult.length === 0) {
      return NextResponse.json(
        { error: "Article not found or you don't have permission to delete it" },
        { status: 404 }
      );
    }

    console.log(`Article ${articleId} deleted by user ${session.user.id}`);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Error deleting article:", error);
    
    return NextResponse.json(
      { error: "Failed to delete article" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Validate session
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const articleId = params.id;

    if (!articleId) {
      return NextResponse.json(
        { error: "Article ID is required" },
        { status: 400 }
      );
    }

    // Fetch the article (only if it belongs to the user)
    const article = await db
      .select()
      .from(articles)
      .where(
        eq(articles.id, articleId)
      )
      .limit(1);

    if (article.length === 0) {
      return NextResponse.json(
        { error: "Article not found or you don't have permission to access it" },
        { status: 404 }
      );
    }

    console.log(`Article ${articleId} accessed by user ${session.user.id}`);

    return NextResponse.json(article[0]);

  } catch (error) {
    console.error("Error fetching article:", error);
    
    return NextResponse.json(
      { error: "Failed to fetch article" },
      { status: 500 }
    );
  }
}