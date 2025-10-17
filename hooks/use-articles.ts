"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Article, ArticleSettings } from "@/db/schema/articles";
import { generateId } from "@/lib/utils";
import { toast } from "sonner";

type ArticleFormData = {
  title: string;
  keywords: string;
  articleType: string;
  articleSize: string;
  tone: string;
  pointOfView: string;
  readability: string;
  aiCleaning: string;
  structure: {
    conclusion: boolean;
    faqSection: boolean;
    tables: boolean;
    h3Headings: boolean;
    lists: boolean;
    italics: boolean;
    bold: boolean;
    quotes: boolean;
    keyTakeaways: boolean;
  };
  language: string;
};

// Generate article mutation
export function useGenerateArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ArticleFormData) => {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to generate article");
      }

      return response.json();
    },
    onSuccess: (data) => {
      toast.success("Article generated successfully!");
      // Invalidate articles query to refresh the list
      queryClient.invalidateQueries({ queryKey: ["articles"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to generate article");
    },
  });
}

// Get articles query
export function useArticles() {
  return useQuery({
    queryKey: ["articles"],
    queryFn: async () => {
      const response = await fetch("/api/articles");
      
      if (!response.ok) {
        throw new Error("Failed to fetch articles");
      }

      return response.json() as Promise<(Article & { settings: ArticleSettings })[]>;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Delete article mutation
export function useDeleteArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (articleId: string) => {
      const response = await fetch(`/api/articles/${articleId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete article");
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success("Article deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["articles"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete article");
    },
  });
}

// Get single article query
export function useArticle(articleId: string) {
  return useQuery({
    queryKey: ["articles", articleId],
    queryFn: async () => {
      const response = await fetch(`/api/articles/${articleId}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch article");
      }

      return response.json() as Promise<Article & { settings: ArticleSettings }>;
    },
    enabled: !!articleId,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}