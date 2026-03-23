export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";
export const PROPERTY_FALLBACK_IMAGE = "/images/hero_bg_1.jpg";

export const resolveImageUrl = (imageUrl) => {
  if (!imageUrl) {
    return PROPERTY_FALLBACK_IMAGE;
  }

  if (/^https?:\/\//i.test(imageUrl)) {
    return imageUrl;
  }

  if (imageUrl.startsWith("/")) {
    return `${API_BASE_URL}${imageUrl}`;
  }

  return `${API_BASE_URL}/${imageUrl}`;
};

export const formatPropertyPrice = (price) => {
  if (price === null || price === undefined || price === "") {
    return "Price on request";
  }

  return `$${Number(price).toLocaleString()}`;
};

export const getPropertyLocation = (property) => {
  const parts = [property?.city, property?.state].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : "Location unavailable";
};
