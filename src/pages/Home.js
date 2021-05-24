import '../App.css';
import { useHistory, useParams } from "react-router-dom";
import React, { useRef, useEffect, useCallback, useState, useContext } from 'react'
import httpService from '../services/httpService';
import AuthenticationContext from "../AuthenticationContext";
import InfiniteScroll from 'react-infinite-scroll-component';
import { Link } from "react-router-dom";
import PasswordWithConfirmation from "../components/PasswordWithConfirmation";

import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

function RegisterForm(props) {

  useEffect(() => {
    props.setEmailState("");
    props.setNameState("");
    props.setPasswordState("");
    props.setConfirmPasswordState("");
  },[])

  return (
    <div>
      {
        props.registerSuccessful == 2 ?
        <div>
          Register successful
        </div> :
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

          <PasswordWithConfirmation
            label="Password"
            button="Register"
            clickFunction={props.handleRegister}
            passwordState={props.passwordState}
            setPasswordState={props.setPasswordState}
            confirmPasswordState={props.confirmPasswordState}
            setConfirmPasswordState={props.setConfirmPasswordState}
          />
          <br/>
          <Loader
            style={{display: props.registerSuccessful == 1 ? "flex" : "none"}}
            type="TailSpin"
            color="#000000"
            height={50}
            width={50}
        />
        </div>
      }
    </div>
  )
}

function LoginForm(props) {
  const history = useHistory();
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
      {
        props.emailValidationState == 0 ? 
        <br/> : 
        (
          props.emailValidationState == 1 ? 
          <pre>There is no account registered with this email</pre> :
          <pre>This account is not verified</pre>
        )
      }
    
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
      <button onClick={() => history.push("/forgot_password")}>
        Forgot password?
      </button>
      
    </div>
  )
}

export default function Home() {
  const history = useHistory();
  const authentication = useContext(AuthenticationContext);
  let idAuth = authentication.getUser()
  let idAux = -1;
  //let myId = authentication.getUser();

  const [myId, setMyId] = useState(-1);

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
    
    let URL = "/account/process_register";
    setRegisterSuccessful(1);
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
        if (response.data == "register_success") {
          setEmailValidationState(0);
          setNameValidationState(0);
          setRegisterSuccessful(2);
          setEmailState("");
          setNameState("");
          setPasswordState("");
          setConfirmPasswordState("");
        } else if (response.data == "email_exists") {
          setEmailValidationState(1);
          setRegisterSuccessful(0);
        } else if (response.data == "name_exists") {
          setNameValidationState(1);
          setRegisterSuccessful(0);
        }
      })
      .catch((e) => {
        console.log(e);
        setEmailValidationState(0);
        setNameValidationState(0);
        setRegisterSuccessful(0);
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
          //setMyId(response.data);
          authentication.logIn(response.data);
          let path = "/"
          history.push(path);
        }
      })
      .catch((e) => {
        console.log(e);
        let response = e.response;
        if (response.status == 404) {
          setEmailValidationState(1);
        } else if (response.status == 401) {
          setEmailValidationState(2);
        } else if (response.status == 403) {
          setPasswordValidationState(1);
        }
      })
  }


  /*useEffect(() => {
    if(myId!=-1){
      loadMorePostings();
    }
  },[])*/

  useEffect(() => {
    if(myId!=-1){
      loadMorePostings();
    } else if (myId == -1 && idAuth != -1){
      setMyId(idAuth);
    }
  },[myId])


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