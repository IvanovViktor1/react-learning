import React, { useState, useRef, useEffect, FC, useMemo } from "react";
import { useSelector } from "react-redux";
import styles from "./TestBlock.module.scss";
import { fetchQuestions } from "redux/question/asyncActions";
import {
  SelectQuestions,
  SelectQuestionsByTopic,
} from "redux/question/selectors";
import { useAppDispatch } from "redux/store";
import {
  GetCurrentTopic,
  SelectTopicData,
  getLimitQuestions,
} from "redux/topic/selectors";

import { SelectUserData } from "redux/user/selectors";
import { supabase } from "index";
import { setResult } from "redux/results/resultSlice";

import { Json } from "database/types";
import Topics from "components/topics";
import { Question } from "redux/question/types";

export type Result = {
  questionId: number;
  answerId: number;
  isCorrect: boolean;
};

export type Ress = {
  res: Result[];
  score: number;
};

const TestBlock: FC = () => {
  const [visibleResult, setVisibleResult] = useState(false);
  const [visibleScore, setVisibleScore] = useState(false);
  const dispatch = useAppDispatch();
  const topic_id = useSelector(GetCurrentTopic) as number;
  const allQuestions = useSelector(SelectQuestions).questionsRnd as Question[];
  const user_id = useSelector(SelectUserData).sessionInfo?.user_id;
  // const sumQuestions = useSelector(SelectQuestionsByTopic(topic_id)).length;

  const limit = useSelector(getLimitQuestions) as number;

  const questions = allQuestions
    .filter((question) => question.topic_id === topic_id)
    .slice(0, limit) as Question[];

  const [results, setResults] = useState<Ress>({
    res: [],
    score: 0,
  });

  const current_timestamp = new Date().toISOString();

  const fetchResults = () => {
    const errors = results.res
      .map((res) => (res.isCorrect === false ? res.questionId : 999))
      .filter((item) => item !== 999);

    const errorsJSON: Json = JSON.stringify(errors);

    async function insertResults() {
      try {
        if (user_id) {
          const { data, error } = await supabase
            .from("result")
            .insert([
              {
                date: current_timestamp,
                errors: errorsJSON,
                topic_id,
                user_id,
                score: results.score,
                score_for: 1,
              },
            ])
            .select();

          if (data) {
            const parsedData = data?.map((obj) => {
              const dataErrors = JSON.parse(obj.errors as string) as
                | number[]
                | null;
              const newdate = new Date(obj.date) as Date;
              return { ...obj, errors: dataErrors, date: newdate };
            });

            if (parsedData) {
              dispatch(setResult(parsedData[0]));
            }
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
    insertResults();
  };

  useEffect(() => {
    async function fetchQuestion() {
      try {
        if (topic_id) {
          dispatch(fetchQuestions(topic_id));
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchQuestion();
  }, []);

  const handleClick = (answerId: number, text: string, questionId: number) => {
    const findQuestionAnswers = questions.find(
      (question) => question.id === questionId
    )?.answers;

    const isCorrect = findQuestionAnswers?.find(
      (answer) => answer.text === text
    )?.isCorrect as boolean;

    setResults((newRes) => {
      const sumQuestions = questions.length;
      const sumCorrectAnswer = isCorrect
        ? newRes.res.filter((result) => result.isCorrect === true).length + 1
        : newRes.res.filter((result) => result.isCorrect === true).length;
      const newScore =
        sumCorrectAnswer === 0
          ? Math.round((1 / sumQuestions) * 100)
          : Math.round((sumCorrectAnswer / sumQuestions) * 100);
      return {
        res: [
          ...newRes.res.filter((result) => result.questionId !== questionId),
          { questionId, answerId, isCorrect },
        ],
        score: newScore,
      };
    });
  };

  const finishTest = () => {
    fetchResults();
    setVisibleResult(true);
  };

  useEffect(() => {
    if (questions.length > 0) {
      setVisibleScore(true);
    } else {
      setVisibleScore(false);
    }
  }, [questions]);

  return (
    <div>
      <Topics />
      <div className={styles.testList}>
        <h2>Выберите правильный ответ</h2>

        {visibleScore ? (
          <div className={styles.titleTestList}>
            <div className={styles.counter}>решено {results.res.length}</div>
          </div>
        ) : (
          ""
        )}

        {questions.map(
          ({ id: questionId, title, answers, topic_id }, index) => (
            <div key={questionId} className={styles.questionBlock}>
              <div>
                <p className={styles.id}>Вопрос № {index + 1}</p>
                <p className={styles.title}>{title}</p>
              </div>
              <div className={styles.answersBlock}>
                {answers?.map(({ id: answerId, text }) => (
                  <div key={answerId} className={styles.answer}>
                    <li
                      key={answerId}
                      className={
                        visibleResult
                          ? results.res.find(
                              (result) =>
                                result.questionId === questionId &&
                                result.answerId === answerId
                            )?.isCorrect === true
                            ? styles.correct
                            : styles.uncorrect
                          : results.res.find(
                              (result) => result.questionId === questionId
                            )?.answerId === answerId
                          ? styles.currentAnswer
                          : styles.unCurrentAnswer
                      }
                      onClick={() => handleClick(answerId, text, questionId)}
                    >
                      {text}
                    </li>
                  </div>
                ))}
              </div>
            </div>
          )
        )}

        {results.res.length === 0 ? (
          ""
        ) : visibleResult ? (
          <button
            className={styles.EndOfTesting}
            onClick={() => {
              document.location.href = "/react-learning";
            }}
          >
            Принять и продолжить..
          </button>
        ) : (
          <button className={styles.EndOfTesting} onClick={() => finishTest()}>
            Закончить попытку
          </button>
        )}
      </div>
    </div>
  );
};

export default TestBlock;
