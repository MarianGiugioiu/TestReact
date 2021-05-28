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
    <div style={{overflowX:"hidden",overflowY:"scroll"}}>
      {
        props.registerSuccessful == 2 ?
        <div style={{display:"flex",alignItems:"center", justifyContent:"center", overflow:"hidden"}}>
          <h4 className="fw-light">Register successful</h4>
        </div> :
        <div className="myColumnSimple">
          <div style={{display:'flex',flexDirection: 'column' , alignItems: 'center'}}>
            <label className="form-label">Email</label>
            <input 
              type="text"
              className="form-control"
              style={{width:"100%"}}
              placeholder="email@example.com"
              value={props.emailState}
              onChange={(event) => {
                props.setEmailState(event.target.value); 
                if(props.emailValidationState == 1) {
                  props.setEmailValidationState(0);
                }
              }}
            />
            {props.emailState.length < 6 || props.emailState.length > 30 ? <pre className="text-danger">Email must have length between 6 and 30 characters!</pre> : <></>}
            {props.emailValidationState == 1 ? <pre className="text-danger">An account is already registered with this email!</pre> : <></>}
          </div>
          <div style={{display:'flex',flexDirection: 'column' , alignItems: 'center'}}>
            <label className="form-label">Name</label>
            <input 
              type="text"
              className="form-control"
              style={{width:"100%"}}
              placeholder="Example"
              value={props.nameState}
              onChange={(event) => {
                props.setNameState(event.target.value);
                if(props.nameValidationState == 1) {
                  props.setNameValidationState(0);
                }
              }}
            />
            {props.nameState.length < 6 || props.nameState.length > 20 ? <pre className="text-danger">Name must have length between 6 and 20 characters!</pre> : <></>}
            {props.nameValidationState == 1 ? <pre className="text-danger">An account is already registered with this name!</pre> : <></>}
          </div>
          <PasswordWithConfirmation
            label="Password"
            button="Register"
            emailState={props.emailState}
            nameState={props.nameState}
            clickFunction={props.handleRegister}
            passwordState={props.passwordState}
            setPasswordState={props.setPasswordState}
            confirmPasswordState={props.confirmPasswordState}
            setConfirmPasswordState={props.setConfirmPasswordState}
          />
          <div style={{display:'flex',flexDirection: 'column' , alignItems: 'center'}}>
            <Loader
              style={{display: props.registerSuccessful == 1 ? "flex" : "none"}}
              type="TailSpin"
              color="#000000"
              height={50}
              width={50}
            />
          </div>
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
      <div style={{display:'flex',flexDirection: 'column' , alignItems: 'center'}}>
        <label className="form-label">Email</label>
        <input 
          className="form-control"
          style={{width:"100%"}}
          placeholder="email@example.com"
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
            <pre  className="text-danger">There is no account registered with this email!</pre> :
            <pre  className="text-danger">This account is not verified!</pre>
          )
        }
      </div>
      <div style={{display:'flex',flexDirection: 'column' , alignItems: 'center'}}>
        <label className="form-label">Password</label>
        <input 
          className="form-control"
          style={{width:"100%"}}
          type="password"
          value={props.passwordState}
          placeholder="123aD@"
          onChange={(event) => {
            props.setPasswordState(event.target.value);
            if(props.passwordValidationState == 1) {
              props.setPasswordValidationState(0);
            }
          }}
        />
        {props.passwordValidationState == 1 ? <pre  className="text-danger">The password is incorrect!</pre> : <br/>}
      </div>

      <hr></hr>
      <button onClick={props.handleLogin} className="btn btn-outline-success mb-1 mx-5">
        Login
      </button>
      <button onClick={() => history.push("/forgot_password")} className="btn btn-outline-secondary my-1 mx-5">
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

  const [nameNotFound, setNameNotFound] = useState(0);

  const [registerSuccessful, setRegisterSuccessful] = useState(0);

  function handleChange(event){
    const { name, value } = event.target;
    setNameNotFound(0);
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
      })
      .catch((e) => {
        console.log(e);
        setNameNotFound(1);
      })
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
        <div 
          className="myColumnSimple border border-info border-1 rounded" 
          style={{
            background:"rgba(255, 255, 255, 0.85)",
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            width : '40vw',
            height:"92vh",
            padding: "4px"
          }}
        >
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}
          >
            <h3 className="fw-light">{isLoginState ? "Login" : "Register"}</h3>
            <div 
              style={{
                display: "flex",
              }}
            >
              <button className="btn btn-outline-info mx-2" onClick={event => !isLoginState ? setIsLoginState(true) : null}>
                Login
              </button>
              <button className="btn btn-outline-info mx-2" onClick={event => {
                  if (isLoginState) {
                    setIsLoginState(false)
                  }
                  setRegisterSuccessful(0);
                }}>
                Register
              </button>
            </div>
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
          <h3 className="fw-light">Home</h3>
          <label className="form-label" style={{fontSize:"1vw"}}>Enter Name:</label>
          <input
            type="text"
            className="form-control"
            style={{width:"25vw",height:"4vh",marginLeft:"1vw"}}
            placeholder="Enter Name"
            name="Name"
            value={nameSearchState}
            onChange={handleChange}
          />
          {<p className="text-danger" style={{display:nameNotFound == 1 ? "flex" : "none", fontSize:"1vw"}}>Name not found</p>}
          <button 
            className="btn btn-outline-secondary"
            onClick={handleClick}
            style={{
              marginTop:"1vh",
              marginBottom:"3vh"
            }}
          >
            <span style={{fontSize:"1.5vw"}}>Search</span>
          </button>

          <h5 className="fw-light">New Posts</h5>
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
              <div key={index} style={{
                display:"flex",
                alignItems:"center",
                justifyContent:"center",
                flexDirection:"column"
              }}>
                <div style={{
                  display:"flex",
                  alignItems:"center",
                  justifyContent:"center"
                }}>
                  <pre style={{fontSize:"1.2vw"}}>{object.name}  Created by: </pre>
                  <Link to={"/profile/" + object.idCreator}>
                    <pre style={{fontSize:"1.2vw"}}>{object.creator}</pre>
                  </Link>
                </div>
                
                <img src={object.image} style={{width:"10vw", height:"10vw"}} onClick={() => goToPost(object.id)}></img>
                <pre style={{fontSize:"1.2vw"}}>Likes: {object.likes}  Dislikes: {object.dislikes}</pre>
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