import { useState, useEffect } from "react";
import axios from "axios";
import type { Filter } from "../models/Filter.type";
import type { Concert } from "../models/Concert.type";

export default function useGetData(filter: Filter) {
    const [data, setData] = useState<Concert[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const url: string = "https://localhost:7092/api/concerts";

                const response = await axios.get(url, {
                    params: {
                        "Filters.StartDate": filter.startDate,
                        "Filters.EndDate": filter.endDate,
                        "Filters.Title": filter.title,
                        "Filters.ConcertType": filter.concertType,
                        "Filters.Source": filter.source,
                        "Filters.Venue": filter.venue,
                        "Filters.Programme": filter.programme,
                        "Filters.Composers": filter.composer,
                    },
                });
                setData(response.data);
            } catch (err) {
                console.error("Error: ", err);
            }
        };

        fetchData();
    }, [filter]);

    return data;
}
