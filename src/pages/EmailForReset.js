import '../App.css';
import { useHistory, useParams } from "react-router-dom";
import React, { useRef, useEffect, useCallback, useState, useContext } from 'react';
import httpService from '../services/httpService';

import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

export default function EmailForReset(props) {
    const history = useHistory();
    const [emailState, setEmailState] = useState("");
    const [emailValidationState, setEmailValidationState] = useState(0);
    const [emailSent, setEmailSent] = useState(0);

    function handleReset() {
        let URL = "/account/process_reset_password";
        setEmailSent(1);
        let email = {
            "email": emailState
        }
        httpService
            .post(URL, email)
            .then(() => {
                setEmailSent(2);
            })
            .catch((e) => {
                console.log(e);
                setEmailSent(0);
                let response = e.response;
                if (response.status == 404) {
                    setEmailValidationState(1);
                }
              })
    }

    return (
        <>
            {
                emailSent == 2 ?
                <div>
                    <h3>Mail successfully sent. Check your email in order to reset your password.</h3>
                    <button onClick={() => history.push("/")}>Go back to login</button>
                </div> :
                (
                    <div>
                        <label>Email</label>
                        <input 
                            type="text"
                            value={emailState}
                            onChange={(event) => {
                            setEmailState(event.target.value); 
                            if(emailValidationState == 1) {
                                setEmailValidationState(0);
                            }
                            }}
                        />
                        {emailValidationState == 1 ? <pre>There is no account registered with this email</pre> : <br/>}
                        <br/>
                        <button onClick={handleReset}>
                            ResetPassword
                        </button>
                        <br/>
                        <Loader
                            style={{display: emailSent == 1 ? "flex" : "none"}}
                            type="TailSpin"
                            color="#000000"
                            height={50}
                            width={50}
                        />
                    </div>
                )
            }
        </>
    )
}