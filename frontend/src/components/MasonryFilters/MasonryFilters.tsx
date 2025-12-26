import { useEffect, useState } from "react";
import type { Action } from "../../hooks/useFiltering";
import type { Filter } from "../../models/Filter.type";
import DateRangeCallendar from "../DateRangePicker/DateRangePicker";
import styles from "./MasonryFilters.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faFilter } from "@fortawesome/free-solid-svg-icons";
import Modal from "../MasonryFiltersModal/MasonryFiltersModal";

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
            {/* <FontAwesomeIcon icon={faFilter} className={styles.filterIcon} /> */}
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
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 780);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 780);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleExpand = () => {
        setModalOpen(!modalOpen);
    };

    const filters = (
        <>
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
        </>
    );

    return (
        <div className={styles.masonryFiltersContainer}>
            {isMobile ? (
                <>
                    <button className={styles.expandButton} onClick={handleExpand} title="Filtry">
                        <FontAwesomeIcon icon={faFilter} />
                        <span className={styles.expandLabel}>Filtry</span>
                    </button>
                    {modalOpen && (
                        <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
                            {filters}
                        </Modal>
                    )}
                </>
            ) : (
                filters
            )}
        </div>
    );
};

export default MasonryFilters;
