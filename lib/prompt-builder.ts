import { type ArticleSettings } from "@/db/schema/articles";

interface PromptData extends ArticleSettings {
  title: string;
  keywords: string;
}

export function buildArticlePrompt(data: PromptData): string {
  const {
    title,
    keywords,
    articleType,
    articleSize,
    tone,
    pointOfView,
    readability,
    aiCleaning,
    structure,
    language
  } = data;

  // Language settings
  const languageNames: { [key: string]: string } = {
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

  const targetLanguage = languageNames[language] || 'English';

  // Word count and heading requirements
  const sizeRequirements = {
    'X-Small': { words: '600-1200', h2: '2-5' },
    'Small': { words: '1200-2400', h2: '5-8' },
    'Medium': { words: '2400-3600', h2: '9-12' },
    'Large': { words: '3600-5200', h2: '13-16' }
  };

  const sizeReq = sizeRequirements[articleSize as keyof typeof sizeRequirements];

  // Build the prompt
  let prompt = `You are an expert SEO content writer. Write a comprehensive, SEO-optimized article in ${targetLanguage} based on the following specifications:

TITLE: ${title}
KEYWORDS: ${keywords}

ARTICLE REQUIREMENTS:
- Target Language: ${targetLanguage}
- Word Count: ${sizeReq.words} words
- H2 Headings: ${sizeReq.h2} sections
- Main Keywords: ${keywords}`;

  // Add article type if specified
  if (articleType !== 'None') {
    prompt += `\n- Article Type: ${articleType}`;
  }

  // Add tone if specified
  if (tone !== 'None') {
    const toneInstructions = {
      'Friendly': 'Use a warm, approachable, and conversational tone',
      'Professional': 'Maintain a formal, business-appropriate tone',
      'Informational': 'Focus on providing clear, educational information',
      'Transactional': 'Include clear calls-to-action and conversion-focused language',
      'Inspirational': 'Use motivational and uplifting language',
      'Neutral': 'Maintain an objective and unbiased tone',
      'Witty': 'Include clever humor and wordplay where appropriate',
      'Casual': 'Use informal, relaxed language',
      'Authoritative': 'Demonstrate expertise and confidence',
      'Encouraging': 'Use supportive and motivating language',
      'Persuasive': 'Focus on convincing the reader of your viewpoint',
      'Poetic': 'Use literary and expressive language'
    };
    
    prompt += `\n- Tone: ${toneInstructions[tone as keyof typeof toneInstructions] || tone}`;
  }

  // Add point of view if specified
  if (pointOfView !== 'None') {
    const povInstructions = {
      'First person singular': 'Write from "I", "me", "my", "mine" perspective',
      'First person plural': 'Write from "we", "us", "our", "ours" perspective', 
      'Second person': 'Write from "you", "your", "yours" perspective',
      'Third person': 'Write from "he", "she", "it", "they" perspective'
    };
    
    prompt += `\n- Point of View: ${povInstructions[pointOfView as keyof typeof povInstructions] || pointOfView}`;
  }

  // Add readability level if specified
  if (readability !== 'None') {
    const readabilityInstructions = {
      '5th grade': 'Use simple vocabulary and short sentences (11-year-old reading level)',
      '6th grade': 'Use conversational language with moderate complexity',
      '7th grade': 'Use fairly easy to read language with some complexity',
      '8th & 9th grade': 'Use easily understood language with moderate complexity',
      '10th to 12th grade': 'Use fairly difficult language with complex sentences',
      'College': 'Use difficult language with academic vocabulary',
      'College graduate': 'Use very difficult language with sophisticated vocabulary',
      'Professional': 'Use extremely difficult language specific to the industry'
    };
    
    prompt += `\n- Readability Level: ${readabilityInstructions[readability as keyof typeof readabilityInstructions] || readability}`;
  }

  // Add AI cleaning instructions
  if (aiCleaning !== 'No AI Words Removal') {
    const cleaningInstructions = {
      'Basic AI Words Removal': 'Avoid common AI phrases like "in conclusion", "furthermore", "moreover", "in addition", etc.',
      'Extended AI Words Removal': 'Eliminate all detectable AI patterns and phrases. Write like a human expert would naturally write.'
    };
    
    prompt += `\n- Content Style: ${cleaningInstructions[aiCleaning as keyof typeof cleaningInstructions] || aiCleaning}`;
  }

  // Add structure requirements
  prompt += `\n\nSTRUCTURE REQUIREMENTS:`;
  
  const structureItems = [];
  if (structure.conclusion) structureItems.push('Conclusion section');
  if (structure.faqSection) structureItems.push('FAQ section');
  if (structure.tables) structureItems.push('Data tables');
  if (structure.h3Headings) structureItems.push('H3 subheadings within sections');
  if (structure.lists) structureItems.push('Bulleted or numbered lists');
  if (structure.italics) structureItems.push('Italic text for emphasis');
  if (structure.bold) structureItems.push('Bold text for emphasis');
  if (structure.quotes) structureItems.push('Relevant quotes');
  if (structure.keyTakeaways) structureItems.push('Key takeaways section');

  if (structureItems.length > 0) {
    prompt += `\n- Include: ${structureItems.join(', ')}`;
  }

  prompt += `\n\nCONTENT GUIDELINES:
1. Create a compelling, SEO-friendly title that includes the main keywords
2. Write an engaging introduction that hooks the reader and includes the primary keywords
3. Develop ${sizeReq.h2} well-structured H2 sections with relevant content
4. Naturally incorporate the keywords throughout the content (${targetLanguage} language)
5. Ensure proper heading hierarchy (H1 > H2 > H3)
6. Include meta descriptions and SEO best practices
7. Write unique, valuable content that provides real insights
8. Use proper grammar, spelling, and punctuation in ${targetLanguage}
9. Ensure the content flows logically and is easy to read
10. Include internal/external linking opportunities where relevant

SEO REQUIREMENTS:
- Keyword density: 1-2% for main keywords
- Include LSI (Latent Semantic Indexing) keywords naturally
- Use semantic HTML5 structure
- Include meta title (50-60 characters) and description (150-160 characters)
- Ensure mobile readability
- Include relevant entities and concepts

Please write the complete article now. Start with the title, followed by the meta description, then the full article content. Make sure to follow all the specified requirements and create high-quality, engaging content that ranks well in search engines.`;

  return prompt;
}