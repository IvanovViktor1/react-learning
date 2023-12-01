import { supabase } from "index";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "redux/store";
import { SelectUserData } from "redux/user/selectors";
import { setSessionInfo, userExit } from "redux/user/userSlice";
import Authorization from "./authentication/Authorization";
import { getInfoComponents } from "redux/components/selectors";
import Registration from "./authentication/Registration";
import { setAuthVisible } from "redux/components/componentsSlice";
import { Link } from "react-router-dom";
import { fetchUserInfoFromDB } from "redux/user/asyncActions";
import { SelectTopicData } from "redux/topic/selectors";

export interface userInfoProps {
  user_id: string;
  user_email: string;
}

const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const infoComponents = useSelector(getInfoComponents);

  useEffect(() => {
    async function getSession() {
      const { data, error } = await supabase.auth.getSession();
      const user_id = data.session?.user.id as string;
      const user_email = data.session?.user.email as string;
      const userInfo: userInfoProps = {
        user_id,
        user_email,
      };
      if (user_id && user_email) {
        dispatch(setSessionInfo(userInfo));
        dispatch(fetchUserInfoFromDB(userInfo));
      }
    }
    getSession();
  }, []);

  const user = useSelector(SelectUserData);
  const role = user.databaseInfo?.role_id;

  async function signOut() {
    await supabase.auth.signOut();
    dispatch(userExit());
    document.location.href = "/react-learning";
  }

  return (
    <div className="header">
      <Link to="/react-learning" relative="path">
        <svg
          className="svgHome"
          fill="#000000"
          height="50px"
          width="50px"
          version="1.1"
          id="Layer_1"
          viewBox="0 0 512 512"
        >
          <g>
            <g>
              <path
                d="M480.813,221.945v-42.138H512V95.229h-53.029L255.999,13.103L53.029,95.229H0v84.579h31.187v42.138h15.209V372.18H31.187
			v42.138H0v84.579h512v-84.579h-31.187V372.18h-15.209V221.945H480.813z M255.999,45.916l121.874,49.312H134.127L255.999,45.916z
			 M480.813,444.734h0.77v23.745H30.417v-23.745h0.77H480.813z M379.021,191.529H354.73h-86.584h-24.292H157.27h-24.291H61.604
			v-11.721h388.792v11.721H379.021z M435.187,221.945v150.234h-25.749V221.945H435.187z M379.02,221.945v150.234h-24.291V221.945
			H379.02z M324.313,221.945v150.234h-25.749V221.945H324.313z M243.854,221.945h24.292v150.234h-24.292V221.945z M213.437,221.945
			v150.234h-25.749V221.945H213.437z M157.27,221.945v150.234h-24.291V221.945H157.27z M102.562,221.945v150.234H76.813V221.945
			H102.562z M132.979,402.596h24.291h86.584h24.292h86.584h24.291h71.375v11.721H61.604v-11.721H132.979z M31.187,149.391h-0.77
			v-23.745h451.166v23.745h-0.77H31.187z"
                fill="#ffffff"
              />
            </g>
          </g>
        </svg>
      </Link>

      <div className="header__navigation">
        <ul>
          <li>Search</li>
          <li className="rightSvg">
            {role === 2 ? (
              <Link to="/teachersRoom" relative="path">
                <svg
                  viewBox="0 0 32 32"
                  xmlns="http://www.w3.org/2000/svg"
                  width="30"
                  height="30"
                  fill="#ffffff"
                >
                  <defs></defs>
                  <title />
                  <g data-name="Layer 20" id="Layer_20">
                    <path
                      className="cls-1"
                      d="M16,22a6,6,0,1,1,6-6A6,6,0,0,1,16,22Zm0-10a4,4,0,1,0,4,4A4,4,0,0,0,16,12Z"
                    />
                    <path
                      className="cls-1"
                      d="M21,31H11a4,4,0,0,1-4-4V24.45a1,1,0,0,1,.63-.92l3.64-1.46A1,1,0,1,1,12,23.93l-3,1.2V27a2,2,0,0,0,2,2H21a2,2,0,0,0,2-2V25.13l-3-1.2a1,1,0,0,1,.74-1.86l3.64,1.46a1,1,0,0,1,.63.92V27A4,4,0,0,1,21,31Z"
                    />
                    <path
                      className="cls-1"
                      d="M9,11a5,5,0,1,1,5-5A5,5,0,0,1,9,11ZM9,3a3,3,0,1,0,3,3A3,3,0,0,0,9,3Z"
                    />
                    <path
                      className="cls-1"
                      d="M8,19.39H5a4,4,0,0,1-4-4V13.64a1,1,0,0,1,.63-.93l3.19-1.25A1,1,0,0,1,6.11,12a1,1,0,0,1-.56,1.3L3,14.32v1.07a2,2,0,0,0,2,2H8a1,1,0,0,1,0,2Z"
                    />
                    <path
                      className="cls-1"
                      d="M23,11a5,5,0,1,1,5-5A5,5,0,0,1,23,11Zm0-8a3,3,0,1,0,3,3A3,3,0,0,0,23,3Z"
                    />
                    <path
                      className="cls-1"
                      d="M27,19.39H24a1,1,0,0,1,0-2h3a2,2,0,0,0,2-2V14.32l-2.55-1a1,1,0,0,1-.56-1.3,1,1,0,0,1,1.29-.57l3.19,1.25a1,1,0,0,1,.63.93v1.75A4,4,0,0,1,27,19.39Z"
                    />
                  </g>
                </svg>
              </Link>
            ) : (
              ""
            )}

            <Link to="/account" relative="path">
              <svg height="34px" viewBox="0 0 50 50" width="34px">
                <path
                  clipRule="evenodd"
                  d="M24,45C12.402,45,3,35.598,3,24S12.402,3,24,3s21,9.402,21,21S35.598,45,24,45z   M35.633,39c-0.157-0.231-0.355-0.518-0.514-0.742c-0.277-0.394-0.554-0.788-0.802-1.178C34.305,37.062,32.935,35.224,28,35  c-1.717,0-2.965-1.288-2.968-3.066L25,31c0-0.135-0.016,0.148,0,0v-1l1-1c0.731-0.339,1.66-0.909,2.395-1.464l0.135-0.093  C29.111,27.074,29.923,26.297,30,26l0.036-0.381C30.409,23.696,31,20.198,31,19c0-4.71-2.29-7-7-7c-4.775,0-7,2.224-7,7  c0,1.23,0.591,4.711,0.963,6.616l0.035,0.352c0.063,0.313,0.799,1.054,1.449,1.462l0.098,0.062C20.333,28.043,21.275,28.657,22,29  l1,1v1c0.014,0.138,0-0.146,0,0l-0.033,0.934c0,1.775-1.246,3.064-2.883,3.064c-0.001,0-0.002,0-0.003,0  c-4.956,0.201-6.393,2.077-6.395,2.077c-0.252,0.396-0.528,0.789-0.807,1.184c-0.157,0.224-0.355,0.51-0.513,0.741  c3.217,2.498,7.245,4,11.633,4S32.416,41.498,35.633,39z M24,5C13.507,5,5,13.507,5,24c0,5.386,2.25,10.237,5.85,13.694  C11.232,37.129,11.64,36.565,12,36c0,0,1.67-2.743,8-3c0.645,0,0.967-0.422,0.967-1.066h0.001C20.967,31.413,20.967,31,20.967,31  c0-0.13-0.021-0.247-0.027-0.373c-0.724-0.342-1.564-0.814-2.539-1.494c0,0-2.4-1.476-2.4-3.133c0,0-1-5.116-1-7  c0-4.644,1.986-9,9-9c6.92,0,9,4.356,9,9c0,1.838-1,7-1,7c0,1.611-2.4,3.133-2.4,3.133c-0.955,0.721-1.801,1.202-2.543,1.546  c-0.005,0.109-0.023,0.209-0.023,0.321c0,0-0.001,0.413-0.001,0.934h0.001C27.033,32.578,27.355,33,28,33c6.424,0.288,8,3,8,3  c0.36,0.565,0.767,1.129,1.149,1.694C40.749,34.237,43,29.386,43,24C43,13.507,34.493,5,24,5z"
                  fill="#ffffff"
                />
              </svg>
            </Link>

            <svg
              height="32"
              viewBox="0 0 32 32"
              width="32"
              xmlns="http://www.w3.org/2000/svg"
              onClick={
                user.sessionInfo?.user_email
                  ? () => signOut()
                  : () => dispatch(setAuthVisible(true))
              }
            >
              <title />
              <g data-name="1" id="_1">
                <path
                  d="M27,3V29a1,1,0,0,1-1,1H6a1,1,0,0,1-1-1V27H7v1H25V4H7V7H5V3A1,1,0,0,1,6,2H26A1,1,0,0,1,27,3ZM12.29,20.29l1.42,1.42,5-5a1,1,0,0,0,0-1.42l-5-5-1.42,1.42L15.59,15H5v2H15.59Z"
                  id="login_account_enter_door"
                  fill={user.sessionInfo?.user_email ? "#a3002c" : "#339e3a"}
                />
              </g>
            </svg>
          </li>
        </ul>
      </div>
      <p className="userEmail">{user.databaseInfo?.name}</p>
      {infoComponents.AuthorizationVisible === true ? (
        <div className="authBlock">
          <Authorization />
        </div>
      ) : (
        ""
      )}
      {infoComponents.RegistrationVisible === true ? (
        <div className="authBlock">
          <Registration />
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Header;
