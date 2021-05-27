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
                padding: "4px"
            }}
        >
            <h4 className="fw-light">Forgot Password</h4>
            <hr></hr>
            {
                emailSent == 2 ?
                <div>
                    <h3 className="fw-light">Mail successfully sent. Check your email in order to reset your password.</h3>
                    <button className="btn btn-outline-success" onClick={() => history.push("/")}>Go back to login</button>
                </div> :
                (
                    <div style={{display:'flex',flexDirection: 'column' , alignItems: 'center'}}>
                        <label className="form-label">Email</label>
                        <input 
                            type="text"
                            className="form-control"
                            style={{width:"35vw"}}
                            placeholder="email@example.com"
                            value={emailState}
                            onChange={(event) => {
                            setEmailState(event.target.value); 
                            if(emailValidationState == 1) {
                                setEmailValidationState(0);
                            }
                            }}
                        />
                        {emailValidationState == 1 ? <pre className="text-danger">There is no account registered with this email</pre> : <br/>}
                        
                        <button className="btn btn-outline-success mb-1 mx-5" onClick={handleReset}>ResetPassword</button>
                        <div style={{display:'flex',flexDirection: 'column' , alignItems: 'center'}}>
                            <Loader
                                style={{display: emailSent == 1 ? "flex" : "none"}}
                                type="TailSpin"
                                color="#000000"
                                height={50}
                                width={50}
                            />
                        </div>
                    </div>
                )
            }
        </div>
    )
}