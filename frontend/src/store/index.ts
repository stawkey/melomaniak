import { create } from "zustand";
import { persist } from "zustand/middleware";
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

export const useFavoriteConcerts = create<FavoriteConcertsStore>()(
    persist(
        (set, get) => ({
            concerts: [],
            setConcerts: (concerts) => set({ concerts }),
            toggleFavorite: (concert) => {
                const exists = get().concerts.some((c) => c.id === concert.id);
                const newList = exists
                    ? get().concerts.filter((c) => c.id !== concert.id)
                    : [...get().concerts, concert];
                set({ concerts: newList });
            },
            isFavorite: (id: number) => get().concerts.some((c) => c.id === id),
        }),
        {
            name: "likedConcerts",
        }
    )
);
