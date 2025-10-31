export class Filter {
    startDate?: string;
    endDate?: string;
    title?: string;
    concertType?: string;
    source?: string;
    venue?: string;
    programme?: string;
    composer?: string;

    constructor(
        startDate?: string,
        endDate?: string,
        title?: string,
        concertType?: string,
        source?: string,
        venue?: string,
        programme?: string,
        composer?: string
    ) {
        this.startDate = startDate;
        this.endDate = endDate;
        this.title = title;
        this.concertType = concertType;
        this.source = source;
        this.venue = venue;
        this.programme = programme;
        this.composer = composer;
    }
}
