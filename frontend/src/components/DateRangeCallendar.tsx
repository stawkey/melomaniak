import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface DateRangeProps {
    startDate: Date | null | undefined;
    setStartDate: (date: Date | null | undefined) => void;
    endDate: Date | null | undefined;
    setEndDate: (date: Date | null | undefined) => void;
}

const DateRange: React.FC<DateRangeProps> = ({ startDate, setStartDate, endDate, setEndDate }) => {
    const formatDate = (date: Date): string => {
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    };

    const nextYearDate = new Date();
    nextYearDate.setFullYear(nextYearDate.getFullYear() + 1);

    return (
        <div className="date-range-container">
            <div className="filter-input-container">
                <FontAwesomeIcon icon={faCalendar} className="filter-icon" />
                <DatePicker
                    placeholderText={formatDate(new Date())}
                    selected={startDate}
                    onChange={(date: Date | null) => setStartDate(date)}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    dateFormat="dd.MM.yyyy"
                    className="date-picker-input"
                />
            </div>
            <div className="filter-input-container">
                <FontAwesomeIcon icon={faCalendar} className="filter-icon" />
                <DatePicker
                    placeholderText={formatDate(nextYearDate)}
                    selected={endDate}
                    onChange={(date: Date | null) => setEndDate(date)}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate}
                    dateFormat="dd.MM.yyyy"
                    className="date-picker-input"
                />
            </div>
        </div>
    );
};

export default DateRange;
