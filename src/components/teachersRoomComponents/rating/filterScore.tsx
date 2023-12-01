import React, { FC, useEffect, useState } from "react";
import styles from "./Rating.module.scss";
import { Select, Slider, Space } from "antd";
import { useSelector } from "react-redux";
import { SelectTopicData } from "redux/topic/selectors";
import { TopicType } from "redux/topic/types";
import { useAppDispatch } from "redux/store";
import { setFilter } from "redux/results/resultSlice";
import { SelectResultData } from "redux/results/selectors";

const { Option } = Select;

const FilterScore: FC = () => {
  const filteredTopicId = useSelector(SelectResultData).filter.topic_id;
  const filter = useSelector(SelectResultData).filter;
  const dispatch = useAppDispatch();

  const [inputValue, setInputValue] = useState<number[]>([0, 100]);

  const onChange = (value: number | number[]) => {
    if (value) {
      setInputValue(value as number[]);
    }

    const filtered = 1;

    dispatch(
      setFilter({
        date: filter.date,
        sumErrors: filter.sumErrors,
        score: value as number[],
        topic_id: filter.topic_id,
        user_id: filter.user_id,
      })
    );
  };

  return (
    <div className={styles.searchByRatings}>
      {"баллы"}
      <Slider
        range={{
          draggableTrack: true,
        }}
        defaultValue={[0, 101]}
        onChange={onChange}
      />
      <div className={styles.sliderValue}>
        <p>От: {inputValue[0]}</p>
        <p>До: {inputValue[1]}</p>
      </div>
    </div>
  );
};

export default FilterScore;
