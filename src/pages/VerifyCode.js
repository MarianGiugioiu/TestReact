import '../App.css';
import { useHistory, useParams } from "react-router-dom";
import React, { useRef, useEffect, useCallback, useState, useContext } from 'react';
import httpService from '../services/httpService';

export default function VerifyCode(props) {
    const params = useParams();
    const history = useHistory();

    const [verifyStatus, setVerifyStatus] = useState("");
    useEffect(() => {
        let URL = "account/verify/" + params.code;
        httpService
            .get(URL)
            .then((response) => {
                setVerifyStatus(response.data);
            })
    },[])
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
            {
                verifyStatus == "" ?
                <>
                </>:
                <div>
                    {
                        verifyStatus == "verify_success" ?
                        <h3 className="fw-light">Congratulations, your account has been verified.</h3> :
                        <h3 className="fw-light">Sorry, we could not verify account. It maybe already verified,or verification code is incorrect.</h3>
                    }
                    <button className="btn btn-outline-success" onClick={() => history.push("/")}>Go back to login</button>
                </div>
            }
        </div>
    )
}
