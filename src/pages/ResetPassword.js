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
    const [passwordChanged, setPasswordChanged] = useState(0);
    useEffect(() => {
        let URL = "account/verify_reset/" + params.code;
        httpService
            .get(URL)
            .then((response) => {
                console.log(response.data);
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
            .then((response) => {
                console.log(response.data);
                //history.push("/");
                setPasswordChanged(1);
            })
            .catch((e) => {
                console.log(e);
              })
    }

    return (
        <div 
            className="myColumnSimple border border-info border-1 rounded" 
            style={{
                background:"rgba(255, 255, 255, 0.85)",
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems:"center",
                width : '40vw',
                height:"92vh",
                padding: "4px",
                overflowX:"hidden",
                overflowY:"scroll"
            }}
        >
            <h4 className="fw-light">Reset Password</h4>
            <hr></hr>
            {
                verifyStatus == "" ?
                <></> :
                verifyStatus == "verify_success" ?
                (
                    passwordChanged == 1 ?
                    <div>
                        <h3 className="fw-light">Password has bees reset.</h3>
                        <button className="btn btn-outline-success" onClick={() => history.push("/")}>Go back to login</button>
                    </div> :
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
                ):
                <h3 className="fw-light">The code provided for reset may be incorrect or already used</h3>
            }
        </div>
    )
}