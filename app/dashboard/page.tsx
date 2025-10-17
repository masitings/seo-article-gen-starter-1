"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArticleGeneratorForm } from "@/components/article-generator-form";
import { ArticleHistory } from "@/components/article-history";
import { ArticleDisplay } from "@/components/article-display";
import { Toaster } from "@/components/ui/sonner";
import { useArticles, useGenerateArticle, useDeleteArticle } from "@/hooks/use-articles";
import { Article, ArticleSettings } from "@/db/schema/articles";
import { Wand2, History, Eye } from "lucide-react";

export default function Page() {
  const [activeTab, setActiveTab] = useState("generate");
  const [selectedArticle, setSelectedArticle] = useState<(Article & { settings: ArticleSettings }) | null>(null);

  const { data: articles, isLoading: articlesLoading, refetch: refetchArticles } = useArticles();
  const generateMutation = useGenerateArticle();
  const deleteMutation = useDeleteArticle();

  const handleGenerateArticle = async (data: any) => {
    await generateMutation.mutateAsync(data);
    // Switch to history tab after successful generation
    setActiveTab("history");
  };

  const handleSelectArticle = (article: Article & { settings: ArticleSettings }) => {
    setSelectedArticle(article);
    setActiveTab("view");
  };

  const handleDeleteArticle = async (articleId: string) => {
    await deleteMutation.mutateAsync(articleId);
    // If viewing the deleted article, go back to history
    if (selectedArticle?.id === articleId) {
      setSelectedArticle(null);
      setActiveTab("history");
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 max-w-7xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold">SEO Article Generator</h1>
          <p className="text-muted-foreground text-lg">
            Create high-quality, SEO-optimized articles in any language with AI
          </p>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="generate" className="flex items-center gap-2">
              <Wand2 className="h-4 w-4" />
              Generate
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              History ({articles?.length || 0})
            </TabsTrigger>
            <TabsTrigger 
              value="view" 
              className="flex items-center gap-2"
              disabled={!selectedArticle}
            >
              <Eye className="h-4 w-4" />
              View Article
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generate" className="mt-6">
            <div className="space-y-6">
              <ArticleGeneratorForm 
                onSubmit={handleGenerateArticle}
                isLoading={generateMutation.isPending}
              />
            </div>
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <ArticleHistory
              articles={articles || []}
              isLoading={articlesLoading}
              onSelectArticle={handleSelectArticle}
              onDeleteArticle={handleDeleteArticle}
            />
          </TabsContent>

          <TabsContent value="view" className="mt-6">
            {selectedArticle ? (
              <ArticleDisplay article={selectedArticle} />
            ) : (
              <div className="text-center py-12">
                <Eye className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-2 text-sm font-semibold text-muted-foreground">
                  No article selected
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Select an article from your history to view it here
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <Toaster />
    </div>
  );
}