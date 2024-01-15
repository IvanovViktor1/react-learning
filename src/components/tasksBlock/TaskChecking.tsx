import React, { FC, useEffect, useState } from "react";
import styles from "./TasksBlock.module.scss";
import { Space, Table, Modal, Button, Input } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useSelector } from "react-redux";
import { SelectLinksData } from "redux/links/selectors";
import { SelectTasksData } from "redux/tasks/selectors";
import { SelectTopicData } from "redux/topic/selectors";
import { TopicType } from "redux/topic/types";
import { SelectGroupsData } from "redux/groups/selectors";
import { useAppDispatch } from "redux/store";
import { LinkType } from "redux/links/types";
import { fetchTasks } from "redux/tasks/asyncActions";
import { fetchLinks } from "redux/links/asyncActions";
import { fetchTopics } from "redux/topic/asyncActions";
import { fetchGroups } from "redux/groups/asyncActions";
import { SelectAnswersTasksData } from "redux/answer_to_task/selectors";
import { fetchAnswersToTasks } from "redux/answer_to_task/asyncActions";
import { SelectUserData } from "redux/user/selectors";
import { fetchUsers } from "redux/user/asyncActions";
import { TypesAnswerToTask } from "redux/answer_to_task/types";
import { updateTaskAnswer } from "redux/answer_to_task/answer_to_taskSlice";

const TasksChecking: FC = () => {
  const dispatch = useAppDispatch();
  const tasks = useSelector(SelectTasksData).tasks;
  const answers = useSelector(SelectAnswersTasksData);
  const users = useSelector(SelectUserData).users;
  const groups = useSelector(SelectGroupsData).groups;
  const allLinks = useSelector(SelectLinksData).links as LinkType[];
  const links = allLinks.filter((link) => link.link_type_id === 2);
  const topics = useSelector(SelectTopicData).items as TopicType[];
  const [openScore, setOpenScore] = useState(false);
  const [newScore, setNewScore] = useState<TypesAnswerToTask | null>(null);

  type DataAnswer = {
    key: number;
    id: number;
    id_task: number;
    link: string;
    date: string;
    description: string | undefined;
    group: string;
    score: number | null;
    comments: string | null;
    user_id: string;
    user: string;
  };

  const findGroupIdByAnswer = (userId: string) => {
    if (users) {
      return users.find((user) => user.user_id === userId)?.group_id as number;
    }
  };

  const findGoupByUserId = (userId: string) => {
    return groups.find((g) => g.id === findGroupIdByAnswer(userId))
      ?.name as string;
  };

  const data = answers?.answers?.map((answer) => {
    return {
      key: answer.id,
      id: answer.id,
      id_task: answer.id_task,
      description: tasks?.find((task) => task.id === answer.id_task)
        ?.description,
      link: answer.link,
      date: answer.date,
      // topic: topics.find(topic => topic.id === answer.)
      group: findGoupByUserId(answer.user_id),
      comments: answer.comments,
      score: answer.score,
      user: users?.find((user) => user.user_id === answer.user_id)?.name,
    };
  }) as DataAnswer[];

  const columns: ColumnsType<DataAnswer> = [
    {
      title: "№",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Задание",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Ответ",
      dataIndex: "link",
      key: "link",
      width: "20%",
      render: (text, record) => <a href={text}>{text}</a>,
    },
    {
      title: "Студент",
      dataIndex: "user",
      key: "user",
    },
    {
      title: "Группа",
      dataIndex: "group",
      key: "group",
    },
    {
      title: "Оценка",
      key: "action",
      render: (_, record) => (
        <Space size="middle" direction="vertical" align="center">
          <p>{record.score ? record.score : "не оценено"}</p>

          <a
            onClick={() =>
              checkScore({
                id: record.id,
                id_task: record.id_task,
                link: record.link,
                date: record.date,
                score: record.score,
                comments: record.comments,
                user_id: record.user_id,
              })
            }
          >
            {record.score ? "Изменить" : "Оценить"}
          </a>
        </Space>
      ),
    },
    {
      title: "Комментарий",
      key: "comments",
      width: "20%",
      render: (_, record) => (
        <Space size="middle" direction="vertical" align="center">
          <p>{record.comments ? record.comments : ""}</p>
          {record.comments ? <a>Изменить</a> : <a>Комментировать</a>}
        </Space>
      ),
    },
  ];
  const updateData = () => {
    dispatch(fetchTasks());
    dispatch(fetchLinks());
    dispatch(fetchTopics());
    dispatch(fetchGroups());
    dispatch(fetchAnswersToTasks());
    dispatch(fetchUsers());
  };

  useEffect(() => {
    updateData();
    console.log(answers);
  }, []);

  const checkScore = (data: TypesAnswerToTask) => {
    setNewScore(data);
    if (newScore) {
      setOpenScore(true);
    }
  };

  const handleOk = () => {
    setOpenScore(false);
  };

  const handleCancel = () => {
    setOpenScore(false);
  };

  return (
    <div>
      <Table columns={columns} dataSource={data} />

      {newScore ? (
        <Modal
          open={openScore}
          footer={() => (
            <div>
              <Button type="primary" onClick={handleOk}>
                Принять
              </Button>
              <Button onClick={handleCancel}>Отмена</Button>
            </div>
          )}
        >
          <h3>Оценка</h3>
          <Input
            type="number"
            value={newScore.score ? newScore.score : ""}
            onChange={(e) => {
              setNewScore({
                ...newScore,
                score: Number(e.target.value),
              });
              dispatch(
                updateTaskAnswer({
                  ...newScore,
                  score: Number(e.target.value),
                })
              );
            }}
          />

          <h3>Комментарий</h3>
          <Input
            type="text"
            value={newScore.comments ? newScore.comments : ""}
            onChange={(e) => {
              setNewScore({
                ...newScore,
                comments: e.target.value,
              });
              dispatch(
                updateTaskAnswer({
                  ...newScore,
                  comments: e.target.value,
                })
              );
            }}
          />
        </Modal>
      ) : (
        <Modal
          open={openScore}
          title="Title"
          footer={() => (
            <div>
              <Button onClick={handleCancel}>Ok</Button>
            </div>
          )}
        >
          <h2>Ошибка!</h2>
        </Modal>
      )}
    </div>
  );
};

export default TasksChecking;
