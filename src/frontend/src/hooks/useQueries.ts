import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type { Clinic, Service, SocialMediaLink, WebsiteContent, UserProfile, FooterContent, WebsiteImage, DoctorCredentials, HeroSectionTheme } from '../backend';
import { ExternalBlob } from '../backend';

// User Profile Queries
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      const result = await actor.getCallerUserProfile();
      return result ?? null;
    },
    enabled: !!actor && !!identity && !actorFetching,
    retry: false,
    staleTime: 5 * 60 * 1000,
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
      await actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      const result = await actor.isCallerAdmin();
      return result ?? false;
    },
    enabled: !!actor && !isFetching,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}

// Website Content Queries
export function useGetWebsiteContent() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<WebsiteContent>({
    queryKey: ['websiteContent'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      const content = await actor.getWebsiteContent();
      
      return {
        overviewContent: content?.overviewContent ?? '',
        aboutContent: content?.aboutContent ?? '',
        theme: content?.theme ?? { __kind__: 'light' as const },
        heroSection: {
          headline: content?.heroSection?.headline ?? '',
          subtext: content?.heroSection?.subtext ?? '',
          primaryButton: {
            text: content?.heroSection?.primaryButton?.text ?? '',
            link: content?.heroSection?.primaryButton?.link ?? '',
          },
          secondaryButton: content?.heroSection?.secondaryButton ?? undefined,
        },
        doctorCredentials: {
          name: content?.doctorCredentials?.name ?? '',
          qualifications: content?.doctorCredentials?.qualifications ?? '',
          specializations: content?.doctorCredentials?.specializations ?? '',
          yearsOfExperience: content?.doctorCredentials?.yearsOfExperience ?? '',
          achievements: content?.doctorCredentials?.achievements ?? '',
          profileImage: content?.doctorCredentials?.profileImage ?? undefined,
        },
      };
    },
    enabled: !!actor && !actorFetching,
    staleTime: 3 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
}

export function useUpdateWebsiteContent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (content: WebsiteContent) => {
      if (!actor) throw new Error('Actor not available');
      await actor.updateWebsiteContent(content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['websiteContent'] });
      queryClient.invalidateQueries({ queryKey: ['doctorCredentials'] });
    },
  });
}

// Doctor Credentials Queries
export function useGetDoctorCredentials() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<DoctorCredentials>({
    queryKey: ['doctorCredentials'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      const credentials = await actor.getDoctorCredentials();
      
      return {
        name: credentials?.name ?? '',
        qualifications: credentials?.qualifications ?? '',
        specializations: credentials?.specializations ?? '',
        yearsOfExperience: credentials?.yearsOfExperience ?? '',
        achievements: credentials?.achievements ?? '',
        profileImage: credentials?.profileImage ?? undefined,
      };
    },
    enabled: !!actor && !actorFetching,
    staleTime: 3 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
}

export function useUpdateDoctorCredentials() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: DoctorCredentials) => {
      if (!actor) throw new Error('Actor not available');
      await actor.updateDoctorCredentials(credentials);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctorCredentials'] });
      queryClient.invalidateQueries({ queryKey: ['websiteContent'] });
    },
  });
}

// Footer Content Queries
export function useGetFooterContent() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<FooterContent>({
    queryKey: ['footerContent'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      const content = await actor.getFooterContent();
      
      return {
        contact: {
          address: content?.contact?.address ?? '',
          phone: content?.contact?.phone ?? '',
          email: content?.contact?.email ?? '',
        },
        quickLinks: content?.quickLinks ?? [],
        copyright: content?.copyright ?? '',
        background: content?.background ?? undefined,
      };
    },
    enabled: !!actor && !actorFetching,
    staleTime: 3 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
}

export function useUpdateFooterContent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (content: FooterContent) => {
      if (!actor) throw new Error('Actor not available');
      await actor.updateFooterContent(content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['footerContent'] });
    },
  });
}

