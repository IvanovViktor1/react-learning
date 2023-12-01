import React, { FC, useEffect, useState } from "react";
import { useAppDispatch } from "redux/store";
import styles from "./Home.module.scss";

import { fetchGroups } from "redux/groups/asyncActions";
import { fetchRoles } from "redux/roles/asyncActions";
import { Menu, MenuProps } from "antd";
import {
  CaretRightOutlined,
  DatabaseOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import TasksForTeacher from "components/tasksBlock/TasksForTeacher";
import TasksForStudent from "components/tasksBlock/TasksForStudent";
import TestEditBlock from "components/testEditBlock";
import BlockOfLectures from "components/blockOfLectures";
import TestBlock from "components/testBlock";
import {
  ContainerOutlined,
  DesktopOutlined,
  PieChartOutlined,
} from "@ant-design/icons";
import Rating from "components/teachersRoomComponents/rating";
import { useSelector } from "react-redux";
import { SelectUserData } from "redux/user/selectors";
import { supabase } from "index";
import Authorization from "components/authentication/Authorization";
type MenuItem = Required<MenuProps>["items"][number];
export interface HomeProps {
  topic_id: number;
}
export type topic_id = number;
type ContentRoomComponent = {
  key: string;
  value: JSX.Element;
};

const Home: FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  const sessionInfo = useSelector(SelectUserData).sessionInfo;
  const user = useSelector(SelectUserData);

  if (user.databaseInfo?.role_id === 2) {
  }
  const content: ContentRoomComponent[] = [
    { key: "blockOfLectures", value: <BlockOfLectures /> },
    { key: "testBlock", value: <TestBlock /> },
    { key: "tasksBlockForTeacher", value: <TasksForTeacher /> },
    { key: "tasksBlockForStudent", value: <TasksForStudent /> },
    { key: "testEditBlock", value: <TestEditBlock /> },
    { key: "raiting", value: <Rating /> },
  ];

  function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
    type?: "group"
  ): MenuItem {
    return {
      key,
      icon,
      children,
      label,
      type,
    } as MenuItem;
  }

  const itemsForTeacher: MenuItem[] = [
    getItem("Лекции", "blockOfLectures", <PieChartOutlined />),
    getItem("Тестирование", "testBlock", <DesktopOutlined />),
    getItem("Задания", "tasksBlockForTeacher", <ContainerOutlined />),
    getItem("Настройка тестирования", "testEditBlock", <DatabaseOutlined />),
    getItem("оценки", "raiting", <DatabaseOutlined />),
  ];

  const itemsForStudent: MenuItem[] = [
    getItem("Лекции", "blockOfLectures", <PieChartOutlined />),
    getItem("Тестирование", "testBlock", <DesktopOutlined />),
    getItem("Задания", "tasksBlockForStudent", <ContainerOutlined />),
    getItem("оценки", "raiting", <DatabaseOutlined />),
  ];

  const dispatch = useAppDispatch();
  const [currentComponent, setCurrentComponent] = useState("blockOfLectures");
  useEffect(() => {
    dispatch(fetchRoles());
    dispatch(fetchGroups());
  }, []);

  const onClick: MenuProps["onClick"] = (e) => {
    setCurrentComponent(e.key);
  };
  if (sessionInfo?.user_email) {
    return (
      <div className={styles.home}>
        <div className={styles.btnOpenMenu}>
          {collapsed ? (
            <RightOutlined onClick={() => setCollapsed(!collapsed)} />
          ) : (
            <LeftOutlined onClick={() => setCollapsed(!collapsed)} />
          )}
        </div>

        <div className={styles.menuG}>
          <Menu
            className={styles.menu}
            defaultSelectedKeys={["blockOfLectures"]}
            defaultOpenKeys={["blockOfLectures"]}
            mode="vertical"
            theme="light"
            inlineCollapsed={collapsed}
            items={
              user.databaseInfo?.role_id === 2
                ? itemsForTeacher
                : itemsForStudent
            }
            onClick={(e) => {
              onClick(e);
              // console.log(e);
              // setCollapsed(!collapsed);
            }}
            selectedKeys={[currentComponent]}
          />
        </div>

        <div className={styles.content}>
          {content.find((content) => content.key === currentComponent)?.value}
        </div>
      </div>
    );
  } else {
    return (
      <div className={styles.notUser}>
        <Authorization />
      </div>
    );
    // return <div>123</div>;
  }
};

export default Home;
