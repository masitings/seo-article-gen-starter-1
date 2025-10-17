"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Loader2, Wand2 } from "lucide-react";

const articleSettingsSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title must be less than 200 characters"),
  keywords: z.string().min(1, "Keywords are required").max(500, "Keywords must be less than 500 characters"),
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
  language: z.string().min(1, "Language is required"),
});

type ArticleSettingsForm = z.infer<typeof articleSettingsSchema>;

const articleTypes = [
  "None",
  "How-to guide", 
  "Listicle",
  "Product review",
  "News",
  "Comparison",
  "Case study",
  "Opinion piece",
  "Tutorial",
  "Roundup post",
  "Q&A page"
];

const articleSizes = [
  { value: "X-Small", label: "X-Small", description: "600-1200 words, 2-5 H2 headings" },
  { value: "Small", label: "Small", description: "1200-2400 words, 5-8 H2 headings" },
  { value: "Medium", label: "Medium", description: "2400-3600 words, 9-12 H2 headings" },
  { value: "Large", label: "Large", description: "3600-5200 words, 13-16 H2 headings" }
];

const tones = [
  "None", "Friendly", "Professional", "Informational", "Transactional", 
  "Inspirational", "Neutral", "Witty", "Casual", "Authoritative", 
  "Encouraging", "Persuasive", "Poetic"
];

const pointsOfView = [
  "None", "First person singular", "First person plural", "Second person", "Third person"
];

const readabilityLevels = [
  { value: "None", label: "None" },
  { value: "5th grade", label: "5th grade", description: "Easily understood by 11-year-olds" },
  { value: "6th grade", label: "6th grade", description: "Conversational language" },
  { value: "7th grade", label: "7th grade", description: "Fairly easy to read" },
  { value: "8th & 9th grade", label: "8th & 9th grade", description: "Easily understood" },
  { value: "10th to 12th grade", label: "10th to 12th grade", description: "Fairly difficult to read" },
  { value: "College", label: "College", description: "Difficult to read" },
  { value: "College graduate", label: "College graduate", description: "Very difficult to read" },
  { value: "Professional", label: "Professional", description: "Extremely difficult to read" }
];

const aiCleaningOptions = [
  "No AI Words Removal",
  "Basic AI Words Removal", 
  "Extended AI Words Removal"
];

const structureOptions = [
  { key: "conclusion", label: "Conclusion", description: "Add a concluding section" },
  { key: "faqSection", label: "FAQ Section", description: "Include frequently asked questions" },
  { key: "tables", label: "Tables", description: "Include data tables" },
  { key: "h3Headings", label: "H3 Headings", description: "Add subheadings" },
  { key: "lists", label: "Lists", description: "Include bulleted or numbered lists" },
  { key: "italics", label: "Italics", description: "Use italic text" },
  { key: "bold", label: "Bold", description: "Use bold text" },
  { key: "quotes", label: "Quotes", description: "Include quotes" },
  { key: "keyTakeaways", label: "Key Takeaways", description: "Add key takeaways section" }
];

const languages = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "it", name: "Italian" },
  { code: "pt", name: "Portuguese" },
  { code: "nl", name: "Dutch" },
  { code: "pl", name: "Polish" },
  { code: "ru", name: "Russian" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "zh", name: "Chinese" },
  { code: "ar", name: "Arabic" },
  { code: "hi", name: "Hindi" },
  { code: "tr", name: "Turkish" },
  { code: "sv", name: "Swedish" },
  { code: "da", name: "Danish" },
  { code: "no", name: "Norwegian" },
  { code: "fi", name: "Finnish" },
  { code: "cs", name: "Czech" },
  { code: "hu", name: "Hungarian" },
  { code: "ro", name: "Romanian" },
  { code: "bg", name: "Bulgarian" },
  { code: "hr", name: "Croatian" },
  { code: "sr", name: "Serbian" },
  { code: "sk", name: "Slovak" },
  { code: "et", name: "Estonian" },
  { code: "lv", name: "Latvian" },
  { code: "lt", name: "Lithuanian" },
  { code: "sl", name: "Slovenian" },
  { code: "mt", name: "Maltese" },
  { code: "ga", name: "Irish" },
  { code: "cy", name: "Welsh" },
  { code: "is", name: "Icelandic" },
  { code: "mk", name: "Macedonian" },
  { code: "sq", name: "Albanian" },
  { code: "bs", name: "Bosnian" },
  { code: "eu", name: "Basque" },
  { code: "ca", name: "Catalan" },
  { code: "gl", name: "Galician" },
  { code: "be", name: "Belarusian" },
  { code: "uk", name: "Ukrainian" },
  { code: "el", name: "Greek" },
  { code: "hy", name: "Armenian" },
  { code: "ka", name: "Georgian" },
  { code: "he", name: "Hebrew" },
  { code: "ur", name: "Urdu" },
  { code: "bn", name: "Bengali" },
  { code: "ta", name: "Tamil" },
  { code: "te", name: "Telugu" },
  { code: "ml", name: "Malayalam" },
  { code: "kn", name: "Kannada" },
  { code: "gu", name: "Gujarati" },
  { code: "pa", name: "Punjabi" },
  { code: "mr", name: "Marathi" },
  { code: "ne", name: "Nepali" },
  { code: "si", name: "Sinhala" },
  { code: "my", name: "Myanmar" },
  { code: "km", name: "Khmer" },
  { code: "lo", name: "Lao" },
  { code: "ka", name: "Georgian" },
  { code: "am", name: "Amharic" },
  { code: "sw", name: "Swahili" },
  { code: "zu", name: "Zulu" },
  { code: "af", name: "Afrikaans" },
  { code: "is", name: "Icelandic" },
  { code: "mt", name: "Maltese" },
  { code: "cy", name: "Welsh" }
];

