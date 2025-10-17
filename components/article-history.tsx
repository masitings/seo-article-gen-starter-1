"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Search, 
  Calendar, 
  FileText, 
  Eye, 
  Trash2, 
  Filter,
  SortAsc,
  SortDesc
} from "lucide-react";
import { Article, ArticleSettings } from "@/db/schema/articles";
import { formatDate, truncateText } from "@/lib/utils";
import { toast } from "sonner";

interface ArticleHistoryProps {
  articles: (Article & { settings: ArticleSettings })[];
  isLoading: boolean;
  onSelectArticle: (article: Article & { settings: ArticleSettings }) => void;
  onDeleteArticle: (articleId: string) => Promise<void>;
}

type SortField = 'createdAt' | 'title' | 'articleSize';
type SortOrder = 'asc' | 'desc';

export function ArticleHistory({ 
  articles, 
  isLoading, 
  onSelectArticle, 
  onDeleteArticle 
}: ArticleHistoryProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // Filter and sort articles
  const filteredArticles = articles
    .filter(article => {
      const matchesSearch = 
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.keywords.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = 
        filterType === "all" || 
        article.settings.articleType === filterType;
      
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case 'createdAt':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'articleSize':
          const sizeOrder = { 'X-Small': 1, 'Small': 2, 'Medium': 3, 'Large': 4 };
          comparison = sizeOrder[a.settings.articleSize as keyof typeof sizeOrder] - 
                     sizeOrder[b.settings.articleSize as keyof typeof sizeOrder];
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const handleDelete = async (articleId: string, articleTitle: string) => {
    if (window.confirm(`Are you sure you want to delete "${articleTitle}"?`)) {
      try {
        await onDeleteArticle(articleId);
        toast.success("Article deleted successfully!");
      } catch (error) {
        toast.error("Failed to delete article");
      }
    }
  };

  const getLanguageName = (code: string) => {
    const languages: { [key: string]: string } = {
      'en': 'English', 'es': 'Spanish', 'fr': 'French', 'de': 'German',
      'it': 'Italian', 'pt': 'Portuguese', 'nl': 'Dutch', 'pl': 'Polish',
      'ru': 'Russian', 'ja': 'Japanese', 'ko': 'Korean', 'zh': 'Chinese',
      'ar': 'Arabic', 'hi': 'Hindi', 'tr': 'Turkish', 'sv': 'Swedish',
      'da': 'Danish', 'no': 'Norwegian', 'fi': 'Finnish'
    };
    return languages[code] || code;
  };

  const getSizeColor = (size: string) => {
    const colors = {
      'X-Small': 'bg-blue-100 text-blue-800',
      'Small': 'bg-green-100 text-green-800',
      'Medium': 'bg-yellow-100 text-yellow-800',
      'Large': 'bg-red-100 text-red-800'
    };
    return colors[size as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Article History</CardTitle>
          <CardDescription>Your previously generated articles</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-3 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Article History
        </CardTitle>
        <CardDescription>
          Your previously generated articles ({filteredArticles.length} total)
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Filters and Search */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="How-to guide">How-to guide</SelectItem>
                <SelectItem value="Listicle">Listicle</SelectItem>
                <SelectItem value="Product review">Product review</SelectItem>
                <SelectItem value="News">News</SelectItem>
                <SelectItem value="Comparison">Comparison</SelectItem>
                <SelectItem value="Case study">Case study</SelectItem>
                <SelectItem value="Opinion piece">Opinion piece</SelectItem>
                <SelectItem value="Tutorial">Tutorial</SelectItem>
                <SelectItem value="Roundup post">Roundup post</SelectItem>
                <SelectItem value="Q&A page">Q&A page</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Sort controls */}
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Sort by:</span>
            <div className="flex items-center gap-2">
              <Select value={sortField} onValueChange={(value: SortField) => setSortField(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt">Date</SelectItem>
                  <SelectItem value="title">Title</SelectItem>
                  <SelectItem value="articleSize">Size</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              >
                {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Articles List */}
        {filteredArticles.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-sm font-semibold text-muted-foreground">No articles found</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {searchTerm || filterType !== "all" 
                ? "Try adjusting your search or filters" 
                : "Generate your first article to see it here"}
            </p>
          </div>
        ) : (
          <ScrollArea className="h-[600px] w-full">
            <div className="space-y-4">
              {filteredArticles.map((article) => (
                <Card key={article.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 
                            className="font-medium hover:text-primary cursor-pointer flex-1"
                            onClick={() => onSelectArticle(article)}
                          >
                            {article.title}
                          </h3>
                          <Badge className={getSizeColor(article.settings.articleSize)}>
                            {article.settings.articleSize}
                          </Badge>
                          {article.settings.articleType !== 'None' && (
                            <Badge variant="outline">
                              {article.settings.articleType}
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(article.createdAt)}
                          </span>
                          <span className="flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            {article.content.split(' ').length} words
                          </span>
                          <span className="text-xs px-2 py-1 bg-muted rounded">
                            {getLanguageName(article.settings.language)}
                          </span>
                        </div>
                        
                        <div className="flex flex-wrap gap-1">
                          {article.keywords.split(',').slice(0, 3).map((keyword, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {keyword.trim()}
                            </Badge>
                          ))}
                          {article.keywords.split(',').length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{article.keywords.split(',').length - 3} more
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-sm text-muted-foreground">
                          {truncateText(article.content.replace(/[#*`\n]/g, '').substring(0, 200), 150)}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onSelectArticle(article)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(article.id, article.title)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}