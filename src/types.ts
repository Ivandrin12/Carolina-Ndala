export interface Post {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  category: string;
  image: string;
  createdAt: any;
  updatedAt: any;
  status: 'draft' | 'published';
  authorId: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Comment {
  id: string;
  postId: string;
  authorName: string;
  authorEmail: string;
  content: string;
  createdAt: any;
  status: 'pending' | 'approved';
}

export interface SiteSettings {
  siteName: string;
  siteDescription: string;
  heroTitle: string;
  heroSubtitle: string;
  aboutText: string;
  aboutImage: string;
  contactEmail: string;
  contactPhone: string;
  contactSocials: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    linkedin?: string;
  };
}
