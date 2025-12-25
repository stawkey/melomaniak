import type { Table } from "@tanstack/react-table";
import type { Concert } from "../../models/Concert.type";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import styles from "./PaginationControls.module.css";

type Props = {
    table: Table<Concert>;
};

const PaginationControls = ({ table }: Props) => {
    return (
        <div className={styles.paginationContainer}>
            <button
                className={styles.paginationButton}
                onClick={() => table.firstPage()}
                disabled={!table.getCanPreviousPage()}
            >
                PIERWSZA
            </button>
            <button
                className={styles.paginationButton}
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
            >
                <FontAwesomeIcon icon={faChevronLeft} />
            </button>
            <button
                className={styles.paginationButton}
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
            >
                <FontAwesomeIcon icon={faChevronRight} />
            </button>
            <button
                className={styles.paginationButton}
                onClick={() => table.lastPage()}
                disabled={!table.getCanNextPage()}
            >
                OSTATNIA
            </button>
        </div>
    );
};

export default PaginationControls;
