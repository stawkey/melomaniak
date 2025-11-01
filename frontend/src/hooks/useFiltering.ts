import { useReducer } from "react";
import type { Filter } from "../models/Filter.type";

type Action =
    | { type: "SET_START_DATE"; payload: Date }
    | { type: "SET_END_DATE"; payload: Date }
    | { type: "SET_TITLE"; payload: string }
    | { type: "SET_CONCERT_TYPE"; payload: string }
    | { type: "SET_SOURCE"; payload: string }
    | { type: "SET_VENUE"; payload: string }
    | { type: "SET_PROGRAMMES"; payload: string }
    | { type: "SET_COMPOSERS"; payload: string };

const filterReducer = (filter: Filter, action: Action) => {
    switch (action.type) {
        case "SET_START_DATE": {
            return { ...filter, startDate: action.payload };
        }
        case "SET_END_DATE": {
            return { ...filter, endDate: action.payload };
        }
        case "SET_TITLE": {
            return { ...filter, title: action.payload };
        }
        case "SET_CONCERT_TYPE": {
            return { ...filter, concertType: action.payload };
        }
        case "SET_SOURCE": {
            return { ...filter, source: action.payload };
        }
        case "SET_VENUE": {
            return { ...filter, venue: action.payload };
        }
        case "SET_PROGRAMMES": {
            return { ...filter, programme: action.payload };
        }
        case "SET_COMPOSERS": {
            return { ...filter, composer: action.payload };
        }
    }
};

export default function useFiltering() {
    const initialfilter: Filter = {
        startDate: new Date(),
        endDate: (() => {
            const d = new Date();
            d.setFullYear(d.getFullYear() + 1);
            return d;
        })(),
        title: undefined,
        concertType: undefined,
        source: undefined,
        venue: undefined,
        programme: undefined,
        composer: undefined,
    };

    const [filter, dispatch] = useReducer(filterReducer, initialfilter);

    return { filter, dispatch };
}
