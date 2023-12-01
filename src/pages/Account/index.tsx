import React, { Fragment, useEffect, useState } from "react";
import styles from "./Account.module.scss";
import Header from "components/Header";
import { useSelector } from "react-redux";
import { SelectUserData } from "redux/user/selectors";
import { SelectRoleData } from "redux/roles/selectors";
import { Listbox } from "@headlessui/react";

const Account = () => {
  const roles = useSelector(SelectRoleData).roles;
  const [selectedRole, setSelectedRole] = useState(roles[0]);
  const databaseInfo = useSelector(SelectUserData).databaseInfo;
  const sessionInfo = useSelector(SelectUserData).sessionInfo;

  const name = databaseInfo?.name;
  const email = sessionInfo?.user_email;

  return (
    <div className={styles.page}>
      <Header />

      <div className={styles.table}>
        <img
          className={styles.photo}
          src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
          alt=""
        />
        <ul>
          <li>
            Имя <input value={name ? name : ""} />
          </li>
          <li>
            Email <input value={email ? email : ""} />
          </li>

          <li className={styles.btnSave}>Сохранить</li>
        </ul>
      </div>
    </div>
  );
};

export default Account;
