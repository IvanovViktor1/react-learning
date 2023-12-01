import React, {
  CSSProperties,
  FC,
  useContext,
  useEffect,
  useState,
} from "react";
import styles from "./Rating.module.scss";
import { useSelector } from "react-redux";
import { fetchRating } from "redux/results/asyncActions";
import {
  SelectAllResultData,
  SelectFilterResultData,
} from "redux/results/selectors";
import { useAppDispatch } from "redux/store";
import { FetchResult } from "redux/results/types";
import FilterTopic from "./filterTopic";
import { setFilter } from "redux/results/resultSlice";
import FilterScore from "./filterScore";
import FilterStudent from "./filterStudent";
import { SelectUserData } from "redux/user/selectors";
import { SelectTopicData } from "redux/topic/selectors";
import { Button, Drawer, theme } from "antd";
import FilterDate from "./filterDate";
import { fetchUsers } from "redux/user/asyncActions";
import { fetchGroups } from "redux/groups/asyncActions";
import { fetchModes } from "redux/modes/asyncActions";
import { SelectModesData } from "redux/modes/selectors";

const Rating: FC = () => {
  const dispatch = useAppDispatch();
  const user = useSelector(SelectUserData);
  const all_results = useSelector(SelectAllResultData);
  const filter = useSelector(SelectFilterResultData);
  const [filteredAllResults, setFilteredAllResults] = useState<FetchResult>([]);
  const arrayScores: number[] = [...Array(101).keys()];
  const topics = useSelector(SelectTopicData).items;
  const users = useSelector(SelectUserData).users;

  const modes = useSelector(SelectModesData).modes;

  useEffect(() => {
    dispatch(fetchRating());
    dispatch(fetchUsers());
    dispatch(fetchGroups());
    dispatch(fetchModes());
  }, []);

  const convertDate = (dateString: string) => {
    const [datePart, timePart] = dateString.split(", ");
    const [day, month, year] = datePart.split(".");
    const [hours, minutes] = timePart.split(":");
    const date = new Date(
      Number(year),
      Number(month) - 1,
      Number(day),
      Number(hours),
      Number(minutes)
    );
    return date;
  };

  useEffect(() => {
    const selectedValuess = filter?.topic_id as number[];
    const selectedUsers =
      user.databaseInfo?.role_id === 2
        ? filter?.user_id
        : user.sessionInfo?.user_id;

    const newRes = all_results?.filter(
      (res) =>
        selectedValuess.includes(res.topic_id) &&
        valuesInRange.includes(res.score) &&
        selectedUsers?.includes(res.user_id) &&
        convertDate(parsedDate(res.date)) >= convertDate(filter.date[0]) &&
        convertDate(parsedDate(res.date)) <= convertDate(filter.date[1])
    );

    setFilteredAllResults(newRes as FetchResult);
  }, [filter]);

  const parsedDate = (dateStr: string) => {
    const date: Date = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    const formattedDate: string = new Intl.DateTimeFormat(
      "ru-RU",
      options
    ).format(date);

    return formattedDate;
  };

  function findValuesInRange(
    arr: number[],
    start: number,
    end: number
  ): number[] {
    const result: number[] = [];
    for (let num of arr) {
      if (start <= num && num <= end) {
        result.push(num);
      }
    }
    return result;
  }

  const start: number = filter.score ? filter.score[0] : 0;
  const end: number = filter.score ? filter.score[1] : 100;
  const valuesInRange: number[] = findValuesInRange(arrayScores, start, end);

  return (
    <div className={styles.contentRaiting}>
      <hr className={styles.hrHead} />
      <div className={styles.selectBar}>
        {user.databaseInfo?.role_id === 2 ? <FilterStudent /> : ""}
        <FilterTopic />
        <FilterScore />
        <FilterDate />
      </div>
      <hr className={styles.hr} />

      <div className={styles.table}>
        <table className={styles.tableRaiting}>
          <thead>
            <tr>
              <th>Имя </th>
              <th>Оценка за </th>
              <th>Тема </th>
              <th>Баллы</th>
              <th>Ошибки </th>
              <th>Дата </th>
            </tr>
          </thead>
          <tbody>
            {filteredAllResults
              ? filteredAllResults.map((res) => (
                  <tr>
                    <td className={styles.studentName}>
                      {
                        users?.find((user) => user.user_id === res.user_id)
                          ?.name
                      }
                    </td>
                    <td>
                      {modes?.find((mode) => mode.id === res.score_for)?.name}
                    </td>
                    <td key={res.id}>
                      <li>
                        {
                          topics?.find((topic) => topic.id === res.topic_id)
                            ?.title
                        }
                      </li>
                    </td>
                    <td>{res.score}</td>
                    <td>
                      {res.errors?.length ? (
                        <>
                          {res.errors?.map((err) => (
                            <li>{err}</li>
                          ))}
                        </>
                      ) : (
                        "без ошибок"
                      )}
                    </td>
                    <td className={styles.date}>{parsedDate(res.date)}</td>
                  </tr>
                ))
              : ""}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Rating;
