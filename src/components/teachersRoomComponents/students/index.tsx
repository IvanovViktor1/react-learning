import { Select } from "antd";
import useSelection from "antd/es/table/hooks/useSelection";
import Loader from "components/loader";
import React from "react";
import { useSelector } from "react-redux";
import { SelectGroupsData } from "redux/groups/selectors";
import { SelectUserData } from "redux/user/selectors";
import styles from "./Students.module.scss";
import { SelectAllResultData } from "redux/results/selectors";
import { supabase } from "index";

const Students = () => {
  const groups = useSelector(SelectGroupsData).groups;

  const students = useSelector(SelectUserData).users?.filter(
    (user) => user.role_id === 1
  );

  const results = useSelector(SelectAllResultData);

  const studentResults = (user_id: string) => {
    const resById = results?.filter((result) => result.user_id === user_id);
    const scores = resById?.map((res) => res.score);
    const length = resById?.length;

    let sumResult = scores?.reduce((sum, current) => sum + current, 0);
    if (length && sumResult) {
      let result = Math.round(sumResult / length);
      return result;
    }
  };

  const getGroup = (group_id: number) => {
    return groups.find((g) => g.id === group_id)?.name;
  };

  return (
    <div className={styles.table}>
      <table>
        <thead>
          <tr>
            <th>Имя</th>
            <th>Группа</th>
            {/* <th>Email</th> */}
            <th>Средний балл</th>
          </tr>
        </thead>
        <tbody>
          {students?.map((student) => (
            <tr>
              <td>{student.name}</td>
              <td>
                {student.group_id ? getGroup(student.group_id) : "нет данных"}
              </td>
              {/* <td>qwrq@aas.fs</td> */}
              <td>{studentResults(student.user_id)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Students;
