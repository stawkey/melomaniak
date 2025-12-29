import { create } from "zustand";
import type { Concert } from "../models/Concert.type";

type ConcertListState = {
    concerts: Concert[];
    totalPages: number;
    setConcerts: (concerts: Concert[]) => void;
    setTotalPages: (totalPages: number) => void;
};

export const useConcertList = create<ConcertListState>((set) => ({
    concerts: [],
    totalPages: 1,
    setConcerts: (concerts) => set({ concerts }),
    setTotalPages: (totalPages) => set({ totalPages }),
}));

type FavoriteConcertsStore = {
    concerts: Concert[];
    setConcerts: (concerts: Concert[]) => void;
    toggleFavorite: (concert: Concert) => void;
    isFavorite: (id: number) => boolean;
};

const STORAGE_KEY = "likedConcerts";

const loadFavorites = (): Concert[] => JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

const persist = (concerts: Concert[]) =>
    localStorage.setItem(STORAGE_KEY, JSON.stringify(concerts));

export const useFavoriteConcerts = create<FavoriteConcertsStore>((set, get) => ({
    concerts: loadFavorites(),
    setConcerts: (concerts) => set({ concerts }),
    toggleFavorite: (concert) => {
        const exists = get().concerts.some((c) => c.id === concert.id);
        const newList = exists
            ? get().concerts.filter((c) => c.id !== concert.id)
            : [...get().concerts, concert];
        set({ concerts: newList });
        persist(newList);
    },
    isFavorite: (id: number) => get().concerts.some((c) => c.id === id),
}));
