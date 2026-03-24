import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;
const galleryApiClient = axios.create({
  baseURL: API_URL,
});
export interface ReviewReply {
  id: string;
  message: string;
  reviewId: string;
  createdAt: string;
}
export interface Review {
  id: string;
  name: string;
  message: string;
  rating: number;
  createdAt: string;
  reply: ReviewReply | null;
}
export interface ReviewsResponse {
  success: string;
  reviews: Review[];
}
export interface CreateReviewPayload {
  name: string;
  message: string;
  rating: number;
}
export interface CreateReviewResponse {
  success: string;
  message: string;
  review: Review;
}
export interface GalleryImage {
  id: string;
  imageUrl: string;
  galleryId: string;
}
export interface GalleryItem {
  id: string;
  title: string;
  thumbnailUrl: string;
  isCommunityGallery: boolean;
  isAcademyGallery: boolean;
  createdAt: string;
  images: GalleryImage[];
}
export interface GalleryResponse {
  success: string;
  galleries: GalleryItem[];
}
export interface CreateGalleryPayload {
  title: string;
  thumbnail: string;
  images: string[];
  isCommunityGallery: boolean;
  isAcademyGallery: boolean;
}
export const getGalleryApi = async (): Promise<GalleryItem[]> => {
  try {
    const response =
      await galleryApiClient.get<GalleryResponse>("/public/gallery");
    return response.data.galleries;
  } catch (error) {
    console.error("Error fetching gallery:", error);
    throw error;
  }
};
export const getReviewsApi = async (): Promise<Review[]> => {
  try {
    const response =
      await galleryApiClient.get<ReviewsResponse>("/public/reviews");
    return response.data.reviews;
  } catch (error) {
    console.error("Error fetching reviews:", error);
    throw error;
  }
};
export const createReviewApi = async (
  payload: CreateReviewPayload,
): Promise<Review> => {
  try {
    const response = await galleryApiClient.post<CreateReviewResponse>(
      "/public/reviews",
      payload,
    );
    return response.data.review;
  } catch (error) {
    console.error("Error creating review:", error);
    throw error;
  }
};
export const uploadGalleryApi = async (
  payload: CreateGalleryPayload,
): Promise<GalleryItem> => {
  try {
    const token = localStorage.getItem("token");
    const response = await galleryApiClient.post<{
      success: string;
      gallery: GalleryItem;
    }>("/admin/gallery", payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.gallery;
  } catch (error) {
    console.error("Error creating gallery:", error);
    throw error;
  }
};
export const deleteGalleryImageApi = async (id: string): Promise<void> => {
  try {
    const token = localStorage.getItem("token");
    await galleryApiClient.delete(`/admin/gallery/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error("Error deleting gallery image:", error);
    throw error;
  }
};
export const deleteReviewApi = async (reviewId: string): Promise<void> => {
  try {
    const token = localStorage.getItem("token");
    await galleryApiClient.delete(`/admin/reviews/${reviewId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error("Error deleting review:", error);
    throw error;
  }
};
export default galleryApiClient;
