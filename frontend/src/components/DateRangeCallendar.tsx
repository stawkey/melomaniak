import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface DateRangeProps {
    startDate: Date;
    setStartDate: (date: Date | null) => void;
    endDate: Date | null;
    setEndDate: (date: Date | null) => void;
}

const DateRange: React.FC<DateRangeProps> = ({ startDate, setStartDate, endDate, setEndDate }) => {
    return (
        <div className="date-range-container">
            <div className="filter-input-container">
                <FontAwesomeIcon icon={faCalendar} className="filter-icon" />
                <DatePicker
                    selected={startDate}
                    onChange={(date: Date | null) => setStartDate(date)}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    dateFormat="dd.MM.yyy"
                    className="date-picker-input"
                />
            </div>
            <div className="filter-input-container">
                <FontAwesomeIcon icon={faCalendar} className="filter-icon" />
                <DatePicker
                    selected={endDate}
                    onChange={(date: Date | null) => setEndDate(date)}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate}
                    dateFormat="dd.MM.yyy"
                    className="date-picker-input"
                />
            </div>
        </div>
    );
};

export default DateRange;
