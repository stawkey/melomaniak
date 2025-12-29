import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import type { Filter } from "../../../models/Filter.type";
import styles from "./DateRangePicker.module.css";
import { useEffect, useState } from "react";

const formatForInput = (d?: Date) => {
    if (!d) return "";
    return d.toISOString().slice(0, 10);
};

const DateRangeCallendar = ({ filter, dispatch }: { filter: Filter; dispatch: Function }) => {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 780);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 780);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const nextYearDate = new Date();
    nextYearDate.setFullYear(nextYearDate.getFullYear() + 1);

    if (isMobile) {
        return (
            <div className={styles.dateRangeContainer}>
                <div className={`${styles.filterInputContainer} ${styles.filterItem}`}>
                    <input
                        type="date"
                        className={styles.datePickerInput}
                        value={formatForInput(filter.startDate)}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            const v = e.target.value;
                            dispatch({
                                type: "SET_START_DATE",
                                payload: v ? new Date(v) : undefined,
                            });
                        }}
                    />
                </div>
                <div className={`${styles.filterInputContainer} ${styles.filterItem}`}>
                    <input
                        type="date"
                        className={styles.datePickerInput}
                        value={formatForInput(filter.endDate)}
                        min={formatForInput(filter.startDate)}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            const v = e.target.value;
                            dispatch({
                                type: "SET_END_DATE",
                                payload: v ? new Date(v) : undefined,
                            });
                        }}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className={styles.dateRangeContainer}>
            <div className={`${styles.filterInputContainer} ${styles.filterItem}`}>
                {/* <FontAwesomeIcon icon={faCalendar} className="filter-icon" /> */}
                <DatePicker
                    selected={filter.startDate}
                    onChange={(date) => {
                        dispatch({
                            type: "SET_START_DATE",
                            payload: date,
                        });
                    }}
                    selectsStart
                    startDate={filter.startDate}
                    endDate={filter.endDate}
                    dateFormat="dd.MM.yyyy"
                    className={styles.datePickerInput}
                />
            </div>
            <div className={`${styles.filterInputContainer} ${styles.filterItem}`}>
                {/* <FontAwesomeIcon icon={faCalendar} className="filter-icon" /> */}
                <DatePicker
                    selected={filter.endDate}
                    onChange={(date) => {
                        dispatch({
                            type: "SET_END_DATE",
                            payload: date,
                        });
                    }}
                    selectsEnd
                    startDate={filter.startDate}
                    endDate={filter.endDate}
                    minDate={filter.startDate}
                    dateFormat="dd.MM.yyyy"
                    className={styles.datePickerInput}
                />
            </div>
        </div>
    );
};

export default DateRangeCallendar;
