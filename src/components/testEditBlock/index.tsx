import { useAppDispatch } from "redux/store";
import { fetchQuestions } from "redux/question/asyncActions";
import { useSelector } from "react-redux";
import styles from "./TestEditBlock.module.scss";
import { SelectQuestions } from "redux/question/selectors";
import React, { useState, useEffect } from "react";
import { GetCurrentTopic, getLimitQuestions } from "redux/topic/selectors";
import { supabase } from "index";
import {
  addNewAnswer,
  addNewQuestion,
  deleteQuestion,
  removeAnswer,
  updateAnswer,
  updateQuestion,
} from "redux/question/questionSlice";
import { Status } from "redux/topic/types";
import { Json } from "database/types";
import {
  CheckOutlined,
  DeleteOutlined,
  DeleteTwoTone,
  EditTwoTone,
  PlusCircleTwoTone,
  SaveOutlined,
} from "@ant-design/icons";
import { Input, message, Card, Space, Modal } from "antd";
import { Answer, Question } from "redux/question/types";
import Checkbox from "@mui/material/Checkbox";
import Topics from "components/topics";
import { setNewLimit } from "redux/topic/topicSlice";

export var indexAnswer = 1;

type StatusUpdate = {
  visible: boolean;
  id: number;
};

const TestEditBlock: React.FC = () => {
  const topic_id = useSelector(GetCurrentTopic);
  const limit = useSelector(getLimitQuestions);
  const dispatch = useAppDispatch();
  const { questions, status: loadStatus } = useSelector(SelectQuestions);
  const [btnSaveVisibleForQuestion, setBtnSaveVisibleForQuestion] =
    useState(false);
  const [updateVisible, setUpdateVisible] = useState<StatusUpdate[]>([]);
  const { TextArea } = Input;
  const [currentLimit, setCurrentLimit] = useState(0);
  const [btnSaveLimitVisibility, setBtnSaveLimitVisibility] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [isQestionEditerOpen, setIsQestionEditerOpen] = useState(false);
  const [currentEditQuestion, setCurrentEditQuestion] = useState(0);

  const currentQuestionForUpdate = questions.find(
    (question) => question.id === currentEditQuestion
  );

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

  useEffect(() => {
    dispatch(fetchQuestions(topic_id));
  }, [topic_id]);

  useEffect(() => {
    dispatch(fetchQuestions(topic_id));
    if (limit) {
      setCurrentLimit(limit);
    }
  }, []);

  useEffect(() => {
    if (limit) {
      setCurrentLimit(limit);
    }
  }, [limit]);

  useEffect(() => {
    console.log(currentQuestionForUpdate);
  }, [currentQuestionForUpdate]);

  const addQuestion = async (topic_id: number) => {
    const { data, error } = await supabase
      .from("question")
      .insert({
        title: "Вопрос",
        answers:
          '[{"id":0,"text":"ответ 1","isCorrect":false},{"id":2,"text":"ответ 2","isCorrect":false},{"id":3,"text":"ответ 3","isCorrect":true}]',
        topic_id: topic_id,
      })
      .select();

    if (data) {
      const parsedData = data?.map((obj) => {
        const updatedAnswers = JSON.parse(obj.answers as string);
        return { ...obj, answers: updatedAnswers };
      });

      if (parsedData) {
        dispatch(addNewQuestion(parsedData[0]));
      } else {
        const aa = data.map((obj) => {
          const updatedAnswers = obj.answers;
          return { ...obj, answers: updatedAnswers as Answer[] };
        });
        dispatch(addNewQuestion(aa[0]));
      }
    }
  };

  if (loadStatus === Status.LOADING) {
    return (
      <div>
        <Topics />
        Заугрзка вопросов...
      </div>
    );
  } else if (loadStatus === Status.ERROR) {
    return (
      <div>
        <Topics />
        Ошибка загрузки вопросов!
      </div>
    );
  }

  const onQuestionChange = (question: Question) => {
    dispatch(updateQuestion(question));
  };

  const onAnswerChange = (idQuestion: number, answer: Answer) => {
    dispatch(updateAnswer({ idQuestion, answer }));
  };

  const btnSaveLimit = async () => {
    const { data, error, status } = await supabase
      .from("topics")
      .update({ limitQuestions: currentLimit })
      .eq("id", topic_id)
      .select();

    if (data) {
      msgSuccess("Updated");
      console.log(data);
      dispatch(setNewLimit(currentLimit));
      setBtnSaveLimitVisibility(false);
    } else {
      msgError(error.message);
    }
  };

  const onChangeLimit = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentLimit(Number(e.target.value));
    setBtnSaveLimitVisibility(true);
  };

  const removeQuestion = async (idQuestion: number) => {
    const { data, error } = await supabase
      .from("question")
      .delete()
      .eq("id", idQuestion)
      .select();

    if (data) {
      dispatch(deleteQuestion(idQuestion));
      msgSuccess("Успешно удалено");
    } else {
      msgError(String(error?.code));
    }
  };

  const handleSave = async () => {
    if (currentQuestionForUpdate) {
      const { id, title, answers, topic_id } = currentQuestionForUpdate;
      const answersJSON: Json = JSON.stringify(answers);
      const { data, error, status } = await supabase
        .from("question")
        .update({ id, title, answers: answersJSON, topic_id })
        .eq("id", currentEditQuestion)
        .select();

      if (data) {
        msgSuccess("Изменено");
      } else {
        msgError(error.message);
      }
      setIsQestionEditerOpen(false);
      setCurrentEditQuestion(0);
    }
  };

  const handleCancel = () => {
    setCurrentEditQuestion(0);
    setIsQestionEditerOpen(false);
  };

  const openQuestionEditer = (id: number) => {
    setCurrentEditQuestion(id);
    setIsQestionEditerOpen(true);
  };

  return (
    <div>
      {contextHolder}
      <div className={styles.topics}>
        <Topics />
      </div>

      <div className={styles.blockInputLimit}>
        <p>Количство случайных вопросов:</p>

        <Input
          type="number"
          className={styles.inputLimit}
          value={currentLimit ? currentLimit : ""}
          onChange={(e) => onChangeLimit(e)}
        />
        {btnSaveLimitVisibility ? (
          <SaveOutlined
            className={styles.btnSaveLimit}
            onClick={btnSaveLimit}
          />
        ) : (
          ""
        )}
      </div>

      <div className={styles.questions}>
        <div
          className={styles.buttonAddQuestionBlock}
          onClick={() => addQuestion(topic_id)}
        >
          <p className={styles.buttonAddQuestion}>
            добавить вопрос
            <PlusCircleTwoTone className={styles.PlusCircleTwoTone} />
          </p>
        </div>

        <div>
          <Space
            direction="vertical"
            size="middle"
            style={{ display: "flex", width: "40vw" }}
          >
            {questions.map(
              (
                {
                  id: questionId,
                  title: questionTitle,
                  answers: questionAnswers,
                  topic_id: questionTopic_id,
                },
                index
              ) => (
                <Card
                  key={questionId}
                  title={index === 0 ? "1" : index + 1}
                  size="small"
                  className={styles.questionCard}
                >
                  <>
                    <TextArea value={questionTitle} readOnly />
                    {questionAnswers?.map((a) => (
                      <p key={a.id}>
                        {a.text}{" "}
                        {a.isCorrect ? (
                          <CheckOutlined style={{ color: "green" }} />
                        ) : (
                          ""
                        )}
                      </p>
                    ))}
                    <EditTwoTone
                      className={styles.btnEditQuestion}
                      onClick={() => openQuestionEditer(questionId)}
                      twoToneColor="#52c41a"
                    />
                    <DeleteTwoTone
                      className={styles.btnRemoveQuestion}
                      onClick={() => removeQuestion(questionId)}
                      twoToneColor="#d90700"
                    />
                  </>
                </Card>
              )
            )}
          </Space>

          {currentQuestionForUpdate ? (
            <Modal
              title="Редактор вопроса"
              open={isQestionEditerOpen}
              onOk={handleSave}
              onCancel={handleCancel}
            >
              <div className={styles.questionEditer}>
                <>
                  Вопрос:{" "}
                  <Input
                    value={currentQuestionForUpdate.title}
                    onChange={(e) => {
                      onQuestionChange({
                        id: currentQuestionForUpdate.id,
                        title: e.target.value,
                        answers: currentQuestionForUpdate.answers,
                        topic_id: currentQuestionForUpdate.topic_id,
                      });
                    }}
                  />
                </>

                <>
                  Ответы:{" "}
                  {currentQuestionForUpdate.answers?.map((a, index) => (
                    <li key={a.id} className={styles.answerRow}>
                      <Input
                        value={a.text}
                        className={styles.inpAnswer}
                        onChange={(e) => {
                          onAnswerChange(currentEditQuestion, {
                            id: a.id,
                            text: e.target.value,
                            isCorrect: a.isCorrect,
                          });
                        }}
                      />{" "}
                      <div className={styles.answerBtnBlock}>
                        <Checkbox
                          className={styles.check}
                          value={a.id}
                          checked={a.isCorrect}
                          onChange={(e) => {
                            onAnswerChange(currentEditQuestion, {
                              id: a.id,
                              text: a.text,
                              isCorrect: !a.isCorrect,
                            });
                          }}
                        />
                        <DeleteTwoTone
                          className={styles.btnRemoveQuestion}
                          onClick={() =>
                            dispatch(
                              removeAnswer({
                                idQuestion: currentEditQuestion,
                                idAnswer: a.id,
                              })
                            )
                          }
                          twoToneColor="#d90700"
                        />
                      </div>
                    </li>
                  ))}
                </>

                <div
                  className={styles.addAnswer}
                  onClick={() => {
                    dispatch(
                      addNewAnswer({
                        idQuestion: currentEditQuestion,
                        newAnswer: {
                          id: currentQuestionForUpdate.answers
                            ? currentQuestionForUpdate.answers[
                                currentQuestionForUpdate.answers.length - 1
                              ].id + 1
                            : 1,
                          text: "",
                          isCorrect: false,
                        },
                      })
                    );
                  }}
                >
                  Добавить ответ
                </div>
              </div>
            </Modal>
          ) : (
            ""
          )}
        </div>
        {/* <div>
          {questions.map(
            ({
              id: questionId,
              title: questionTitle,
              answers: questionAnswers,
              topic_id: questionTopic_id,
            }) => (
              <div className={styles.questionBlock} key={questionId}>
                <div className={styles.questionTitle}>
                  <div className={styles.head}>
                    <p className={styles.questionNumber}>Вопрос {questionId}</p>
                    <DeleteOutlined
                      className={styles.btnRemoveQuestion}
                      onClick={() => removeQuestion(questionId)}
                    />
                    {hasVisibleUpdate(updateVisible, questionId) ? (
                      <SaveOutlined
                        className={styles.btnSave}
                        onClick={() =>
                          onQuestionSave({
                            id: questionId,
                            title: questionTitle,
                            answers: questionAnswers,
                            topic_id: questionTopic_id,
                          })
                        }
                      />
                    ) : (
                      ""
                    )}
                  </div>

                  <TextArea
                    rows={2}
                    size="large"
                    className={styles.questionInput}
                    value={questionTitle}
                    onChange={(e) => {
                      onQuestionChange({
                        id: questionId,
                        title: e.target.value,
                        answers: questionAnswers,
                        topic_id: questionTopic_id,
                      });
                      setBtnSaveVisibleForQuestion(true);

                      hasVisibleUpdate(updateVisible, questionId)
                        ? console.log("")
                        : setUpdateVisible([
                            ...updateVisible,
                            { visible: true, id: questionId },
                          ]);
                    }}
                  />
                </div>
                {questionAnswers.map(
                  ({
                    id: answerId,
                    text: answerText,
                    isCorrect: answerIsCorrect,
                  }) => (
                    <div className={styles.answer} key={answerId}>
                      <Checkbox
                        className={styles.checl}
                        value={answerId}
                        checked={answerIsCorrect}
                        onChange={(e) => {
                          onAnswerChange(questionId, {
                            id: answerId,
                            text: answerText,
                            isCorrect: !answerIsCorrect,
                          });
                          setBtnSaveVisibleForQuestion(true);
                          hasVisibleUpdate(updateVisible, questionId)
                            ? console.log("")
                            : setUpdateVisible([
                                ...updateVisible,
                                { visible: true, id: questionId },
                              ]);
                        }}
                      />

                      <Input
                        size="large"
                        className={styles.answerInput}
                        value={answerText}
                        onChange={(e) => {
                          onAnswerChange(questionId, {
                            id: answerId,
                            text: e.target.value,
                            isCorrect: answerIsCorrect,
                          });
                          setBtnSaveVisibleForQuestion(true);
                          hasVisibleUpdate(updateVisible, questionId)
                            ? console.log("")
                            : setUpdateVisible([
                                ...updateVisible,
                                { visible: true, id: questionId },
                              ]);
                        }}
                      />
                    </div>
                  )
                )}
                добавить ответ
              </div>
            )
          )}
        </div> */}
      </div>
    </div>
  );
};

export default TestEditBlock;
