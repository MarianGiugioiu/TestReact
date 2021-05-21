import '../App.css';
import { useHistory, useParams } from "react-router-dom";
import React, { useRef, useEffect, useCallback, useState, useContext } from 'react'
import httpService from '../services/httpService';
import AuthenticationContext from "../AuthenticationContext";
import InfiniteScroll from 'react-infinite-scroll-component';
import { Link } from "react-router-dom";

function RegisterForm(props) {
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

  useEffect(() => {
    props.setEmailState("");
    props.setNameState("");
    props.setPasswordState("");
    props.setConfirmPasswordState("");
  },[])

  return (
    <div>
      {
        props.registerSuccessful == 0 ?
        <div className="myColumnSimple">
          <label>Email</label>
          <input 
            type="text"
            value={props.emailState}
            onChange={(event) => {
              props.setEmailState(event.target.value); 
              if(props.emailValidationState == 1) {
                props.setEmailValidationState(0);
              }
            }}
          />
          {props.emailValidationState == 1 ? <pre>An account is already registered with this email</pre> : <br/>}

          <label>Name</label>
          <input 
            type="text"
            value={props.nameState}
            onChange={(event) => {
              props.setNameState(event.target.value);
              if(props.nameValidationState == 1) {
                props.setNameValidationState(0);
              }
            }}
          />
          {props.nameValidationState == 1 ? <pre>An account is already registered with this name</pre> : <br/>}

          <label>Password</label>
          <input 
            type="password"
            value={props.passwordState}
            onChange={(event) => props.setPasswordState(event.target.value)}
            onFocus={(event) => setPasswordRequirements(true)}
            onBlur={(event) => setPasswordRequirements(false)}
          />
          {
            //props.passwordState != "" ?
            (checkPassword(props.passwordState) != "ok" ?
            <pre>{checkPassword(props.passwordState)}</pre> :
            (
              props.passwordState != props.confirmPasswordState ?
              <pre>Password and confirmation must be equal</pre> :
              <br/>
            ))
            //:<br/>
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
          <button onClick={checkInfo() ? props.handleRegister : null}>
            Register
          </button>
        </div> :
        <div>
          Register successful
        </div>
      }
    </div>
  )
}

function LoginForm(props) {
  useEffect(() => {
    props.setEmailState("");
    props.setPasswordState("");
  },[])
  return (
    <div className="myColumnSimple">
      <label>Email</label>
      <input 
        type="text"
        value={props.emailState}
        onChange={(event) => {
          props.setEmailState(event.target.value); 
          if(props.emailValidationState == 1) {
            props.setEmailValidationState(0);
          }
        }}
      />
      {props.emailValidationState == 1 ? <pre>There is no account registered with this email</pre> : <br/>}
    
      <label>Password</label>
      <input 
        type="password"
        value={props.passwordState}
        onChange={(event) => {
          props.setPasswordState(event.target.value);
          if(props.passwordValidationState == 1) {
            props.setPasswordValidationState(0);
          }
        }}
      />
      {props.passwordValidationState == 1 ? <pre>The password is incorrect</pre> : <br/>}

      <br/>
      <hr></hr>
      <button onClick={props.handleLogin}>
        Login
      </button>
      
    </div>
  )
}

export default function Home() {
  const history = useHistory();
  const authentication = useContext(AuthenticationContext);
  //let myId = authentication.getUser();
  const [myId, setMyId] = useState(authentication.getUser());

  const [nameSearchState, setNameSearchState] = useState("");
  const [userIdState, setUserIdState] = useState("");
  const [postingListState, setPostingListState] = useState([]);

  const [isLoginState, setIsLoginState] = useState(true);  

  const [emailState, setEmailState] = useState("");
  const [nameState, setNameState] = useState("");
  const [passwordState, setPasswordState] = useState("");
  const [confirmPasswordState, setConfirmPasswordState] = useState("");

  const [emailValidationState, setEmailValidationState] = useState(0);
  const [nameValidationState, setNameValidationState] = useState(0);
  const [passwordValidationState, setPasswordValidationState] = useState(0);

  const [registerSuccessful, setRegisterSuccessful] = useState(0);

  function handleChange(event){
    const { name, value } = event.target;
    setNameSearchState(value);
  }
  function handleClick(){
    const URL = "/profile/name/" + nameSearchState;
    //console.log(URL);
    httpService
      .get(URL)
      .then((response) => {
        var data = response.data; 
        console.log(data);
        let path = "/profile/"+data;
        console.log(path);
        history.push(path);
      });
  }

  const loadMorePostings = () => 
    httpService
      .get("/profile/" + myId + "/unseen")
      .then((response) => {
        let data = response.data;
        console.log(data);
        let postingListCopy = JSON.parse(JSON.stringify(postingListState));
        //postingListCopy.concat(data);
        data.map((elem) => {
          postingListCopy.push(elem);
          
        });
        //console.log(postingListCopy);
        //saveSeen(data);
        setPostingListState(postingListCopy);
      })

  function goToPost(id) {
    let path = "/posting/" + id;
    history.push(path);
  }

  function handleRegister() {
    console.log("aqw");
    let emailURL = "/account/exists/email/" + emailState;
    let nameURL = "/profile/exists/name/" + nameState;
    httpService
      .get(emailURL)
      .then((response) => {
        console.log(response.data)
        if (response.data) {
          setEmailValidationState(1);
        } else {
          setEmailValidationState(2);
        }
      })
      .catch((e) => {
          console.log(e);
        })

      httpService
      .get(nameURL)
      .then((response) => {
        console.log(response.data)
        if (response.data) {
          setNameValidationState(1);
        } else {
          setNameValidationState(2);
        }
      })
      .catch((e) => {
          console.log(e);
        })
  }

  function handleLogin(){
    let URL = "/account/login";
    let account = {
      "email": emailState,
      "password": passwordState
    }
    console.log(account);
    httpService
      .post(URL, account)
      .then((response) => {
        console.log(response);
        if (response.status == 200) {
          setPasswordValidationState(0);
          setEmailValidationState(0);
          authentication.logIn(response.data);
          console.log(response.data);
          setMyId(response.data);
        }
      })
      .catch((e) => {
        console.log(e);
        let response = e.response;
        if (response.status == 404) {
          setEmailValidationState(1);
        } else if (response.status == 403) {
          setPasswordValidationState(1);
        }
      })
  }

  useEffect(() => {
    if(emailValidationState == 2 && nameValidationState == 2) {
      let URL = "/account";
      let account = {
        "account": {
          "id": 0,
          "email": emailState,
          "password": passwordState
        },
        "name": nameState
      }
      httpService
        .post(URL, account)
        .then((response) => {
          console.log(response.data);
          setEmailValidationState(0);
          setNameValidationState(0);
          setRegisterSuccessful(1);
          setEmailState("");
          setNameState("");
          setPasswordState("");
          setConfirmPasswordState("");
        })
        .catch((e) => {
          console.log(e);
        })
    }
  },[emailValidationState,nameValidationState])

  /*useEffect(() => {
    if(myId!=-1){
      loadMorePostings();
    }
  },[])*/

  useEffect(() => {
    if(myId!=-1){
      loadMorePostings();
    }
  },[myId])

  useEffect(() => {
    console.log(registerSuccessful)
  },[registerSuccessful])

  function HomePage(){
    if(myId==-1){
      return (
        <div className="myColumnSimple">
          <h3>{isLoginState ? "Login" : "Register"}</h3>
          <div className="myRowSimple">
            <button onClick={event => !isLoginState ? setIsLoginState(true) : null}>
              Login
            </button>
            <button onClick={event => {
                if (isLoginState) {
                  setIsLoginState(false)
                }
                setRegisterSuccessful(0);
              }}>
              Register
            </button>
          </div>
          <hr/>
          {
            isLoginState ? 
            <LoginForm 
              emailState={emailState}
              setEmailState={setEmailState}
              emailValidationState={emailValidationState}
              setEmailValidationState={setEmailValidationState}
              passwordState={passwordState}
              setPasswordState={setPasswordState}
              passwordValidationState={passwordValidationState}
              setPasswordValidationState={setPasswordValidationState}
              handleLogin={handleLogin}
            /> :
            <RegisterForm 
              emailState={emailState}
              setEmailState={setEmailState}
              emailValidationState={emailValidationState}
              setEmailValidationState={setEmailValidationState}
              nameState={nameState}
              setNameState={setNameState}
              nameValidationState={nameValidationState}
              setNameValidationState={setNameValidationState}
              passwordState={passwordState}
              setPasswordState={setPasswordState}
              confirmPasswordState={confirmPasswordState}
              setConfirmPasswordState={setConfirmPasswordState}
              handleRegister={handleRegister}
              registerSuccessful={registerSuccessful}
            />
          }
        </div>
      )
    } else {
      return (
        <div>
          
          <label>Enter Name:</label>
          <input
            type="text"
            placeholder="Enter Name"
            name="Name"
            value={nameSearchState}
            onChange={handleChange}
          />
          <button
            onClick={handleClick}
          >
            Search
          </button>

          <div>
          <InfiniteScroll
            dataLength={postingListState.length}
            next={loadMorePostings}
            hasMore={true}
            loader={<h4>Loading...</h4>}
            height={300}
            endMessage={
              <p style={{ textAlign: 'center' }}>
                <b>Yay! You have seen it all</b>
              </p>
            }
          >
            {postingListState.map((object, index) => (
              <div key={index}>
                <div className="myRowSimple">
                  <pre>{object.name}   Created by: </pre>
                  <Link to={"/profile/" + object.idCreator}>
                    <pre>{object.creator}</pre>
                  </Link>
                </div>
                
                <img src={object.image} width="150" height="150" onClick={() => goToPost(object.id)}></img>
                <pre>Likes: {object.likes}  Dislikes: {object.dislikes}</pre>
                <hr></hr>
              </div>
            ))}
          </InfiniteScroll>
          </div>
        </div>
      );
    }
  }

  return (
    HomePage()
  );
}