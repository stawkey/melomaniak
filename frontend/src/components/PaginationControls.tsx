import type { Table } from "@tanstack/react-table";
import type { Concert } from "../models/Concert.type";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

type Props = {
    table: Table<Concert>;
};

const PaginationControls = ({ table }: Props) => {
    return (
        <>
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
};

export default PaginationControls;
