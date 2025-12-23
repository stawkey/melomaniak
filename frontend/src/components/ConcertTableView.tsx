import { flexRender, type Table } from "@tanstack/react-table";
import type { Concert } from "../models/Concert.type";
import DateRangeCallendar from "./DateRangeCallendar";
import FilterInput from "./FilterInput";
import type { Filter } from "../models/Filter.type";
import type { Action } from "../hooks/useFiltering";

type Props = {
    table: Table<Concert>;
    filter: Filter;
    dispatch: React.ActionDispatch<[action: Action]>;
};

const ConcertTableView = ({ table, filter, dispatch }: Props) => {
    return (
        <div className="table-container">
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
                                        {header.column.id === "date" ? (
                                            <DateRangeCallendar
                                                filter={filter}
                                                dispatch={dispatch}
                                            />
                                        ) : (
                                            <FilterInput dispatch={dispatch} header={header} />
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
        </div>
    );
};

export default ConcertTableView;
