import { flexRender, type Table } from "@tanstack/react-table";
import type { Concert } from "../../models/Concert.type";
import DateRangeCallendar from "../DateRangePicker/DateRangePicker";
import TableFilterInput from "../TableFilterInput/TableFilterInput";
import type { Filter } from "../../models/Filter.type";
import type { Action } from "../../hooks/useFiltering";
import styles from "./TableView.module.css";

type Props = {
    table: Table<Concert>;
    filter: Filter;
    dispatch: React.ActionDispatch<[action: Action]>;
};

const TableView = ({ table, filter, dispatch }: Props) => {
    return (
        <div className={styles.tableContainer}>
            <table style={{ width: table.getTotalSize() }}>
                <thead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <th key={header.id} style={{ width: header.getSize() }}>
                                    <div className={styles.headerContent}>
                                        <div className={styles.headerTitle}>
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                        </div>
                                        <div
                                            onMouseDown={header.getResizeHandler()}
                                            onTouchStart={header.getResizeHandler()}
                                            className={`${styles.resizer} ${
                                                header.column.getIsResizing()
                                                    ? styles.isResizing
                                                    : ""
                                            }`}
                                        ></div>
                                        {header.column.id === "date" ? (
                                            <DateRangeCallendar
                                                filter={filter}
                                                dispatch={dispatch}
                                            />
                                        ) : (
                                            <TableFilterInput dispatch={dispatch} header={header} />
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

export default TableView;
