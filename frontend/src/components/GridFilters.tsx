import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { Action } from "../hooks/useFiltering";
import type { Filter } from "../models/Filter.type";
import { faCalendar, faFilter } from "@fortawesome/free-solid-svg-icons";
import DateRangeCallendar from "./DateRangeCallendar";

type Props = {
    filter: Filter;
    dispatch: React.ActionDispatch<[action: Action]>;
};

const GridInput = ({
    title,
    placeHolder,
    actionType,
    dispatch,
    defaultValue,
}: {
    title: string;
    placeHolder: string;
    actionType: string;
    dispatch: Function;
    defaultValue?: string;
}) => (
    <div className="filter-container">
        <span className="filter-input-title">{title}</span>
        <div className="filter-input-container grid-filter-item">
            <FontAwesomeIcon icon={faFilter} className="filter-icon" />
            <input
                type="text"
                className="filter-input"
                placeholder={placeHolder}
                defaultValue={defaultValue}
                onBlur={(e) => dispatch({ type: actionType, payload: e.target.value })}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        dispatch({
                            type: actionType,
                            payload: (e.target as HTMLInputElement).value,
                        });
                    }
                }}
            />
        </div>
    </div>
);

const GridFilters = ({ filter, dispatch }: Props) => {
    return (
        <div className="grid-filters-container">
            <div className="filter-container date-range-callendar-container">
                <span className="filter-input-title">Data</span>
                <div className="grid-filter-item">
                    <DateRangeCallendar filter={filter} dispatch={dispatch} />
                </div>
            </div>
            <GridInput
                title="Tytuł"
                placeHolder="Tytuł"
                actionType="SET_TITLE"
                dispatch={dispatch}
                defaultValue={filter.title}
            />
            <GridInput
                title="Program"
                placeHolder="Program"
                actionType="SET_PROGRAMMES"
                dispatch={dispatch}
                defaultValue={filter.programme}
            />
            <GridInput
                title="Typ koncertu"
                placeHolder="Typ koncertu"
                actionType="SET_CONCERT_TYPE"
                dispatch={dispatch}
                defaultValue={filter.concertType}
            />
            <GridInput
                title="Źródło"
                placeHolder="Źródło"
                actionType="SET_SOURCE"
                dispatch={dispatch}
                defaultValue={filter.source}
            />
        </div>
    );
};

export default GridFilters;
