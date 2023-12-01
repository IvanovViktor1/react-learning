import React, { FC, useEffect, useState } from "react";
import styles from "./TasksBlock.module.scss";
import { Select, Space, Table, Tag } from "antd";
import type { ColumnsType, TableProps } from "antd/es/table";
import { useSelector } from "react-redux";
import { SelectLinksData } from "redux/links/selectors";
import { SelectTasksData } from "redux/tasks/selectors";
import { supabase } from "index";
import { Input, message } from "antd";
import { Button, Modal } from "antd";
import { SelectTopicData } from "redux/topic/selectors";
import { TopicType } from "redux/topic/types";
import { SelectGroupsData } from "redux/groups/selectors";
import TextArea from "antd/es/input/TextArea";
import { useAppDispatch } from "redux/store";
import { Status, TypesTask } from "redux/tasks/types";
import { LinkType } from "redux/links/types";
import { fetchTasks } from "redux/tasks/asyncActions";
import { fetchLinks } from "redux/links/asyncActions";
import { fetchTopics } from "redux/topic/asyncActions";
import { fetchGroups } from "redux/groups/asyncActions";
import { result } from "lodash";
import DocViewer, {
  DocViewerRenderers,
  IDocument,
} from "@cyntler/react-doc-viewer";
import { CloseOutlined } from "@ant-design/icons";
import { SelectUserData } from "redux/user/selectors";
import { fetchAnswersToTasks } from "redux/answer_to_task/asyncActions";
import { SelectAnswersTasksData } from "redux/answer_to_task/selectors";
import {
  addTaskAnswer,
  updateTaskAnswer,
} from "redux/answer_to_task/answer_to_taskSlice";
import { TypesAnswerToTask } from "redux/answer_to_task/types";

interface DataType {
  key: React.Key;
  id: number;
  description: string;
  link: string;
  topic: string;
  group: string;
  deadline: string;
  linkToAnswer: string;
  responseDate: string;
  score: number;
  comments: string;
}

type InputNewAnswerLink = {
  task_id: number;
  link: string;
};

