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
        <>
            {
                verifyStatus == "" ?
                <>
                </>:
                verifyStatus == "verify_success" ?
                <div>
                    <h3>Congratulations, your account has been verified.</h3>
                    <button onClick={() => history.push("/")}>Go to login</button>
                </div> :
                <div>
                    <h3>Sorry, we could not verify account. It maybe already verified,or verification code is incorrect.</h3>
                </div>
            }
        </>
    )
}
