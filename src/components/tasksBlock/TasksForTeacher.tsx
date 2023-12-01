import React, { FC, useEffect, useState } from "react";
import styles from "./TasksBlock.module.scss";
import { Select, Space, Table, Input, message, Modal } from "antd";
import type { ColumnsType, TableProps } from "antd/es/table";
import { useSelector } from "react-redux";
import { SelectLinksData } from "redux/links/selectors";
import { SelectTasksData } from "redux/tasks/selectors";
import { supabase } from "index";
import { SelectTopicData } from "redux/topic/selectors";
import { TopicType } from "redux/topic/types";
import { SelectGroupsData } from "redux/groups/selectors";
import TextArea from "antd/es/input/TextArea";
import { useAppDispatch } from "redux/store";
import { Status, TypesTask } from "redux/tasks/types";
import {
  addNewInitialTask,
  addNewTask,
  removeTaskById,
  updateTaskById,
} from "redux/tasks/taskSlice";
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
import { error } from "console";

interface DataType {
  key: React.Key;
  id: number;
  description: string;
  link: string;
  topic: string;
  group: string;
  deadline: string;
}

const TasksForTeacher: FC = () => {
  const dispatch = useAppDispatch();
  const newTask = useSelector(SelectTasksData).currentTask;
  const tasks = useSelector(SelectTasksData).tasks;
  const groups = useSelector(SelectGroupsData).groups;
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const allLinks = useSelector(SelectLinksData).links as LinkType[];
  const links = allLinks.filter((link) => link.link_type_id === 2);
  const topics = useSelector(SelectTopicData).items as TopicType[];
  const statusLoadTasks = useSelector(SelectTasksData).status;
  const statusLoadLinks = useSelector(SelectLinksData).status;
  const statusLoadTopics = useSelector(SelectTopicData).status;
  const statusLoadGroups = useSelector(SelectGroupsData).status;
  const [selectedLink, setSelectedLink] = useState<IDocument[]>();
  const [visibleLinkDoc, setVisibleLinkDoc] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const nData = tasks?.map((task) => {
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
      title: "Целевая аудитория",
      dataIndex: "group",
      key: "group",
    },
    {
      title: "Крайний срок",
      dataIndex: "deadline",
      key: "deadline",
    },
    {
      title: "Действия",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => updateTask(record.id)}>Редактировать </a>
          <a onClick={() => removeTask(record.id)}>Удалить</a>
        </Space>
      ),
    },
  ];
  const updateData = () => {
    dispatch(fetchTasks());
    dispatch(fetchLinks());
    dispatch(fetchTopics());
    dispatch(fetchGroups());
  };

  useEffect(() => {
    updateData();
  }, []);

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

  const removeTask = async (id: number) => {
    const { error } = await supabase.from("task").delete().eq("id", id);

    if (error) {
      msgError(error.message);
    } else {
      dispatch(removeTaskById(id));
      msgSuccess("Удалено");
    }
  };

  const updateTask = async (id: number) => {
    const currentTask = tasks?.find((task) => task.id === id) as TypesTask;

    const promise = new Promise((resolve, reject) => {
      resolve(
        dispatch(
          addNewInitialTask({
            id: currentTask.id,
            description: currentTask.description,
            link_id: currentTask.link_id,
            topic_id: currentTask.topic_id,
            group_id: currentTask.group_id,
            deadline: currentTask.deadline,
          })
        )
      );
    });

    promise.then(() => setOpen(true));
  };

  const handleOk = async () => {
    setConfirmLoading(true);
    if (newTask) {
      if (nData.find((task) => task.id === newTask.id)) {
        const { data, error } = await supabase
          .from("task")
          .update({
            description: newTask.description,
            link_id: newTask.link_id,
            topic_id: newTask.topic_id,
            group_id: newTask.group_id,
            deadline: newTask.deadline,
          })
          .eq("id", newTask.id ? newTask.id : 9999)
          .select();

        if (data) {
          dispatch(updateTaskById(data[0]));

          setTimeout(() => {
            setOpen(false);
            msgSuccess("Изменено успешно");
            setConfirmLoading(false);
          }, 2000);
        } else {
          msgError(error.message);
        }
      } else {
        const { data, error } = await supabase
          .from("task")
          .insert([
            {
              description: newTask.description,
              link_id: newTask.link_id,
              topic_id: newTask.topic_id,
              group_id: newTask.group_id,
              deadline: newTask.deadline,
            },
          ])
          .select();

        if (data) {
          dispatch(addNewTask(data[0]));

          setTimeout(() => {
            setOpen(false);
            msgSuccess("Добавлено");
            setConfirmLoading(false);
          }, 2000);
        } else {
          msgError(error.message);
        }
      }
    }
  };

  const handleCancel = () => {
    setConfirmLoading(false);

    const promise = new Promise((resolve, reject) => {
      resolve(
        dispatch(
          addNewInitialTask({
            id: null,
            description: "",
            link_id: 1,
            topic_id: 1,
            group_id: 1,
            deadline: "",
          })
        )
      );
    });

    promise.then(() => setOpen(false));
  };

  const addTask = () => {
    const promise = new Promise((resolve, reject) => {
      resolve(
        dispatch(
          addNewInitialTask({
            id: null,
            description: "",
            link_id: 1,
            topic_id: 1,
            group_id: 1,
            deadline: "",
          })
        )
      );
    });
    promise.then(() => setOpen(true));
  };

  if (
    statusLoadTasks === Status.SUCCESS &&
    statusLoadLinks === Status.SUCCESS &&
    statusLoadTopics === Status.SUCCESS &&
    statusLoadGroups === Status.SUCCESS
  ) {
    return (
      <div>
        {contextHolder}
        <div className={styles.addTask} onClick={addTask}>
          Добавить
        </div>
        <Table columns={columns} dataSource={nData} />

        <Modal
          className={styles.Modal}
          title="Новое задание"
          open={open}
          onOk={handleOk}
          confirmLoading={confirmLoading}
          onCancel={handleCancel}
        >
          <div className={styles.modalAddTask}>
            <table>
              <>
                <tr>
                  <td>Описание</td>
                  <td>
                    <Input
                      type="text"
                      placeholder="Описание"
                      value={newTask?.description}
                      onChange={(e) => {
                        if (newTask) {
                          dispatch(
                            addNewInitialTask({
                              ...newTask,
                              description: e.target.value,
                            })
                          );
                        }
                      }}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Тема</td>
                  <td>
                    <Space wrap>
                      <Select
                        className={styles.selectGroup}
                        placeholder="Тема"
                        style={{ width: 400 }}
                        // defaultValue={newTask?.topic_id}
                        value={newTask?.topic_id}
                        onChange={(value) => {
                          if (newTask) {
                            dispatch(
                              addNewInitialTask({
                                ...newTask,
                                topic_id: value,
                              })
                            );
                          }
                        }}
                        options={topics.map((topic) => {
                          return { value: topic.id, label: topic.title };
                        })}
                      />
                    </Space>
                  </td>
                </tr>
                <tr>
                  <td>Задание</td>
                  <td>
                    <Space wrap>
                      <Select
                        className={styles.selectGroup}
                        placeholder="Выберите задание"
                        style={{ width: 400 }}
                        // defaultValue={newTask?.link_id}
                        value={newTask?.link_id}
                        onChange={(value) => {
                          if (newTask) {
                            dispatch(
                              addNewInitialTask({
                                ...newTask,
                                link_id: value,
                              })
                            );
                          }
                        }}
                        options={links
                          .filter((link) => link.topic_id === newTask?.topic_id)
                          .map((link) => {
                            return { value: link.id, label: link.description };
                          })}
                      />
                    </Space>
                  </td>
                </tr>

                <tr>
                  <td>Крайний срок</td>
                  <td>
                    <Input
                      type="text"
                      placeholder="Крайний срок"
                      // defaultValue={newTask?.deadline}
                      value={newTask?.deadline}
                      onChange={(e) => {
                        if (newTask) {
                          dispatch(
                            addNewInitialTask({
                              ...newTask,
                              deadline: e.target.value,
                            })
                          );
                        }
                      }}
                    />
                  </td>
                </tr>

                <tr>
                  <td>Группа</td>
                  <td>
                    <Space wrap>
                      <Select
                        className={styles.selectGroup}
                        placeholder="группа"
                        style={{ width: 400 }}
                        // defaultValue={newTask?.group_id}
                        value={newTask?.group_id}
                        onChange={(value) => {
                          if (newTask) {
                            dispatch(
                              addNewInitialTask({
                                ...newTask,
                                group_id: value,
                              })
                            );
                          }
                        }}
                        options={groups.map((group) => {
                          return { value: group.id, label: group.name };
                        })}
                      />
                    </Space>
                  </td>
                </tr>
              </>
            </table>
          </div>
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

export default TasksForTeacher;
