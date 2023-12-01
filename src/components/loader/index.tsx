import React from "react";
import LinearProgress from "@mui/joy/LinearProgress";
import styles from "./Loader.module.scss";

const Loader = () => {
  return (
    <>
      <div className={styles.loader}>
        <h2>ожидается ответ от сервера...</h2>
        <LinearProgress
          color="success"
          determinate={false}
          size="lg"
          value={31}
          variant="plain"
        />
      </div>
    </>
  );
};

export default Loader;
