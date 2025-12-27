import type { Concert } from "../models/Concert.type";

export const getLikedConcerts = (): Concert[] => {
    return JSON.parse(localStorage.getItem("likedConcerts") || "[]");
};

export const isLiked = (concert: Concert): boolean => {
    const likedConcerts: Concert[] = getLikedConcerts();
    return likedConcerts.some((c) => c.id === concert.id);
};

export const toggleLike = (concert: Concert) => {
    const likedConcerts: Concert[] = getLikedConcerts();

    const index = likedConcerts.findIndex((c) => c.id === concert.id);
    if (index >= 0) {
        likedConcerts.splice(index, 1);
    } else {
        likedConcerts.push(concert);
    }

    localStorage.setItem("likedConcerts", JSON.stringify(likedConcerts));
};

export default {
    getLikedConcerts,
    isLiked,
    toggleLike,
};