const TasksForStudent: FC = () => {
  const dispatch = useAppDispatch();
  const tasks = useSelector(SelectTasksData).tasks;
  const answersToTasks = useSelector(SelectAnswersTasksData);
  const groups = useSelector(SelectGroupsData).groups;
  const allLinks = useSelector(SelectLinksData).links as LinkType[];
  const links = allLinks.filter((link) => link.link_type_id === 2);
  const topics = useSelector(SelectTopicData).items as TopicType[];
  const statusLoadTasks = useSelector(SelectTasksData).status;
  const statusLoadLinks = useSelector(SelectLinksData).status;
  const statusLoadTopics = useSelector(SelectTopicData).status;
  const statusLoadGroups = useSelector(SelectGroupsData).status;
  const [selectedLink, setSelectedLink] = useState<IDocument[]>();
  const [visibleLinkDoc, setVisibleLinkDoc] = useState(false);
  const currentUserInfo = useSelector(SelectUserData);
  const [messageApi, contextHolder] = message.useMessage();
  const [newAnswerLink, setNewAnswerLink] = useState<InputNewAnswerLink>({
    task_id: 9999,
    link: " ",
  });
  const msgSuccess = (text: string) => {
    messageApi.open({
      type: "success",
      content: "Успешно",
    });
  };
  const msgError = (text: string) => {
    messageApi.open({
      type: "error",
      content: text,
    });
  };
  const [isModalInputLinkOpen, setIsModalInputLinkOpen] = useState(false);

  const allTasksData = tasks?.map((task) => {
    return {
      key: task.id as React.Key,
      id: task.id as Number,
      description: task.description as String,
      link: links.find((l) => l.id === task.link_id)?.description as String,
      topic: topics.find((t) => t.id === task.topic_id)?.title as String,
      group: groups.find((g) => g.id === task.group_id)?.name as String,
      deadline: task.deadline as String,
    };
  }) as DataType[];

  const currentUserGroupName = groups.find(
    (g) => g.id === currentUserInfo?.databaseInfo?.group_id
  )?.name;

  const findCurrentTaskByUser = answersToTasks?.answers?.find(
    (task) => task.user_id === currentUserInfo.sessionInfo?.user_id
  );
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

  const user_id = currentUserInfo.sessionInfo?.user_id;

  const nnData = allTasksData
    .filter((data) => data.group === currentUserGroupName)
    .map((tasks) => {
      if (findCurrentTaskByUser) {
        return {
          ...tasks,
          // linkToAnswer: findCurrentTaskByUser.link
          //   ? findCurrentTaskByUser.link
          //   : "",
          linkToAnswer: answersToTasks.answers?.find(
            (answer) =>
              answer.user_id === user_id && answer.id_task === tasks.id
          )?.link,
          // responseDate: parsedDate(findCurrentTaskByUser.date),
          responseDate: parsedDate(
            answersToTasks.answers?.find((a) => a.user_id === user_id) //&& a.id_task === tasks.id
              ?.date as string
          ),
          score: findCurrentTaskByUser.score,
          comments: findCurrentTaskByUser.comments,
        };
      } else {
        return {
          ...tasks,
        };
      }
    }) as DataType[];

  const columns: ColumnsType<DataType> = [
    {
      title: "№",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Описание",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Ссылка на задание",
      dataIndex: "link",
      key: "link",
      render: (text, record) => (
        <a onClick={() => openLink(record.link)}>{text}</a>
      ),
    },
    {
      title: "Тема",
      dataIndex: "topic",
      key: "topic",
    },
    {
      title: "Крайний срок",
      dataIndex: "deadline",
      key: "deadline",
    },
    {
      title: "Ссылка на выполненное задание",
      dataIndex: "linkToAnswer",
      key: "linkToAnswer",
      render: (_, record) => (
        <Space size="middle">
          <p>{record.linkToAnswer} </p>
          <a onClick={() => addAnswerLink(record.id)}>Изменить</a>
        </Space>
      ),
    },
    {
      title: "Дата",
      dataIndex: "responseDate",
      key: "responseDate",
    },
    {
      title: "Оценка",
      dataIndex: "score",
      key: "score",
    },
    {
      title: "Комментарии",
      dataIndex: "comments",
      key: "comments",
    },
  ];

  const updateData = () => {
    dispatch(fetchAnswersToTasks());
    dispatch(fetchTasks());
    dispatch(fetchLinks());
    dispatch(fetchTopics());
    dispatch(fetchGroups());
  };

  useEffect(() => {
    updateData();
  }, []);

  useEffect(() => {
    console.log(newAnswerLink);
  }, [newAnswerLink]);

  const addAnswerLink = (task_id: number) => {
    const currentLink = answersToTasks?.answers?.find(
      (a) => a.user_id === currentUserInfo.sessionInfo?.user_id
    )?.link;

    setNewAnswerLink({
      task_id,
      link: currentLink ? currentLink : " ",
    });
    setIsModalInputLinkOpen(true);
  };

  const handleInputAnswerOk = async () => {
    const current_timestamp = new Date().toISOString();
    const userId = currentUserInfo.sessionInfo?.user_id as string;
    const task_id = newAnswerLink.task_id;

    // if (userId && findCurrentTaskByUser) {
    //   if (answersToTasks.answers?.find((a) => a.id_task !== task_id)) {
    //     const { data, error } = await supabase
    //       .from("answer_to_task")
    //       .insert([
    //         {
    //           id_task: task_id,
    //           link: newAnswerLink.link,
    //           date: current_timestamp,
    //           user_id: userId,
    //         },
    //       ])
    //       .select();
    //   } else {
    //     const { data, error } = await supabase
    //       .from("answer_to_task")
    //       .update({ link: newAnswerLink.link, date: current_timestamp })
    //       .eq("id_task", task_id)
    //       .select();

    //     dispatch(
    //       updateTaskAnswer({
    //         id: findCurrentTaskByUser.id,
    //         id_task: task_id,
    //         link: newAnswerLink.link,
    //         date: current_timestamp,
    //         score: findCurrentTask.score,
    //         comments: findCurrentTask.comments,
    //         user_id: userId,
    //       })
    //     );
    //   }
    //   setIsModalInputLinkOpen(false);
    // }

    const addTask = async () => {
      const { data, error } = await supabase
        .from("answer_to_task")
        .insert([
          {
            id_task: task_id,
            link: newAnswerLink.link,
            date: current_timestamp,
            user_id: userId,
          },
        ])
        .select();
      if (data) {
        dispatch(addTaskAnswer(data[0]));
        msgSuccess("Ответ добавлен успешно");
      } else {
        msgError(error.message);
      }
    };

    const updateTask = async () => {
      const { data, error } = await supabase
        .from("answer_to_task")
        .update({ link: newAnswerLink.link, date: current_timestamp })
        .eq("id_task", task_id)
        .select();
      if (data) {
        dispatch(updateTaskAnswer(data[0]));
        msgSuccess("Ответ добавлен успешно");
        setIsModalInputLinkOpen(false);
      } else {
        msgError(error.message);
      }
    };

    if (findCurrentTaskByUser) {
      updateTask();
    } else {
      addTask();
    }
  };

  const handleInputAnswerCancel = () => {
    setIsModalInputLinkOpen(false);
  };

  const openLink = (description: string) => {
    setVisibleLinkDoc(true);

    const findDoc: IDocument = {
      uri: links?.find((link) => link.description === description)
        ?.link as string,
    };
    if (findDoc) {
      setSelectedLink([findDoc, findDoc]);
    }
  };

  if (
    statusLoadTasks === Status.SUCCESS &&
    statusLoadLinks === Status.SUCCESS &&
    statusLoadTopics === Status.SUCCESS &&
    statusLoadGroups === Status.SUCCESS
  ) {
    return (
      <div>
        Досутпные задания
        <Table columns={columns} dataSource={nnData} />
        <Modal
          title="Введите ссылку"
          open={isModalInputLinkOpen}
          onOk={handleInputAnswerOk}
          onCancel={handleInputAnswerCancel}
        >
          <Input
            placeholder="ссылка.."
            value={newAnswerLink.link}
            onChange={(e) =>
              setNewAnswerLink({
                ...newAnswerLink,
                link: e.target.value,
              })
            }
          />
        </Modal>
        <div
          className={
            visibleLinkDoc ? styles.docViewer : styles.docViewerUnvisible
          }
        >
          <div className={styles.btnCloseLinkDoc}>
            <CloseOutlined onClick={() => setVisibleLinkDoc(false)} />
          </div>

          {selectedLink ? (
            <DocViewer
              documents={selectedLink}
              activeDocument={selectedLink[0]}
              pluginRenderers={DocViewerRenderers}
            />
          ) : (
            ""
          )}
        </div>
      </div>
    );
  } else {
    return (
      <div className={styles.loader}>
        <div className={styles.lds_ellipsis}>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    );
  }
};

export default TasksForStudent;
