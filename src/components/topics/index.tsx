import React, { useEffect } from "react";
import styles from "./Topics.module.scss";
import { useSelector } from "react-redux";
import { GetCurrentTopic, SelectTopicData } from "redux/topic/selectors";
import { useAppDispatch } from "redux/store";
import { setCurrentTopic } from "redux/topic/topicSlice";
import { fetchTopics } from "redux/topic/asyncActions";
import { Status } from "redux/topic/types";
import { AppstoreOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Menu } from "antd";

const Topics: React.FC = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchTopics());
  }, []);

  const { items: topics, status } = useSelector(SelectTopicData);

  const onClick: MenuProps["onClick"] = (e) => {
    const id = Number(e.key);
    if (id !== selectedCurrentTopic) {
      dispatch(setCurrentTopic(id));
    } else {
      dispatch(setCurrentTopic(0));
    }
  };

  const topicItems: MenuProps["items"] = topics
    ? topics.map((topic) => ({
        label: topic.title,
        key: topic.id,
        icon: <AppstoreOutlined />,
      }))
    : undefined;

  const selectedCurrentTopic = useSelector(SelectTopicData).selectedCurrent;
  const currentTopic = useSelector(GetCurrentTopic);

  if (status === Status.SUCCESS) {
    return (
      <Menu
        onClick={onClick}
        selectedKeys={[String(currentTopic)]}
        mode="horizontal"
        items={topicItems}
      />
    );
  } else if (status === Status.LOADING) {
    return (
      <div className={styles.loader}>
        <div className={styles.ldsfacebook}>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    );
  } else {
    return <div> Ошибка загрузки тем!</div>;
  }
};

export default Topics;