// Hero Section Theme Queries
export function useGetHeroSectionTheme() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<HeroSectionTheme>({
    queryKey: ['heroSectionTheme'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      const theme = await actor.getHeroSectionTheme();
      return theme;
    },
    enabled: !!actor && !actorFetching,
    staleTime: 3 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
}

export function useUpdateHeroSectionTheme() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (theme: HeroSectionTheme) => {
      if (!actor) throw new Error('Actor not available');
      await actor.updateHeroSectionTheme(theme);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['heroSectionTheme'] });
    },
  });
}

// Hero Background Image Query
export function useGetHeroBackgroundImage() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<{ standard: ExternalBlob; darkMode?: ExternalBlob } | null>({
    queryKey: ['heroBackgroundImage'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      const result = await actor.getHeroSectionBackgroundImage();
      return result ?? null;
    },
    enabled: !!actor && !actorFetching,
    staleTime: 3 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
}

// Clinic Queries
export function useGetAllClinics() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Clinic[]>({
    queryKey: ['clinics'],
    queryFn: async () => {
      if (!actor) return [];
      const clinics = await actor.getAllClinics();
      return Array.isArray(clinics) ? clinics : [];
    },
    enabled: !!actor && !actorFetching,
    staleTime: 3 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
}

export function useAddClinic() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (clinic: Clinic) => {
      if (!actor) throw new Error('Actor not available');
      await actor.addClinic(clinic);
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
      await actor.updateClinic(clinic);
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
      await actor.deleteClinic(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clinics'] });
    },
  });
}

// Service Queries
export function useGetAllServices() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Service[]>({
    queryKey: ['services'],
    queryFn: async () => {
      if (!actor) return [];
      const services = await actor.getAllServices();
      return Array.isArray(services) ? services : [];
    },
    enabled: !!actor && !actorFetching,
    staleTime: 3 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
}

export function useAddService() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (service: Service) => {
      if (!actor) throw new Error('Actor not available');
      await actor.addService(service);
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
      await actor.updateService(service);
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
      await actor.deleteService(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
  });
}

// Social Media Queries
export function useGetAllSocialMediaLinks() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<SocialMediaLink[]>({
    queryKey: ['socialMediaLinks'],
    queryFn: async () => {
      if (!actor) return [];
      const links = await actor.getSortedSocialMediaLinks();
      return Array.isArray(links) ? links : [];
    },
    enabled: !!actor && !actorFetching,
    staleTime: 3 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
}

export function useAddSocialMediaLink() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (link: SocialMediaLink) => {
      if (!actor) throw new Error('Actor not available');
      await actor.addSocialMediaLink(link);
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
      await actor.updateSocialMediaLink(link);
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
      await actor.deleteSocialMediaLink(platform);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['socialMediaLinks'] });
    },
  });
}

// Image Queries
export function useGetAllImages() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<WebsiteImage[]>({
    queryKey: ['images'],
    queryFn: async () => {
      if (!actor) return [];
      const images = await actor.getAllImages();
      return Array.isArray(images) ? images : [];
    },
    enabled: !!actor && !actorFetching,
    staleTime: 3 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
}

export function useGetImage() {
  const { actor, isFetching } = useActor();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      const result = await actor.getImage(id);
      return result ?? null;
    },
  });
}

export function useAddImage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (image: WebsiteImage) => {
      if (!actor) throw new Error('Actor not available');
      await actor.addImage(image);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['images'] });
      queryClient.invalidateQueries({ queryKey: ['heroBackgroundImage'] });
    },
  });
}

export function useUpdateImage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (image: WebsiteImage) => {
      if (!actor) throw new Error('Actor not available');
      await actor.updateImage(image);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['images'] });
      queryClient.invalidateQueries({ queryKey: ['heroBackgroundImage'] });
    },
  });
}

export function useDeleteImage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      await actor.deleteImage(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['images'] });
      queryClient.invalidateQueries({ queryKey: ['heroBackgroundImage'] });
    },
  });
}
