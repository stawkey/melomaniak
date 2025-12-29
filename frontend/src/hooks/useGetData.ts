import { useEffect } from "react";
import axios from "axios";
import type { Filter } from "../models/Filter.type";
import { useConcertList } from "../store";

export default function useGetData(filter: Filter, pageNumber: number = 1) {
    useEffect(() => {
        const fetchData = async () => {
            try {
                const url: string = "/concerts";

                const result = await axios.get(url, {
                    params: {
                        PageNumber: pageNumber,
                        "Filters.StartDate": filter.startDate?.toISOString().split("T")[0],
                        "Filters.EndDate": filter.endDate?.toISOString().split("T")[0],
                        "Filters.Title": filter.title,
                        "Filters.ConcertType": filter.concertType,
                        "Filters.Source": filter.source,
                        "Filters.Venue": filter.venue,
                        "Filters.Programme": filter.programme,
                        "Filters.Composers": filter.composer,
                    },
                });
                useConcertList.getState().setConcerts(result.data.concerts || []);
                useConcertList.getState().setTotalPages(result.data.totalPages || 1);
            } catch (err) {
                console.error("Error: ", err);
            }
        };

        fetchData();
    }, [filter, pageNumber]);
}
