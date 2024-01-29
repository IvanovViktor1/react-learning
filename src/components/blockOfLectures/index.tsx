import React, { FC, useEffect, useState } from "react";
import styles from "./BlockOfLectures.module.scss";
import DocViewer, {
  DocViewerRenderers,
  IDocument,
} from "@cyntler/react-doc-viewer";
import List from "@mui/material/List";
import Topics from "components/topics";
import { fetchLinks } from "redux/links/asyncActions";
import { useAppDispatch } from "redux/store";
import { useSelector } from "react-redux";
import { SelectLinksData } from "redux/links/selectors";
import { SelectTopicData } from "redux/topic/selectors";
import { Menu, MenuProps } from "antd";
import { AppstoreOutlined } from "@ant-design/icons";
import { current } from "@reduxjs/toolkit";
import Item from "antd/es/list/Item";
import Ncomponent from "components/newComponent";
import Super from "components/newComponent/SuperButton";

const BlockOfLectures: FC = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchLinks());
  }, []);

  const currentTopic = useSelector(SelectTopicData).selectedCurrent;
  const links = useSelector(SelectLinksData).links;

  const [selectedLink, setSelectedLink] = useState<IDocument[]>();

  const currentLinks = links?.filter(
    (link) => link.topic_id === currentTopic && link.link_type_id === 1
  );

  const linkItems: MenuProps["items"] = currentLinks
    ? currentLinks.map((link) => ({
        label: link.description,
        key: link.id,
        icon: <AppstoreOutlined />,
      }))
    : undefined;

  const onClick: MenuProps["onClick"] = (e) => {
    const findDoc: IDocument = {
      uri: links?.find((link) => link.id === Number(e.key))?.link as string,
    };
    if (findDoc) {
      setSelectedLink([findDoc, findDoc]);
    }
  };

  return (
    <>
      <Topics />

      <Menu
        style={{ fontSize: "10px", color: "blue" }}
        onClick={onClick}
        mode="horizontal"
        items={linkItems}
      />

      {/* <Super text={"This is the component text"} /> */}

      <List>
        <div className={styles.pageBlock}>
          <div className={styles.content}>
            {selectedLink ? (
              <DocViewer
                documents={selectedLink}
                activeDocument={selectedLink[0]}
                pluginRenderers={DocViewerRenderers}
              />
            ) : (
              <div className={styles.selectedLinkNull}>Выберите лекцию..</div>
            )}
          </div>
        </div>
      </List>
    </>
  );
};

export default BlockOfLectures;
