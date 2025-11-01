import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import type { Concert } from "../models/Concert.type";
import type { Header } from "@tanstack/react-table";

const FilterInput = ({
    dispatch,
    header,
}: {
    dispatch: Function;
    header: Header<Concert, unknown>;
}) => {
    return (
        <div className="filter-input-container">
            <FontAwesomeIcon icon={faFilter} className="filter-icon" />
            <input
                type="text"
                className="filter-input"
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

export default FilterInput;
