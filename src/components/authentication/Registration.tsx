import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import styles from "./Authentication.module.scss";
import { supabase } from "index";
import { useAppDispatch } from "redux/store";
import { setRegVisible } from "redux/components/componentsSlice";
import { Listbox } from "@headlessui/react";
import { useSelector } from "react-redux";
import { SelectRoleData } from "redux/roles/selectors";
import { SelectGroupsData } from "redux/groups/selectors";
import { setDatabaseInfo, setSessionInfo } from "redux/user/userSlice";
import { fetchUsers } from "redux/user/asyncActions";
import { SelectUserData } from "redux/user/selectors";
import Loader from "components/loader";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import { Button, Modal } from "antd";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const Registration: React.FC = () => {
  const roles = useSelector(SelectRoleData).roles;
  const groups = useSelector(SelectGroupsData).groups;
  const [selectedRole, setSelectedRole] = useState(roles[0]);
  const [selectedGroup, setSelectedGroup] = useState(groups[0]);
  const dispatch = useAppDispatch();
  const [email, setEmail] = React.useState("");
  const [pass, setPass] = React.useState("");
  const [name, setName] = React.useState("");
  const usersFromDB = useSelector(SelectUserData).users;
  const [visibleLoader, setVisibleLoader] = useState(false);
  const [passVisible, setPassVisible] = React.useState(false);
  const group_id = selectedGroup.id;
  const role_id = selectedRole.id;

  async function handleLogin() {
    if (name === null) {
      alert("Пожалуйста введите имя");
    } else {
      dispatch(setDatabaseInfo({ name, group_id, role_id }));
    }

    if (pass === null) {
      alert("Пожалуйста введите пароль");
    } else if (pass.length < 6) {
      alert("Пароль должен быть не менее 6 символов");
    } else {
      dispatch(setDatabaseInfo({ name, group_id, role_id }));
    }

    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: pass,
      options: {
        emailRedirectTo: "/react-learning",
      },
    });
    error
      ? alert(
          (
            await supabase.auth.signUp({
              email: email,
              password: pass,
              options: {
                emailRedirectTo: "/",
              },
            })
          ).error?.message as unknown as object
        )
      : console.log(data);

    const user_id = data.session?.user.id;
    if (user_id) {
      dispatch(setSessionInfo({ user_id, user_email: email }));
      insertNewUser(user_id, group_id, role_id, email);
    }
  }

  async function insertNewUser(
    user_id: string,
    group_id: number,
    role_id: number,
    email: string
  ) {
    try {
      const { data, error } = await supabase
        .from("user_info")
        .insert([
          {
            user_id,
            name: name,
            group_id,
            role_id,
            email,
          },
        ])
        .select();

      dispatch(fetchUsers());
      if (data) {
        document.location.href = "/react-learning";
      }
    } catch (error) {
      console.log(error);
    }
  }
  const [isModalOpen, setIsModalOpen] = useState(true);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    handleLogin();
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Modal
        title="Регистрация"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        className={styles.bblock}
      >
        <div className={styles.block}>
          {/* {visibleLoader ? <Loader /> : ""} */}
          <div className={styles.table}>
            <ul>
              <li>
                Введите почту
                <input
                  type="email"
                  onChange={(e) => setEmail(e.target.value)}
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
                  <div className={styles.checkboxForRegistration}>
                    {passVisible ? (
                      <EyeInvisibleOutlined
                        onClick={() => setPassVisible(!passVisible)}
                      />
                    ) : (
                      <EyeOutlined
                        onClick={() => setPassVisible(!passVisible)}
                      />
                    )}
                  </div>
                </div>
              </li>

              <li>
                Имя{" "}
                <input type="text" onChange={(e) => setName(e.target.value)} />
              </li>

              {role_id === 1 ? (
                groups ? (
                  <Listbox value={selectedGroup} onChange={setSelectedGroup}>
                    <li>
                      Группа
                      <Listbox.Button className={styles.listboxButton}>
                        {selectedGroup.name ? selectedGroup.name : ""}
                      </Listbox.Button>
                    </li>

                    <Listbox.Options className={styles.listboxOptions}>
                      {groups.map((group) => (
                        <Listbox.Option
                          className={
                            group.name === selectedGroup.name
                              ? styles.listboxOptionActive
                              : styles.listboxOption
                          }
                          key={group.id}
                          value={group}
                        >
                          {group.name}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Listbox>
                ) : (
                  ""
                )
              ) : (
                ""
              )}

              {roles ? (
                <Listbox value={selectedRole} onChange={setSelectedRole}>
                  <li>
                    Роль
                    <Listbox.Button className={styles.listboxButton}>
                      {selectedRole.name ? selectedRole.name : ""}
                    </Listbox.Button>
                  </li>

                  <Listbox.Options className={styles.listboxOptions}>
                    {roles.map((role) => (
                      <Listbox.Option
                        className={
                          role.name === selectedRole.name
                            ? styles.listboxOptionActive
                            : styles.listboxOption
                        }
                        key={role.id}
                        value={role}
                      >
                        {role.name}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Listbox>
              ) : (
                ""
              )}
            </ul>
          </div>
          {/* <button className={styles.handleLogin} onClick={handleLogin}>
            Зарегистрироваться
          </button> */}
        </div>
      </Modal>
    </>
  );
};

export default Registration;
