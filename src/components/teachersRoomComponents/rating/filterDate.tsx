import React, { useEffect } from "react";
import dayjs, { Dayjs } from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { ruRU } from "@mui/x-date-pickers/locales";
import "dayjs/locale/ru";
import { useAppDispatch } from "redux/store";
import { setFilter } from "redux/results/resultSlice";
import { useSelector } from "react-redux";
import { SelectResultData } from "redux/results/selectors";
import styles from "./Rating.module.scss";

const FilterDate: React.FC = () => {
  function formatDate(dateTime: string): string {
    const date = new Date(dateTime);
    const formattedDate = date.toLocaleDateString("en-GB").replace(/\//g, ".");
    const formattedTime = date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${formattedDate}, ${formattedTime}`;
  }
  const filter = useSelector(SelectResultData).filter;
  const dispatch = useAppDispatch();

  const [startDateValue, setStartDateValue] = React.useState<Dayjs | null>(
    dayjs("2023-01-01T00:30")
  );

  const [endDateValue, setEndDateValue] = React.useState<Dayjs | null>(
    dayjs("2023-12-31T12:00")
  );

  useEffect(() => {
    const newStartValue = formatDate(String(startDateValue));
    const newEndValue = formatDate(String(endDateValue));
    if (startDateValue && endDateValue) {
      dispatch(
        setFilter({
          date: [newStartValue, newEndValue],
          sumErrors: filter.sumErrors,
          score: filter.score,
          topic_id: filter.topic_id,
          user_id: filter.user_id,
        })
      );
    }
  }, [startDateValue, endDateValue]);

  return (
    <>
      фильтрация по дате
      <LocalizationProvider
        dateAdapter={AdapterDayjs}
        adapterLocale="ru"
        localeText={
          ruRU.components.MuiLocalizationProvider.defaultProps.localeText
        }
      >
        <DemoContainer components={["DateTimePicker", "DateTimePicker"]}>
          <div className={styles.calendar}>
            <DateTimePicker
              label="От"
              value={startDateValue}
              onChange={(newValue) => setStartDateValue(newValue)}
            />
            <DateTimePicker
              label="До"
              value={endDateValue}
              onChange={(newValue) => setEndDateValue(newValue)}
            />
          </div>
        </DemoContainer>
      </LocalizationProvider>
    </>
  );
};

export default FilterDate;
