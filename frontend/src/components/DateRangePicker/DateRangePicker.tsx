import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import type { Filter } from "../../models/Filter.type";
import styles from "./DateRangePicker.module.css";

const DateRangeCallendar = ({ filter, dispatch }: { filter: Filter; dispatch: Function }) => {
    const nextYearDate = new Date();
    nextYearDate.setFullYear(nextYearDate.getFullYear() + 1);

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
