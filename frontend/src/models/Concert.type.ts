export type Concert = {
    date: Date;
    title: string;
    concertType: string;
    source: string;
    venue: string;
    programmes: Array<Programme | string>;
    composers: Array<Composer | string>;
    detailsLink: string;
};

export type Composer = {
    composer1: string;
    [key: string]: unknown;
};

export type Programme = {
    piece: string;
    [key: string]: unknown;
};
