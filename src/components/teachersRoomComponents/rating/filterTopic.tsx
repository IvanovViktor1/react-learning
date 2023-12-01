import React, { FC } from "react";
import { Select, Space } from "antd";
import { useSelector } from "react-redux";
import { SelectTopicData } from "redux/topic/selectors";
import { TopicType } from "redux/topic/types";
import { useAppDispatch } from "redux/store";
import { setFilter } from "redux/results/resultSlice";
import { SelectResultData } from "redux/results/selectors";
import styles from "./Rating.module.scss";

const { Option } = Select;

const FilterTopic: FC = () => {
  const filteredTopicId = useSelector(SelectResultData).filter.topic_id;
  const filter = useSelector(SelectResultData).filter;
  const dispatch = useAppDispatch();
  const handleChange = (value: number[]) => {
    dispatch(
      setFilter({
        date: filter.date,
        sumErrors: filter.sumErrors,
        score: filter.score,
        topic_id: value,
        user_id: filter.user_id,
      })
    );
  };

  const topics = useSelector(SelectTopicData).items as TopicType[];
  return (
    <div className={styles.filterTopic}>
      <Select
        mode="multiple"
        style={{ width: "100%" }}
        placeholder="выберите тему"
        onChange={handleChange}
        optionLabelProp="label"
      >
        {topics ? (
          topics.map((top) => (
            <Option key={top.id} value={top.id} label={top.title}>
              <Space>{top.title}</Space>
            </Option>
          ))
        ) : (
          <Option value="Все" label="China9">
            <Space>
              <span role="img" aria-label="China8ы">
                *
              </span>
              Все темы
            </Space>
          </Option>
        )}
      </Select>
    </div>
  );
};

export default FilterTopic;
