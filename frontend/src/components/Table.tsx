import {
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
    type VisibilityState,
} from "@tanstack/react-table";
import useGetData from "../hooks/useGetData";
import DateRangeCallendar from "./DateRangeCallendar";
import columns from "./Columns";
import useFiltering from "../hooks/useFiltering";
import { useState } from "react";
import FilterInput from "./FilterInput";
import Header from "./Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

function Table() {
    const { filter, dispatch } = useFiltering();
    const [columnOrder, setColumnOrder] = useState<string[]>(
        columns.map((col) => (col as any).accessorKey)
    );
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(() =>
        columns.reduce((acc, col) => {
            const key = (col as any).accessorKey as string;
            acc[key] = ["title", "composers", "venue", "detailsLink"].includes(key) ? false : true;
            return acc;
        }, {} as VisibilityState)
    );

    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 30,
    });

    const { totalPages, data } = useGetData(filter, pagination.pageIndex + 1);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onPaginationChange: setPagination,
        onColumnOrderChange: setColumnOrder,
        columnResizeMode: "onChange",
        manualPagination: true,
        pageCount: totalPages,
        initialState: {
            columnVisibility: columnVisibility,
        },
        state: {
            pagination,
            columnOrder,
            columnVisibility,
        },
    });

    return (
        <>
            <Header
                columnOrder={columnOrder}
                setColumnOrder={setColumnOrder}
                columnVisibility={columnVisibility}
                setColumnVisibility={setColumnVisibility}
            />
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
            <button
                className="pagination-btn"
                onClick={() => table.firstPage()}
                disabled={!table.getCanPreviousPage()}
            >
                PIERWSZA
            </button>
            <button
                className="pagination-btn"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
            >
                <FontAwesomeIcon icon={faChevronLeft} />
            </button>
            <button
                className="pagination-btn"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
            >
                <FontAwesomeIcon icon={faChevronRight} />
            </button>
            <button
                className="pagination-btn"
                onClick={() => table.lastPage()}
                disabled={!table.getCanNextPage()}
            >
                OSTATNIA
            </button>
        </>
    );
}

export default Table;
