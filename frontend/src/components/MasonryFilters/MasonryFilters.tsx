import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { Action } from "../../hooks/useFiltering";
import type { Filter } from "../../models/Filter.type";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import DateRangeCallendar from "../DateRangePicker/DateRangePicker";
import styles from "./MasonryFilters.module.css";

type Props = {
    filter: Filter;
    dispatch: React.ActionDispatch<[action: Action]>;
};

const FilterInput = ({
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
    <div className={styles.filterContainer}>
        <span className={styles.filterInputTitle}>{title}</span>
        <div className={`${styles.filterInputContainer} ${styles.filterItem}`}>
            <FontAwesomeIcon icon={faFilter} className={styles.filterIcon} />
            <input
                type="text"
                className={styles.filterInput}
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

const MasonryFilters = ({ filter, dispatch }: Props) => {
    return (
        <div className={styles.masonryFiltersContainer}>
            <div className={`${styles.filterContainer} ${styles.dateRangeContainer}`}>
                <span className={styles.filterInputTitle}>Data</span>
                <div className={styles.filterItem}>
                    <DateRangeCallendar filter={filter} dispatch={dispatch} />
                </div>
            </div>
            <FilterInput
                title="Tytuł"
                placeHolder="Tytuł"
                actionType="SET_TITLE"
                dispatch={dispatch}
                defaultValue={filter.title}
            />
            <FilterInput
                title="Program"
                placeHolder="Program"
                actionType="SET_PROGRAMMES"
                dispatch={dispatch}
                defaultValue={filter.programme}
            />
            <FilterInput
                title="Typ koncertu"
                placeHolder="Typ koncertu"
                actionType="SET_CONCERT_TYPE"
                dispatch={dispatch}
                defaultValue={filter.concertType}
            />
            <FilterInput
                title="Źródło"
                placeHolder="Źródło"
                actionType="SET_SOURCE"
                dispatch={dispatch}
                defaultValue={filter.source}
            />
        </div>
    );
};

export default MasonryFilters;
