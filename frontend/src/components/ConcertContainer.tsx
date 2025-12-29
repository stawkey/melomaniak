import {
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
    type VisibilityState,
} from "@tanstack/react-table";
import useGetData from "../hooks/useGetData";
import columns from "./Columns";
import useFiltering from "../hooks/useFiltering";
import { useState } from "react";
import Header from "./layout/Header/Header";
import MasonryView from "./pages/Masonry/MasonryView/MasonryView";
import TableView from "./pages/Table/TableView/TableView";
import PaginationControls from "./layout/PaginationControls/PaginationControls";

function ConcertContainer() {
    const [viewMode, setViewMode] = useState<"table" | "grid">("grid");

    const { filter, dispatch } = useFiltering();
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 30 });
    const { totalPages, data } = useGetData(filter, pagination.pageIndex + 1);

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
                viewMode={viewMode}
                setViewMode={setViewMode}
            />
            {viewMode === "grid" ? (
                <MasonryView
                    concerts={table.getRowModel().rows.map((row) => row.original)}
                    filter={filter}
                    dispatch={dispatch}
                />
            ) : (
                <TableView table={table} filter={filter} dispatch={dispatch} />
            )}
            <PaginationControls table={table} />
        </>
    );
}

export default ConcertContainer;
