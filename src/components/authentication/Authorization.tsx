import { supabase } from "index";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import styles from "./Authentication.module.scss";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch } from "redux/store";
import { SelectUserData } from "redux/user/selectors";
import { getInfoComponents } from "redux/components/selectors";
import {
  setAuthVisible,
  setRegVisible,
} from "redux/components/componentsSlice";
import { setSessionInfo } from "redux/user/userSlice";
import Checkbox from "@mui/material/Checkbox";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import { Modal } from "antd";

const Authorization = () => {
  const dispatch = useAppDispatch();
  const infoComponents = useSelector(getInfoComponents);
  const [email, setEmail] = React.useState("");
  const [password, setPass] = React.useState("");
  const history = useNavigate();
  const [passVisible, setPassVisible] = React.useState(false);
  async function logIn() {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    const user_id = data.session?.user.id;
    if (user_id) {
      dispatch(
        setSessionInfo({
          user_id,
          user_email: email,
        })
      );
    }

    if (error) {
      alert(error.message);
    }
    dispatch(setAuthVisible(false));
    document.location.href = "/react-learning";
  }

  const setUser = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const goToReg = () => {
    dispatch(setAuthVisible(false));
    dispatch(setRegVisible(true));
  };
  return (
    <Modal
      title="Требуется авторизация"
      open={true}
      onOk={logIn}
      // onCancel={handleCancel}
      className={styles.bblock}
    >
      <div className={styles.block}>
        <div className={styles.table}>
          <ul>
            <li>
              Введите почту
              <input
                type="email"
                onChange={(e) => setUser(e)}
                placeholder="email"
              />
            </li>
            <li>
              Введите пароль
              <div className={styles.pass}>
                <input
                  type={passVisible ? "text" : "password"}
                  onChange={(e) => setPass(e.target.value)}
                  placeholder="password"
                />
                <div className={styles.checkbox}>
                  {passVisible ? (
                    <EyeInvisibleOutlined
                      onClick={() => setPassVisible(!passVisible)}
                    />
                  ) : (
                    <EyeOutlined onClick={() => setPassVisible(!passVisible)} />
                  )}
                </div>
              </div>
            </li>
          </ul>
        </div>

        <div className={styles.bottom}>
          <p onClick={goToReg}>нет учетной записи?</p>
        </div>
      </div>
    </Modal>
  );
};

export default Authorization;
