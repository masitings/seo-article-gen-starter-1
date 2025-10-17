"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Copy, 
  Download, 
  Eye, 
  Calendar, 
  User, 
  FileText,
  Settings,
  ChevronDown,
  ChevronUp 
} from "lucide-react";
import { Article, ArticleSettings } from "@/db/schema/articles";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

interface ArticleDisplayProps {
  article: Article & { settings: ArticleSettings };
}

export function ArticleDisplay({ article }: ArticleDisplayProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState("content");

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Content copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy content");
    }
  };

  const downloadAsTxt = () => {
    const element = document.createElement("a");
    const file = new Blob([article.content], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${article.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success("Article downloaded successfully!");
  };

  const formatContent = (content: string) => {
    return content.split('\n').map((paragraph, index) => {
      if (paragraph.trim() === '') return null;
      
      // Check if it's a heading
      if (paragraph.startsWith('# ')) {
        return <h1 key={index} className="text-3xl font-bold mt-6 mb-4">{paragraph.substring(2)}</h1>;
      }
      if (paragraph.startsWith('## ')) {
        return <h2 key={index} className="text-2xl font-semibold mt-5 mb-3">{paragraph.substring(3)}</h2>;
      }
      if (paragraph.startsWith('### ')) {
        return <h3 key={index} className="text-xl font-semibold mt-4 mb-2">{paragraph.substring(4)}</h3>;
      }
      
      // Check if it's a list item
      if (paragraph.match(/^\d+\.\s/)) {
        return <li key={index} className="ml-6 mb-2">{paragraph.substring(paragraph.indexOf('.') + 2)}</li>;
      }
      if (paragraph.match(/^[-*]\s/)) {
        return <li key={index} className="ml-6 mb-2 list-disc">{paragraph.substring(2)}</li>;
      }
      
      // Regular paragraph
      return <p key={index} className="mb-4 leading-relaxed">{paragraph}</p>;
    });
  };

  const getLanguageName = (code: string) => {
    const languages: { [key: string]: string } = {
      'en': 'English',
      'es': 'Spanish',
      'fr': 'French',
      'de': 'German',
      'it': 'Italian',
      'pt': 'Portuguese',
      'nl': 'Dutch',
      'pl': 'Polish',
      'ru': 'Russian',
      'ja': 'Japanese',
      'ko': 'Korean',
      'zh': 'Chinese',
      'ar': 'Arabic',
      'hi': 'Hindi',
      'tr': 'Turkish',
      'sv': 'Swedish',
      'da': 'Danish',
      'no': 'Norwegian',
      'fi': 'Finnish'
    };
    return languages[code] || code;
  };

  const getSizeDisplay = (size: string) => {
    const sizes: { [key: string]: string } = {
      'X-Small': 'X-Small (600-1200 words)',
      'Small': 'Small (1200-2400 words)',
      'Medium': 'Medium (2400-3600 words)',
      'Large': 'Large (3600-5200 words)'
    };
    return sizes[size] || size;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <CardTitle className="text-xl">{article.title}</CardTitle>
            <CardDescription className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formatDate(article.createdAt)}
              </span>
              <span className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                {article.content.split(' ').length} words
              </span>
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(article.content)}
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={downloadAsTxt}
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Keywords */}
        <div className="flex flex-wrap gap-2">
          {article.keywords.split(',').map((keyword, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {keyword.trim()}
            </Badge>
          ))}
        </div>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="metadata">Metadata</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="mt-4">
            <ScrollArea className="h-[600px] w-full rounded-md border p-6">
              <div className="prose prose-gray max-w-none">
                {formatContent(article.content)}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="settings" className="mt-4">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Article Settings
                  </h4>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p><span className="font-medium">Type:</span> {article.settings.articleType}</p>
                    <p><span className="font-medium">Size:</span> {getSizeDisplay(article.settings.articleSize)}</p>
                    <p><span className="font-medium">Language:</span> {getLanguageName(article.settings.language)}</p>
                    <p><span className="font-medium">Tone:</span> {article.settings.tone}</p>
                    <p><span className="font-medium">Point of View:</span> {article.settings.pointOfView}</p>
                    <p><span className="font-medium">Readability:</span> {article.settings.readability}</p>
                    <p><span className="font-medium">AI Cleaning:</span> {article.settings.aiCleaning}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Structure Elements</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(article.settings.structure).map(([key, value]) => (
                      <div key={key} className="flex items-center gap-2 text-sm">
                        <div className={`w-2 h-2 rounded-full ${value ? 'bg-green-500' : 'bg-gray-300'}`} />
                        <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="metadata" className="mt-4">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Article ID:</span>
                  <p className="text-muted-foreground font-mono">{article.id}</p>
                </div>
                <div>
                  <span className="font-medium">User ID:</span>
                  <p className="text-muted-foreground font-mono">{article.userId}</p>
                </div>
                <div>
                  <span className="font-medium">Created:</span>
                  <p className="text-muted-foreground">{formatDate(article.createdAt)}</p>
                </div>
                <div>
                  <span className="font-medium">Updated:</span>
                  <p className="text-muted-foreground">{formatDate(article.updatedAt)}</p>
                </div>
                <div className="md:col-span-2">
                  <span className="font-medium">Keywords:</span>
                  <p className="text-muted-foreground">{article.keywords}</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}