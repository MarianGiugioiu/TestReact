import '../App.css';
import { useHistory, useParams } from "react-router-dom";
import React, { useRef, useEffect, useCallback, useState, useContext } from 'react';
import httpService from '../services/httpService';
import PasswordWithConfirmation from "../components/PasswordWithConfirmation";

import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

export default function ResetPassword(props) {
    const params = useParams();
    const history = useHistory();

    const [passwordState, setPasswordState] = useState("");
    const [confirmPasswordState, setConfirmPasswordState] = useState("");
    const [verifyStatus, setVerifyStatus] = useState("");
    useEffect(() => {
        let URL = "account/verify_reset/" + params.code;
        httpService
            .get(URL)
            .then((response) => {
                setVerifyStatus(response.data);
            })
            .catch((e) => {
                console.log(e);
              })
    },[])

    function handleChangePassword() {
        let URL = "/account/reset_password/" + params.code;
        let password = {
            "password": passwordState
        }
        console.log(password);
        httpService
            .put(URL,password)
            .then(() => {
                history.push("/");
            })
            .catch((e) => {
                console.log(e);
              })
    }

    return (
        <>
            {
                verifyStatus == "" ?
                <></> :
                <div>
                    <PasswordWithConfirmation
                        label="New Password"
                        button="Change Password"
                        clickFunction={handleChangePassword}
                        passwordState={passwordState}
                        setPasswordState={setPasswordState}
                        confirmPasswordState={confirmPasswordState}
                        setConfirmPasswordState={setConfirmPasswordState}

                    />
                </div>
            }
        </>
    )
}