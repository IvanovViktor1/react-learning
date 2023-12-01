import React, { useEffect, useState } from "react";
import {
  BarChartOutlined,
  DatabaseOutlined,
  EllipsisOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Menu } from "antd";
import styles from "./TeachersRoom.module.scss";
import Header from "components/Header";
import Rating from "components/teachersRoomComponents/rating";
import Students from "components/teachersRoomComponents/students";
import { fetchRating } from "redux/results/asyncActions";
import { useAppDispatch } from "redux/store";
import { fetchUsers } from "redux/user/asyncActions";
import { fetchGroups } from "redux/groups/asyncActions";
import Links from "components/teachersRoomComponents/links";

type ContentRoomComponent = {
  key: string;
  value: JSX.Element;
};

const content: ContentRoomComponent[] = [
  { key: "rating", value: <Rating /> },
  { key: "students", value: <Students /> },
  { key: "links", value: <Links /> },
];

const items: MenuProps["items"] = [
  {
    label: "Оценки",
    key: "rating",
    icon: <BarChartOutlined />,
  },
  {
    label: "Студенты",
    key: "students",
    icon: <EllipsisOutlined />,
  },
  {
    label: "Документы",
    key: "links",
    icon: <DatabaseOutlined />,
  },
];

const TeachersRoom: React.FC = () => {
  const dispatch = useAppDispatch();
  const [currentComponent, setCurrentComponent] = useState("rating");
  const onClick: MenuProps["onClick"] = (e) => {
    setCurrentComponent(e.key);
  };

  useEffect(() => {
    dispatch(fetchRating());
    dispatch(fetchUsers());
    dispatch(fetchGroups());
  }, []);

  return (
    <>
      <Header />
      <Menu
        onClick={onClick}
        selectedKeys={[currentComponent]}
        mode="horizontal"
        items={items}
      />
      <div className={styles.content}>
        {content.find((content) => content.key === currentComponent)?.value}
      </div>
    </>
  );
};

export default TeachersRoom;
