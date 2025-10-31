export type Concert = {
    date: Date;
    title: string;
    concertType: string;
    source: string;
    venue: string;
    programme: Array<Programme>;
    composers: Array<Composer>;
    detailsLink: string;
};

export type Composer = {
    composer1: string;
    [key: string]: any;
};

export type Programme = {
    piece: string;
    [key: string]: any;
};
