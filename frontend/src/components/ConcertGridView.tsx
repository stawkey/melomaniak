import type { Row } from "@tanstack/react-table";
import type { Concert } from "../models/Concert.type";
import type { Filter } from "../models/Filter.type";
import type { Action } from "../hooks/useFiltering";
import GridFilters from "./GridFilters";

type Props = {
    rows: Row<Concert>[];
    filter: Filter;
    dispatch: React.ActionDispatch<[action: Action]>;
};

function convertDate(dateString: string) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const time = `${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")}`;
    return `${day}.${month}.${year} ${time}`;
}

function ConcertGridView({ rows, filter, dispatch }: Props) {
    const leftColumn: Row<Concert>[] = [];
    const rightColumn: Row<Concert>[] = [];

    let leftHeight = 0;

    let rightHeight = 0;
    rows.forEach((row) => {
        const concert = row.original;

        const header = 72;
        const programmeWeight = 32 + (concert.programmes?.length || 0) * 20;
        const estimatedCardHeight = header + programmeWeight;

        if (leftHeight <= rightHeight) {
            leftColumn.push(row);
            leftHeight += estimatedCardHeight;
        } else {
            rightColumn.push(row);
            rightHeight += estimatedCardHeight;
        }
    });

    const renderCard = (row: Row<Concert>) => {
        const concert = row.original;
        return (
            <div
                key={row.id}
                className="concert-card"
                style={{ cursor: concert.detailsLink ? "pointer" : "default" }}
                onClick={() => {
                    if (concert.detailsLink) {
                        window.open(concert.detailsLink, "_blank", "noopener,noreferrer");
                    }
                }}
            >
                <div className="card-header">
                    <div className="header-row">
                        <div className="card-title">{concert.title}</div>
                        <div className="card-date">{convertDate(String(concert.date))}</div>
                    </div>

                    <div className="header-row">
                        <div className="card-concert-type">{concert.concertType}</div>
                        <div className="card-source">{concert.source}</div>
                    </div>
                </div>
                <div className="card-body">
                    <ul>
                        {concert.programmes?.map((piece, idx) => {
                            const pieceVal = piece as any;

                            const pieceTitle =
                                typeof pieceVal === "string"
                                    ? pieceVal
                                    : pieceVal.piece ?? JSON.stringify(pieceVal);

                            return <li key={idx}>{pieceTitle}</li>;
                        })}
                    </ul>
                </div>
            </div>
        );
    };

    return (
        <>
            <GridFilters filter={filter} dispatch={dispatch} />
            <div className="concert-grid">
                <div className="concert-column">{leftColumn.map(renderCard)}</div>
                <div className="concert-column">{rightColumn.map(renderCard)}</div>
            </div>
        </>
    );
}

export default ConcertGridView;
