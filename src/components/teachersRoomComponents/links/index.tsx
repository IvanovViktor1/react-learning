import React, { FC, useCallback, useEffect, useState } from "react";
import styles from "./Links.module.scss";
import { useSelector } from "react-redux";
import { SelectLinksData } from "redux/links/selectors";
import { useAppDispatch } from "redux/store";
import { fetchLinks } from "redux/links/asyncActions";
import { LinkType, Status } from "redux/links/types";
import { supabase } from "index";
import { Input } from "antd";
import { Select } from "antd";
import { SelectTopicData } from "redux/topic/selectors";

// @ts-ignore
import debounce from "lodash.debounce";
import { SaveOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { updateLink } from "redux/links/linkSlice";
import { fetchTopics } from "redux/topic/asyncActions";

type StatusUpdate = {
  status: Status;
  id: number;
};

const handleChange = (value: string) => {
  console.log(`selected ${value}`);
};

const Links: FC = () => {
  const [btnSaveVisible, setBtnSaveVisible] = useState(false);
  const [updateStatus, setUpdateStatus] = useState<StatusUpdate>({
    status: Status.SUCCESS,
    id: 90900,
  });
  const { TextArea } = Input;
  const linksDB = useSelector(SelectLinksData);
  const topics = useSelector(SelectTopicData).items;
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchLinks());
    dispatch(fetchTopics());
  }, []);

  const onLinkChange = (link: LinkType) => {
    dispatch(updateLink(link));
    setBtnSaveVisible(true);
  };

  const onLinkSave = async (link: LinkType) => {
    setUpdateStatus({ status: Status.LOADING, id: link.id });
    const { data, error, status } = await supabase
      .from("link")
      .update(link)
      .eq("id", link.id)
      .select();

    if (status === 200) {
      setUpdateStatus({ status: Status.SUCCESS, id: link.id });
    } else {
      setUpdateStatus({ status: Status.ERROR, id: link.id });
    }
    dispatch(fetchLinks());
    setBtnSaveVisible(false);
  };

  async function addNewLink() {
    const { data, error } = await supabase
      .from("link")
      .insert([{ description: "описание", link: "ссылка" }])
      .select();

    dispatch(fetchLinks());
  }

  if (linksDB.status === Status.SUCCESS) {
    return (
      <>
        <p className={styles.btnAddLink} onClick={addNewLink}>
          +
        </p>
        <table className={styles.linksTable}>
          <thead>
            <tr>
              {btnSaveVisible ? <th>{""}</th> : ""}
              <th>№</th>
              <th>Описание</th>
              <th>Ссылка</th>
              <th>Тема</th>
              <th>Тип документа</th>
            </tr>
          </thead>
          <tbody className={styles.tbody}>
            {linksDB.links
              ? linksDB.links.map((link) => (
                  <tr key={link.id}>
                    {updateStatus.id === link.id &&
                    updateStatus.status === Status.LOADING ? (
                      <td>
                        <p className={styles.status}>Загрузка</p>
                      </td>
                    ) : (
                      ""
                    )}

                    {btnSaveVisible ? (
                      <td>
                        <SaveOutlined
                          className={styles.btnSave}
                          onClick={() => {
                            onLinkSave(link);
                          }}
                        />
                      </td>
                    ) : (
                      ""
                    )}

                    <td>{link.id}</td>
                    <td className={styles.inputDescription}>
                      <TextArea
                        id="inputDescription"
                        rows={1}
                        size="small"
                        value={link.description}
                        onChange={(e) => {
                          const newLink = {
                            ...link,
                            description: e.target.value,
                          };
                          onLinkChange(newLink);
                        }}
                      />
                    </td>
                    <td className={styles.inputLink}>
                      <TextArea
                        rows={1}
                        size="small"
                        value={link.link}
                        onChange={(e) => {
                          const newLink = {
                            ...link,
                            link: e.target.value,
                          };
                          onLinkChange(newLink);
                        }}
                      />
                    </td>

                    <td>
                      <Select
                        defaultValue={
                          link.topic_id
                            ? topics?.find((x) => x.id === link.topic_id)?.title
                            : ""
                        }
                        style={{ width: 150 }}
                        onChange={(value) => {
                          const newLink = {
                            ...link,
                            topic_id: Number(value),
                          };
                          onLinkChange(newLink);
                        }}
                        options={topics?.map((item) => {
                          <div key={item.id} />;
                          return { value: item.id, label: item.title };
                        })}
                      />
                    </td>

                    <td>
                      <Select
                        defaultValue={
                          link.link_type_id
                            ? linksDB.types_links?.find(
                                (item) => item.id === link.link_type_id
                              )?.name
                            : "нету"
                        }
                        style={{ width: 250 }}
                        onChange={(value) => {
                          const newLink = {
                            ...link,
                            link_type_id: Number(value),
                          };
                          onLinkChange(newLink);
                        }}
                        options={linksDB.types_links?.map((item) => {
                          <div key={item.id} />;
                          return { value: item.id, label: item.name };
                        })}
                      />
                    </td>
                  </tr>
                ))
              : ""}
          </tbody>
        </table>
      </>
    );
  } else {
    return <div>Загрузка..</div>;
  }
};

export default Links;
