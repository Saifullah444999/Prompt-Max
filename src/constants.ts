export interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  prompt: string;
  icon: string;
}

export const PROMPT_TEMPLATES: PromptTemplate[] = [
  {
    id: 'blog-idea',
    name: 'Blog Idea Gen',
    description: 'Generate viral blog post topics',
    prompt: 'Topic: \nTarget Audience: \nTone: \nGoal: ',
    icon: 'FileText'
  },
  {
    id: 'code-explainer',
    name: 'Code Explainer',
    description: 'Break down complex code',
    prompt: 'Code Snippet: \nLanguage: \nTarget Audience: Beginner\nExplain level: Step-by-step',
    icon: 'Code'
  },
  {
    id: 'story-starter',
    name: 'Story Starter',
    description: 'Kickstart your next novel',
    prompt: 'Genre: \nProtagonist: \nTheme: \nInciting Incident: ',
    icon: 'PenTool'
  },
  {
    id: 'professional-email',
    name: 'Email Pro',
    description: 'Draft perfect business emails',
    prompt: 'Recipient: \nContext: \nKey Message: \nCall to Action: ',
    icon: 'Mail'
  },
  {
    id: 'youtube-script',
    name: 'YouTube Script',
    description: 'Outline engaging video content',
    prompt: 'Video Topic: \nDuration: \nHook: \nCore Content: \nCTA: ',
    icon: 'Youtube'
  },
  {
    id: 'product-desc',
    name: 'Product Copy',
    description: 'Compelling eCommerce descriptions',
    prompt: 'Product Name: \nMain Benefit: \nKey Features: \nTarget Customer: ',
    icon: 'ShoppingBag'
  },
  {
    id: 'study-plan',
    name: 'Study Assistant',
    description: 'Create structured learning paths',
    prompt: 'Subject: \nCurrent Skill Level: \nTime Commitment: \nSpecific Goals: ',
    icon: 'BookOpen'
  }
];
