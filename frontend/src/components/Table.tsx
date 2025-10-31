import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table";
import type { Concert } from "../utils/Concert";
import useGetData from "../hooks/useGetData";
import DateRange from "./DateRangeCallendar";
import { useEffect, useState } from "react";
import { Filter } from "../utils/Filter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";

const columns: ColumnDef<Concert>[] = [
    {
        accessorKey: "date",
        header: "Data",
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
        cell: (props) => <span>{String(props.getValue())}</span>,
    },
    {
        accessorKey: "programmes",
        header: "Program",
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
        cell: (props) => <span>{String(props.getValue())}</span>,
    },
    {
        accessorKey: "source",
        header: "Źródło",
        cell: (props) => <span>{String(props.getValue())}</span>,
    },
    {
        accessorKey: "venue",
        header: "Lokalizacja",
        cell: (props) => <span>{String(props.getValue())}</span>,
    },
    {
        accessorKey: "detailsLink",
        header: "Link",
        cell: (props) => <a href={`${String(props.getValue())}`}>Link</a>,
    },
];

function Table() {
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [title, setTitle] = useState<string>();
    const [concertType, setConcertType] = useState<string>();
    const [source, setSource] = useState<string>();
    const [venue, setVenue] = useState<string>();
    const [programme, setProgramme] = useState<string>();
    const [composer, setComposer] = useState<string>();

    const [filter, setFilter] = useState(new Filter());

    useEffect(() => {
        setFilter(
            new Filter(startDate, endDate, title, concertType, source, venue, programme, composer)
        );
    }, [startDate, endDate, title, concertType, source, venue, programme, composer]);

    const filterSetters: { [key: string]: (value: string) => void } = {
        Tytuł: (value) => setTitle(value),
        "Typ Koncertu": (value) => setConcertType(value),
        Źródło: (value) => setSource(value),
        Lokalizacja: (value) => setVenue(value),
        Program: (value) => setProgramme(value),
        Kompozytorzy: (value) => setComposer(value),
    };

    const data = useGetData(filter);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        columnResizeMode: "onChange",
        initialState: {
            columnVisibility: {
                detailsLink: false,
            },
        },
    });

    return (
        <table style={{ width: table.getTotalSize() }}>
            <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                            <th key={header.id} style={{ width: header.getSize() }}>
                                <div className="header-content">
                                    <div className="header-title">
                                        {flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                    </div>
                                    <div
                                        onMouseDown={header.getResizeHandler()}
                                        onTouchStart={header.getResizeHandler()}
                                        className={`resizer ${
                                            header.column.getIsResizing() ? "is-resizing" : ""
                                        }`}
                                    ></div>
                                    {header.column.columnDef.header === "Data" ? (
                                        <DateRange
                                            startDate={startDate}
                                            setStartDate={setStartDate}
                                            endDate={endDate}
                                            setEndDate={setEndDate}
                                        />
                                    ) : (
                                        <div className="filter-input-container">
                                            <FontAwesomeIcon
                                                icon={faFilter}
                                                className="filter-icon"
                                            />
                                            <input
                                                type="text"
                                                className="filter-input"
                                                id={`${header.column.columnDef.header}`}
                                                name={`${header.column.columnDef.header}`}
                                                onBlur={(e) => {
                                                    const headerName = String(
                                                        header.column.columnDef.header
                                                    );
                                                    const setter = filterSetters[headerName];
                                                    if (setter) {
                                                        setter(e.target.value);
                                                    }
                                                }}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") {
                                                        const headerName = String(
                                                            header.column.columnDef.header
                                                        );
                                                        const setter = filterSetters[headerName];
                                                        if (setter) {
                                                            setter(e.target.value);
                                                        }
                                                    }
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>
                            </th>
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody>
                {table.getRowModel().rows.map((row) => {
                    const detailsLink = row.original.detailsLink;
                    return (
                        <tr
                            key={row.id}
                            style={{ cursor: detailsLink ? "pointer" : "default" }}
                            onClick={() => {
                                if (detailsLink) {
                                    window.open(detailsLink, "_blank", "noopener,noreferrer");
                                }
                            }}
                        >
                            {row.getVisibleCells().map((cell) => (
                                <td key={cell.id} style={{ width: cell.column.getSize() }}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}

export default Table;
