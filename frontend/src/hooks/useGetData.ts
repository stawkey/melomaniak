import { useState, useEffect } from "react";
import type { Concert } from "./Concert";
import axios from "axios";
import type { Filter } from "./Filter";

export default function useGetData(filter: Filter) {
    const [data, setData] = useState<Concert[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const url: string = "https://localhost:7092/api/concerts";

                const formatDate = (date: Date | null): string | undefined => {
                    if (!date) return undefined;
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1);
                    const day = String(date.getDate());
                    console.log(date, day, month, year);
                    return `${year}-${month}-${day}`;
                };

                const response = await axios.get(url, {
                    params: {
                        "Filters.StartDate": formatDate(filter.startDate),
                        "Filters.EndDate": formatDate(filter.endDate),
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
