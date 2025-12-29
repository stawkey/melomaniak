import React from "react";
import type { Concert } from "../../../../models/Concert.type";
import type { Header } from "@tanstack/react-table";
import styles from "./TableFilterInput.module.css";

const TableFilterInput = ({
    dispatch,
    header,
}: {
    dispatch: Function;
    header: Header<Concert, unknown>;
}) => {
    return (
        <div className={styles.filterInputContainer}>
            {/* <FontAwesomeIcon icon={faFilter} className={styles.filterIcon} /> */}
            <input
                type="text"
                placeholder={`${header.column.columnDef.header}`}
                className={styles.filterInput}
                id={`${header.column.columnDef.header}`}
                name={`${header.column.columnDef.header}`}
                onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                    const headerId = header.column.id
                        .split(/\.?(?=[A-Z])/)
                        .join("_")
                        .toUpperCase();

                    dispatch({
                        type: "SET_" + headerId,
                        payload: e.target.value,
                    });
                }}
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                    if (e.key === "Enter") {
                        const headerId = header.column.id
                            .split(/\.?(?=[A-Z])/)
                            .join("_")
                            .toUpperCase();

                        dispatch({
                            type: "SET_" + headerId,
                            payload: (e.target as HTMLInputElement).value,
                        });
                    }
                }}
            />
        </div>
    );
};

export default TableFilterInput;
