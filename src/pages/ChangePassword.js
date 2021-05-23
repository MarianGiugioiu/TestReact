import '../App.css';
import { useHistory, useParams } from "react-router-dom";
import React, { useRef, useEffect, useCallback, useState, useContext } from 'react';
import httpService from '../services/httpService';
import AuthenticationContext from "../AuthenticationContext";
import PasswordWithConfirmation from "../components/PasswordWithConfirmation";

import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

export default function ChangePassword(props) {
    const params = useParams();
    const history = useHistory();
    const authentication = useContext(AuthenticationContext);
    let idAuth = authentication.getUser();

    const [accountIdState, setAccountIdState] = useState(-1);
    const [passwordState, setPasswordState] = useState("");
    const [newPasswordState, setNewPasswordState] = useState("");
    const [confirmPasswordState, setConfirmPasswordState] = useState("");
    const [passwordValidationState, setPasswordValidationState] = useState(0);
    const [loadingAccountState, setLoadingAccountState] = useState(0);

    function handleChangePassword() {
        let URL = "/account/change_password";
        let password = {
            "id": accountIdState,
            "password": passwordState,
            "newPassword": newPasswordState
        }
        console.log(password);
        httpService
            .put(URL,password)
            .then((response) => {
                if (response.status == 200) {
                    setPasswordValidationState(0);
                    history.push("/settings");
                }
            })
            .catch((e) => {
                console.log(e);
                let response = e.response;
                if (response.status == 403) {
                    setPasswordValidationState(1);
                }
              })
    }

    useEffect(() =>{
        if (idAuth != -1){
            setLoadingAccountState(1);
            let URL = "/profile/" + idAuth;
            httpService
                .get(URL)
                .then((response) => {
                    console.log(response.data);
                    setAccountIdState(response.data.account.id);
                    setLoadingAccountState(0);
                })
                .catch((e) => {
                    console.log(e);
                  })
        }
    }, [])

    return (
        <>
            {
                idAuth == -1 ?
                <></> :
                <div>
                    <Loader
                        style={{display: loadingAccountState == 1 ? "flex" : "none"}}
                        type="TailSpin"
                        color="#000000"
                        height={100}
                        width={100}
                    />
                    <div style = {{visibility:(loadingAccountState == 1 ? "hidden" : "visible")}}>
                        <label>Password</label>
                        <input 
                            type="password"
                            value={passwordState}
                            onChange={(event) => {
                                setPasswordState(event.target.value);
                                if(passwordValidationState == 1) {
                                    setPasswordValidationState(0);
                                }
                            }}
                        />
                        {passwordValidationState == 1 ? <pre>The password is incorrect</pre> : <br/>}
                        <PasswordWithConfirmation
                            label="New Password"
                            button="Change Password"
                            clickFunction={handleChangePassword}
                            passwordState={newPasswordState}
                            setPasswordState={setNewPasswordState}
                            confirmPasswordState={confirmPasswordState}
                            setConfirmPasswordState={setConfirmPasswordState}

                        />
                    </div>
                </div>
            }
        </>
    )
}