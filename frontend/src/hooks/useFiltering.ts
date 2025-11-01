import { useMemo, useState } from "react";
import type { Filter } from "../models/Filter.type";

export default function useFiltering() {
    const [startDate, setStartDate] = useState<Date | null>();
    const [endDate, setEndDate] = useState<Date | null>();
    const [title, setTitle] = useState<string>();
    const [concertType, setConcertType] = useState<string>();
    const [source, setSource] = useState<string>();
    const [venue, setVenue] = useState<string>();
    const [programme, setProgramme] = useState<string>();
    const [composer, setComposer] = useState<string>();

    const formatDate = (d?: Date | null): string | undefined =>
        d ? d.toISOString().slice(0, 10) : undefined;

    const filter: Filter = useMemo(
        () => ({
            startDate: formatDate(startDate),
            endDate: formatDate(endDate),
            title: title || undefined,
            concertType: concertType || undefined,
            source: source || undefined,
            venue: venue || undefined,
            programme: programme || undefined,
            composer: composer || undefined,
        }),
        [startDate, endDate, title, concertType, source, venue, programme, composer]
    );

    const filterSetters: Record<string, (v: string) => void> = {
        Tytuł: setTitle,
        "Typ Koncertu": setConcertType,
        Źródło: setSource,
        Lokalizacja: setVenue,
        Program: setProgramme,
        Kompozytorzy: setComposer,
    };

    return { startDate, setStartDate, endDate, setEndDate, filter, filterSetters };
}
