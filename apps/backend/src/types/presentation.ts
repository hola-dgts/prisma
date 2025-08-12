// Presentation types
export interface PresentationContent {
  slides: Slide[];
  theme?: PresentationTheme;
  settings?: PresentationSettings;
}

export interface Slide {
  id: string;
  type: 'cover' | 'title' | 'index' | 'section_index' | 'content' | 'highlight' | 'keypoints' | 'metrics' | 'quote' | 'image' | 'video' | 'closing' | 'interactive';
  title?: string;
  subtitle?: string;
  content?: SlideContent[];
  elements?: SlideElement[];
  background?: SlideBackground;
  animation?: SlideAnimation;
  narration?: string;
  contextLinks?: ContextLink[];
}

export interface SlideContent {
  id: string;
  type: 'text' | 'image' | 'video' | 'button' | 'form';
  data: any; // Flexible content data
  position?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  style?: {
    fontSize?: string;
    color?: string;
    backgroundColor?: string;
    fontWeight?: string;
    textAlign?: 'left' | 'center' | 'right';
  };
}

// New v5 slide elements (compatible with v4 structure)
export interface SlideElement {
  type: 'text' | 'highlight' | 'keypoints' | 'metrics' | 'link' | 'image' | 'video';
  content?: string;
  title?: string;
  items?: Array<{
    text?: string;
    value?: string;
    label?: string;
    icon?: string;
    color?: string;
    number?: string;
    description?: string;
    slideIndex?: number;
  }>;
  style?: string;
  icon?: string;
  variant?: string;
  linkText?: string;
  afterText?: string;
}

export interface ContextLink {
  text: string;
  context: string;
  question: string;
}

export interface SlideBackground {
  type: 'color' | 'gradient' | 'image' | 'video';
  value: string;
}

export interface SlideAnimation {
  type: 'fade' | 'slide' | 'zoom' | 'flip';
  duration: number;
  delay?: number;
}

export interface PresentationTheme {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
}

export interface PresentationSettings {
  autoPlay: boolean;
  autoPlayDelay: number;
  showNavigation: boolean;
  showProgress: boolean;
  allowChat: boolean;
  allowVoice: boolean;
}

export interface CreatePresentationRequest {
  title: string;
  description?: string;
  content?: PresentationContent;
}

export interface UpdatePresentationRequest {
  title?: string;
  description?: string;
  content?: PresentationContent;
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
}

export interface Presentation {
  id: string;
  title: string;
  description?: string;
  content: PresentationContent;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  accessToken?: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
}

export interface PresentationResponse {
  id: string;
  title: string;
  description?: string;
  content: PresentationContent;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  accessToken?: string;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    name: string;
    email: string;
  };
}
