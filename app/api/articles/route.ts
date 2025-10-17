import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { articles } from "@/db/schema/articles";
import { desc, eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
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

    // Fetch user's articles ordered by creation date
    const userArticles = await db
      .select()
      .from(articles)
      .where(eq(articles.userId, session.user.id))
      .orderBy(desc(articles.createdAt));

    console.log(`Retrieved ${userArticles.length} articles for user ${session.user.id}`);

    return NextResponse.json(userArticles);

  } catch (error) {
    console.error("Error fetching articles:", error);
    
    return NextResponse.json(
      { error: "Failed to fetch articles" },
      { status: 500 }
    );
  }
}