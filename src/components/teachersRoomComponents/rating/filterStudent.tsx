import React, { FC, useEffect, useState } from "react";
import { Select, Space, Switch } from "antd";
import { useSelector } from "react-redux";
import { SelectTopicData } from "redux/topic/selectors";
import { TopicType } from "redux/topic/types";
import { useAppDispatch } from "redux/store";
import { setFilter } from "redux/results/resultSlice";
import { SelectResultData } from "redux/results/selectors";
import { SelectUserData } from "redux/user/selectors";
import { SelectGroupsData } from "redux/groups/selectors";
import { UsersType } from "redux/user/types";
import styles from "./Rating.module.scss";

const { Option } = Select;

const FilterStudent: FC = () => {
  const user = useSelector(SelectUserData);
  const filter = useSelector(SelectResultData).filter;
  const dispatch = useAppDispatch();
  const users = useSelector(SelectUserData).users;

  const [searchByGroup, setSearchByGroup] = useState([""]);
  const [searchByName, setSearchByName] = useState([""]);

  const [value, setValue] = useState("");

  const handleGroupSelectionChanges = (value: number[]) => {
    const searchUsersByGroup = users
      ?.filter((user) => value.includes(user.group_id ? user.group_id : 111))
      .map((user) => user.user_id);
    if (searchUsersByGroup) {
      setSearchByGroup(searchUsersByGroup);
    }
  };

  const onChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.value;
    setValue(name);

    const searchUsersByName = users?.filter((user) =>
      user.name?.includes(name)
    );
    const searchUsersIdByName = searchUsersByName?.map((user) => user.user_id);
    if (searchUsersIdByName) {
      setSearchByName(searchUsersIdByName);
    }
  };

  const groups = useSelector(SelectGroupsData).groups;
  const groupsId = groups.map((group) => group.id);

  const usersId = useSelector(SelectUserData).users?.map(
    (user) => user.user_id
  ) as string[];

  useEffect(() => {
    dispatch(
      setFilter({
        date: filter.date,
        sumErrors: filter.sumErrors,
        score: filter.score,
        topic_id: filter.topic_id,
        user_id: usersId,
      })
    );
  }, []);

  useEffect(() => {
    if (value === "") {
      dispatch(
        setFilter({
          date: filter.date,
          sumErrors: filter.sumErrors,
          score: filter.score,
          topic_id: filter.topic_id,
          user_id: searchByGroup,
        })
      );
    } else {
      dispatch(
        setFilter({
          date: filter.date,
          sumErrors: filter.sumErrors,
          score: filter.score,
          topic_id: filter.topic_id,
          user_id: searchByName,
        })
      );
    }
  }, [searchByGroup, searchByName]);

  return (
    <div className={styles.studentFilterBlock}>
      <div>
        <input
          className={styles.searchByName}
          type="text"
          placeholder=" фио студента..."
          value={value}
          onChange={onChangeInput}
        />
        <svg
          className={styles.clearIcon}
          onClick={() => setValue("")}
          height="24"
          viewBox="0 0 48 48"
          width="24"
        >
          <path
            d="M38 12.83l-2.83-2.83-11.17 11.17-11.17-11.17-2.83 2.83 11.17 11.17-11.17 11.17 2.83 2.83 11.17-11.17 11.17 11.17 2.83-2.83-11.17-11.17z"
            fill="#ff7373"
          />
          <path d="M0 0h48v48h-48z" fill="none" />
        </svg>
      </div>
      <div className={styles.searchByGroup}>
        <Select
          mode="multiple"
          style={{ width: "100%" }}
          placeholder="выберите группу"
          onChange={handleGroupSelectionChanges}
          optionLabelProp="label"
        >
          {groups ? (
            groups.map((top) => (
              <Option key={top.id} value={top.id} label={top.name}>
                <Space>{top.name}</Space>
              </Option>
            ))
          ) : (
            <Option value="Все" label="China9">
              <Space>
                <span role="img" aria-label="China8ы">
                  *
                </span>
                Все группы
              </Space>
            </Option>
          )}
        </Select>
      </div>{" "}
    </div>
  );
};

export default FilterStudent;
