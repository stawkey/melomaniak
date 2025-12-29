import type { ColumnDef } from "@tanstack/react-table";
import type { Concert } from "../../../models/Concert.type";

const columns: ColumnDef<Concert>[] = [
    {
        accessorKey: "date",
        header: "Data",
        size: 240,
        cell: (props) => {
            const value = props.getValue();
            const date = new Date(value);
            const day = String(date.getDate()).padStart(2, "0");
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const year = date.getFullYear();
            const time = `${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")}`;
            return <span>{`${day}.${month}.${year} ${time}`}</span>;
        },
    },
    {
        accessorKey: "title",
        header: "Tytuł",
        size: 200,
        cell: (props) => <span>{String(props.getValue())}</span>,
    },
    {
        accessorKey: "programmes",
        header: "Program",
        size: 360,
        cell: (props) => {
            const programmes = props.getValue() as Array<any>;
            return (
                <ul>
                    {programmes?.map((piece, idx) => (
                        <li key={idx}>
                            {typeof piece === "string"
                                ? piece
                                : piece.piece ?? JSON.stringify(piece)}
                        </li>
                    ))}
                </ul>
            );
        },
    },
    {
        accessorKey: "composers",
        header: "Kompozytorzy",
        size: 200,
        cell: (props) => {
            const composers = props.getValue() as Array<any>;
            return (
                <ul>
                    {composers?.map((composer, idx) => (
                        <li key={idx}>
                            {typeof composer === "string"
                                ? composer
                                : composer.composer1 ?? JSON.stringify(composer)}
                        </li>
                    ))}
                </ul>
            );
        },
    },
    {
        accessorKey: "concertType",
        header: "Typ Koncertu",
        size: 200,
        cell: (props) => <span>{String(props.getValue())}</span>,
    },
    {
        accessorKey: "source",
        header: "Źródło",
        size: 200,
        cell: (props) => <span>{String(props.getValue())}</span>,
    },
    {
        accessorKey: "venue",
        header: "Lokalizacja",
        size: 200,
        cell: (props) => <span>{String(props.getValue())}</span>,
    },
    {
        accessorKey: "detailsLink",
        header: "Link",
        size: 200,
        cell: (props) => <a href={`${String(props.getValue())}`}>Link</a>,
    },
];

export default columns;
