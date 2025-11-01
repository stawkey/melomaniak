import { useState, useEffect } from "react";
import axios from "axios";
import type { Concert } from "../models/Concert.type";
import type { Filter } from "../models/Filter.type";

type PaginatedResponse = {
    pageNumber: number;
    totalPages: number;
    data: Concert[];
};

export default function useGetData(filter: Filter, pageNumber: number = 1) {
    const [data, setData] = useState<PaginatedResponse>({
        pageNumber: 1,
        totalPages: 1,
        data: [],
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const url: string = "https://localhost:7092/api/concerts";

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
                setData({
                    pageNumber: result.data.pageNumber || 1,
                    totalPages: result.data.totalPages || 1,
                    data: result.data.concerts || [],
                });
            } catch (err) {
                console.error("Error: ", err);
            }
        };

        fetchData();
    }, [filter, pageNumber]);

    return data;
}
