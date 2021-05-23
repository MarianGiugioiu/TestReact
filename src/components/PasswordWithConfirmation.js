import React, { useRef, useEffect, useCallback, useState, useContext } from 'react';
import '../App.css';

export default function PasswordWithConfirmation(props) {
    const [passwordRequirements, setPasswordRequirements] = useState(false);

  function checkPassword(str) {
    if (str.length < 6) {
        return("Password has less than 6 characters!");
    } else if (str.length > 20) {
        return("Password has more than 20 characters!");
    } else if (str.search(/\d/) == -1) {
        return("Password has no digit!");
    } else if (str.search(/[a-z]/) == -1) {
        return("PassWord has no lowercase letter!");
    } else if (str.search(/[A-Z]/) == -1) {
      return("PassWord has no capital letter!");
    } else if (str.search(/[^a-zA-Z0-9\!\@\#\$\%\^\&\*\(\)\_\+]/) != -1) {
        return("Password contains an invalid character!");
    }
    return("ok");
  }

  function checkInfo() {
    if (checkPassword(props.passwordState) && props.passwordState == props.confirmPasswordState){
      return true;
    }
    return false;
  }
    return (
        <>
            <label>{props.label}</label>
            <input 
                type="password"
                value={props.passwordState}
                onChange={(event) => props.setPasswordState(event.target.value)}
                onFocus={() => setPasswordRequirements(true)}
                onBlur={() => setPasswordRequirements(false)}
            />
            {
                props.passwordState != "" ?
                (checkPassword(props.passwordState) != "ok" ?
                <pre>{checkPassword(props.passwordState)}</pre> :
                (
                props.passwordState != props.confirmPasswordState ?
                <pre>Password and confirmation must be equal</pre> :
                <br/>
                ))
                :<br/>
            }
            {
                passwordRequirements ? 
                <div>
                <p>Password:</p>
                <p>-must have between 6 and 20 characters</p>
                <p>-must contain at least one digit</p>
                <p>-must contain at least one lowercase letter</p>
                <p>-must contain at least one capital letter</p>
                <p>can contain one of the following symbols: !@#$%^&*()_+</p>
                </div> :
                <></>
            }

            <label>Confirm Password</label>
            <input 
                type="password"
                value={props.confirmPasswordState}
                onChange={(event) => props.setConfirmPasswordState(event.target.value)}
            />
            <br/>
            <hr></hr>
            <button onClick={checkInfo() ? props.clickFunction : null}>
                {props.button}
            </button>
        </>
    )
}