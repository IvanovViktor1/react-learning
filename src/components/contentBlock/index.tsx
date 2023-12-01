import TestBlock from "components/testBlock";
import TestEditBlock from "components/testEditBlock";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { GetCurrentTopic, SelectTopicDataById } from "redux/topic/selectors";
import styles from "./ContentBlock.module.scss";
import { setTopicNewTitle } from "redux/topic/topicSlice";
import BlockOfLectures from "components/blockOfLectures";
import SettingsIcon from "@mui/icons-material/Settings";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useAppDispatch } from "redux/store";
import { supabase } from "index";
import { SelectUserData } from "redux/user/selectors";
import AlertDialogSlide from "components/AlertDialogSlide";
import { SelectQuestions } from "redux/question/selectors";
import { Status } from "redux/question/types";
import TasksBlock from "components/tasksBlock/TasksForStudent";
import TasksForStudent from "components/tasksBlock/TasksForStudent";

export type BlockOfLucturesProp = {
  isVisible: boolean;
};

const ContentBlock: React.FC = () => {
  const dispatch = useAppDispatch();
  const [testVisiblity, setTestVisibility] = useState(false);
  const [editTestVisiblity, setEditTestVisibility] = useState(false);
  const [lecturesVisiblity, setLecturesVisibility] = useState(false);
  const [tasksBlockVisiblity, setTasksBlockVisibility] = useState(false);
  const currentTopic = useSelector(GetCurrentTopic);
  const topicData = useSelector(SelectTopicDataById(currentTopic));
  const [topicTitle, setTopicTitle] = useState(topicData?.title);
  const [openModal, setOpenModal] = React.useState(false);
  const [alertDialogSlideVisible, setAlertDialogSlideVvisible] =
    useState(false);
  const testBlock = useRef<HTMLDivElement>(null);
  const testEditBlock = useRef<HTMLDivElement>(null);
  const tasksBlock = useRef<HTMLDivElement>(null);
  const role = useSelector(SelectUserData).databaseInfo?.role_id;
  const scrollToComponent = (component: React.RefObject<HTMLDivElement>) => {
    setTimeout(() => {
      component.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 300);
  };

  const fetchQuestionsStatus = useSelector(SelectQuestions).status;

  useEffect(() => {
    setLecturesVisibility(false);
  }, []);

  useEffect(() => {
    setTopicTitle(topicData?.title);
  }, [openModal]);

  const handleClose = () => {
    setOpenModal(false);
  };

  const handleApply = () => {
    async function updateTopic() {
      if (topicData?.id && topicTitle) {
        const { data, error } = await supabase
          .from("topics")
          .update({ title: topicTitle })
          .eq("id", topicData?.id)
          .select();
        dispatch(
          setTopicNewTitle({ topic_id: topicData?.id, title: topicTitle })
        );
      }
    }
    try {
      updateTopic();
      setOpenModal(false);
    } catch (error) {}
  };

  const onSettings = () => {
    setOpenModal(true);
  };

  const handleDataBlockOfLuctures = (data: BlockOfLucturesProp) => {
    setLecturesVisibility(data.isVisible);
  };

  const openTest = () => {
    setAlertDialogSlideVvisible(true);
    // setTestVisibility(true);
  };

  const openTasksBlock = () => {
    setTasksBlockVisibility(true);
    if (tasksBlockVisiblity) {
      scrollToComponent(tasksBlock);
    }
  };

  useEffect(() => {
    if (testVisiblity && fetchQuestionsStatus === Status.SUCCESS) {
      scrollToComponent(testBlock);
    }
  }, [testVisiblity, fetchQuestionsStatus]);

  const openEditTest = () => {
    setEditTestVisibility(true);
    if (editTestVisiblity && fetchQuestionsStatus === Status.SUCCESS) {
      scrollToComponent(testEditBlock);
    }
  };

  const [dataAlert, setDataAlert] = useState(false);

  if (currentTopic !== 0) {
    return (
      <div>
        {alertDialogSlideVisible ? (
          <AlertDialogSlide
            title={"Подтвердите открытие"}
            dialogText={
              " При последующем закрытии теста, результаты будут записываться. Если Вы не готовы решить тест, закройте это окно.."
            }
            btnOkText={"Открыть"}
            btnCancelText={"Закрыть"}
            onOk={setTestVisibility}
          />
        ) : (
          ""
        )}

        <div className={styles.contentTopic}>
          <div className={styles.headBlock}>
            <div className={styles.blockContent}>
              <h4> ТЕМА № {currentTopic}</h4>
              <h5>{topicData?.title}</h5>
            </div>
            {role === 2 ? (
              <div onClick={onSettings}>
                <SettingsIcon
                  viewBox="0 0 24 24"
                  className={styles.btnSetting}
                />
              </div>
            ) : (
              ""
            )}
          </div>

          <div className={styles.buttonBar}>
            <div className={styles.button}>
              <p
                className={styles.openLectures}
                onClick={() => setLecturesVisibility(true)}
                onDoubleClick={() => setLecturesVisibility(false)}
              >
                Лекционный материал
              </p>
            </div>
            <div className={styles.button}>
              <p
                onClick={openTasksBlock}
                onDoubleClick={() => setTasksBlockVisibility(false)}
              >
                Задания
              </p>
            </div>
            <div className={styles.button}>
              <p
                onClick={openTest}
                onDoubleClick={() => setTestVisibility(false)}
              >
                Тестирование
              </p>
            </div>
            {role === 2 ? (
              <div className={styles.button}>
                <p
                  onClick={openEditTest}
                  onDoubleClick={() => setEditTestVisibility(false)}
                >
                  Правка теста
                </p>
              </div>
            ) : (
              ""
            )}
          </div>

          <React.Fragment>
            <Dialog open={openModal} onClose={handleClose}>
              <DialogTitle>Изменить описание темы</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  To subscribe to this website, please enter your email address
                  here. We will send updates occasionally.
                </DialogContentText>
                <TextField
                  autoFocus
                  margin="dense"
                  id="name"
                  label="Наименование"
                  value={topicTitle}
                  onChange={(e) => setTopicTitle(e.target.value)}
                  type="text"
                  fullWidth
                  variant="outlined"
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose}>Отмена</Button>
                <Button onClick={handleApply}>Применить изменения</Button>
              </DialogActions>
            </Dialog>
          </React.Fragment>
        </div>
        <div className={styles.content}>
          <div ref={testBlock}> {testVisiblity ? <TestBlock /> : null}</div>
          <div ref={testEditBlock}>
            {editTestVisiblity ? <TestEditBlock /> : null}
          </div>
          <div>{lecturesVisiblity ? <BlockOfLectures /> : null}</div>
          <div ref={tasksBlock}>
            {tasksBlockVisiblity ? <TasksForStudent /> : null}
          </div>
        </div>
      </div>
    );
  } else return null;
};

export default ContentBlock;