interface ArticleGeneratorFormProps {
  onSubmit: (data: ArticleSettingsForm) => Promise<void>;
  isLoading?: boolean;
}

export function ArticleGeneratorForm({ onSubmit, isLoading = false }: ArticleGeneratorFormProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const form = useForm<ArticleSettingsForm>({
    resolver: zodResolver(articleSettingsSchema),
    defaultValues: {
      title: "",
      keywords: "",
      articleType: "None",
      articleSize: "Medium",
      tone: "None",
      pointOfView: "None",
      readability: "None",
      aiCleaning: "No AI Words Removal",
      structure: {
        conclusion: true,
        faqSection: false,
        tables: false,
        h3Headings: true,
        lists: true,
        italics: true,
        bold: true,
        quotes: false,
        keyTakeaways: false,
      },
      language: "en",
    },
  });

  const handleSubmit = async (data: ArticleSettingsForm) => {
    try {
      await onSubmit(data);
      form.reset();
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  const watchedValues = form.watch();

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="h-5 w-5" />
          SEO Article Generator
        </CardTitle>
        <CardDescription>
          Create SEO-optimized articles in any language with customizable settings
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Article Title</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter your article title..." 
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      The main title for your SEO article
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="keywords"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Main Keywords</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter main keywords separated by commas..."
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Primary keywords to target in the article
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="language"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Language</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {languages.map((lang) => (
                          <SelectItem key={lang.code} value={lang.code}>
                            {lang.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Language for the generated article
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            {/* Article Settings */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Core Settings</h3>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  {isExpanded ? "Show Less" : "Show More"}
                </Button>
              </div>

              <FormField
                control={form.control}
                name="articleType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Article Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select article type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {articleTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      The type of article you want to generate
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="articleSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Article Size</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                      >
                        {articleSizes.map((size) => (
                          <FormItem key={size.value} className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value={size.value} />
                            </FormControl>
                            <FormLabel className="font-normal">
                              <div>{size.label}</div>
                              <div className="text-sm text-muted-foreground">
                                {size.description}
                              </div>
                            </FormLabel>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tone of Voice</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select tone" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {tones.map((tone) => (
                          <SelectItem key={tone} value={tone}>
                            {tone}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      The tone and style of the article
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pointOfView"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Point of View</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select point of view" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {pointsOfView.map((pov) => (
                          <SelectItem key={pov} value={pov}>
                            {pov}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      The narrative perspective of the article
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="readability"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Text Readability</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select readability level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {readabilityLevels.map((level) => (
                          <SelectItem key={level.value} value={level.value}>
                            <div>{level.label}</div>
                            {level.description && (
                              <div className="text-xs text-muted-foreground">
                                {level.description}
                              </div>
                            )}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Target reading level for your audience
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="aiCleaning"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>AI Content Cleaning</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select AI cleaning level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {aiCleaningOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Level of AI word removal to make content sound more natural
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Article Structure */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Article Structure</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {structureOptions.map((option) => (
                  <FormField
                    key={option.key}
                    control={form.control}
                    name={`structure.${option.key as keyof typeof watchedValues.structure}`}
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            {option.label}
                          </FormLabel>
                          {option.description && (
                            <FormDescription>
                              {option.description}
                            </FormDescription>
                          )}
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6">
              <Button 
                type="submit" 
                disabled={isLoading}
                className="min-w-[140px]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Generate Article
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}