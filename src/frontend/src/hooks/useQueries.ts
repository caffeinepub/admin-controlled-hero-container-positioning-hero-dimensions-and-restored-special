import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type {
  WebsiteContent,
  FooterContent,
  Clinic,
  Service,
  SocialMediaLink,
  WebsiteImage,
  UserProfile,
  DoctorCredentials,
  HeroSectionTheme,
  Review,
  ReviewsPanelSettings,
  BlogPost,
} from '../backend';

// User Profile Queries
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// Admin Check Query
export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

// Website Content Queries
export function useGetWebsiteContent() {
  const { actor, isFetching } = useActor();

  return useQuery<WebsiteContent>({
    queryKey: ['websiteContent'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getWebsiteContent();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateWebsiteContent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (content: WebsiteContent) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateWebsiteContent(content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['websiteContent'] });
    },
  });
}

// Footer Content Queries
export function useGetFooterContent() {
  const { actor, isFetching } = useActor();

  return useQuery<FooterContent>({
    queryKey: ['footerContent'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getFooterContent();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateFooterContent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (content: FooterContent) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateFooterContent(content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['footerContent'] });
    },
  });
}

// Clinics Queries
export function useGetAllClinics() {
  const { actor, isFetching } = useActor();

  return useQuery<Clinic[]>({
    queryKey: ['clinics'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllClinics();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddClinic() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (clinic: Clinic) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addClinic(clinic);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clinics'] });
    },
  });
}

export function useUpdateClinic() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (clinic: Clinic) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateClinic(clinic);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clinics'] });
    },
  });
}

export function useDeleteClinic() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteClinic(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clinics'] });
    },
  });
}

// Services Queries
export function useGetAllServices() {
  const { actor, isFetching } = useActor();

  return useQuery<Service[]>({
    queryKey: ['services'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllServices();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddService() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (service: Service) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addService(service);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
  });
}

export function useUpdateService() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (service: Service) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateService(service);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
  });
}

export function useDeleteService() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteService(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
  });
}

// Social Media Queries
export function useGetSortedSocialMediaLinks() {
  const { actor, isFetching } = useActor();

  return useQuery<SocialMediaLink[]>({
    queryKey: ['socialMediaLinks'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getSortedSocialMediaLinks();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddSocialMediaLink() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (link: SocialMediaLink) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addSocialMediaLink(link);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['socialMediaLinks'] });
    },
  });
}

export function useUpdateSocialMediaLink() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (link: SocialMediaLink) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateSocialMediaLink(link);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['socialMediaLinks'] });
    },
  });
}

export function useDeleteSocialMediaLink() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (platform: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteSocialMediaLink(platform);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['socialMediaLinks'] });
    },
  });
}

// Images Queries
export function useGetAllImages() {
  const { actor, isFetching } = useActor();

  return useQuery<WebsiteImage[]>({
    queryKey: ['images'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllImages();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetImage(id: string) {
  const { actor, isFetching } = useActor();

  return useQuery<WebsiteImage | null>({
    queryKey: ['image', id],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getImage(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useAddImage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (image: WebsiteImage) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addImage(image);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['images'] });
    },
  });
}

export function useUpdateImage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (image: WebsiteImage) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateImage(image);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['images'] });
    },
  });
}

// Doctor Credentials Queries
export function useGetDoctorCredentials() {
  const { actor, isFetching } = useActor();

  return useQuery<DoctorCredentials>({
    queryKey: ['doctorCredentials'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getDoctorCredentials();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateDoctorCredentials() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: DoctorCredentials) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateDoctorCredentials(credentials);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctorCredentials'] });
      queryClient.invalidateQueries({ queryKey: ['websiteContent'] });
    },
  });
}

// Hero Section Theme Queries
export function useGetHeroSectionTheme() {
  const { actor, isFetching } = useActor();

  return useQuery<HeroSectionTheme>({
    queryKey: ['heroSectionTheme'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getHeroSectionTheme();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateHeroSectionTheme() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (theme: HeroSectionTheme) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateHeroSectionTheme(theme);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['heroSectionTheme'] });
    },
  });
}

export function useGetHeroBackgroundImage() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['heroBackgroundImage'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getHeroSectionBackgroundImage();
    },
    enabled: !!actor && !isFetching,
  });
}

// Reviews Queries
export function useGetAllReviews() {
  const { actor, isFetching } = useActor();

  return useQuery<Review[]>({
    queryKey: ['reviews'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllReviews();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddReview() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (review: Review) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addReview(review);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
    retry: false,
  });
}

export function useUpdateReview() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (review: Review) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateReview(review);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
}

export function useDeleteReview() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteReview(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
}

export function useGetReviewSettings() {
  const { actor, isFetching } = useActor();

  return useQuery<ReviewsPanelSettings>({
    queryKey: ['reviewSettings'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getReviewSettings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateReviewSettings() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (settings: ReviewsPanelSettings) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateReviewSettings(settings);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviewSettings'] });
    },
  });
}

// Blog Post Queries
export function useGetAllBlogPosts() {
  const { actor, isFetching } = useActor();

  return useQuery<BlogPost[]>({
    queryKey: ['blogPosts'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllBlogPosts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetBlogPost(id: string) {
  const { actor, isFetching } = useActor();

  return useQuery<BlogPost | null>({
    queryKey: ['blogPost', id],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getBlogPost(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useCreateOrUpdateBlogPost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (post: BlogPost) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createOrUpdateBlogPost(post);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
    },
  });
}

export function useDeleteBlogPost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteBlogPost(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
    },
  });
}
