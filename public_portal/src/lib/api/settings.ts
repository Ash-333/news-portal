import { apiFetch } from './client';

export interface SocialLinks {
  facebookUrl?: string;
  twitterUrl?: string;
  youtubeUrl?: string;
  instagramUrl?: string;
}

export interface ContactInfo {
  contactEmail?: string;
  contactPhone?: string;
  contactAddress?: string;
  contactAddressNe?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export function getSocialLinks(): Promise<ApiResponse<SocialLinks>> {
  return apiFetch<SocialLinks>('/api/settings/social', { method: 'GET' });
}

export function getContactInfo(): Promise<ApiResponse<ContactInfo>> {
  return apiFetch<ContactInfo>('/api/settings/contact', { method: 'GET' });
}