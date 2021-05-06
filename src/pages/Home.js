import '../App.css';
import { useHistory, useParams } from "react-router-dom";
import React, { useRef, useEffect, useCallback, useState, useContext } from 'react'
import httpService from '../services/httpService';
import AuthenticationContext from "../AuthenticationContext";
import InfiniteScroll from 'react-infinite-scroll-component';
import { Link } from "react-router-dom";

export default function Home() {
  const history = useHistory();
  const authentication = useContext(AuthenticationContext);
  let myId = authentication.getUser();

  const [nameSearchState, setNameSearchState] = useState("");
  const [userIdState, setUserIdState] = useState("");
  const [postingListState, setPostingListState] = useState([]);

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

  function handleChangeId(event){
    const { name, value } = event.target;
    setUserIdState(value);
  }
  function handleClickLogIn(){
    authentication.logIn(userIdState);
    myId = userIdState;
    loadMorePostings();
  }

  function saveSeen(data) {
    data.map((elem) => {
      let URL = "/posting/" + elem.id;
      let posting = {
        "id": data.id,
        "seenBy": [
          {
            "id": myId
          }
        ]
      }
      httpService
        .put(URL,posting)
        .then((response) => {
          console.log(response);
        })
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
        console.log(postingListCopy);
        //saveSeen(data);
        setPostingListState(postingListCopy);
      })

  function goToPost(id) {
    let path = "/posting/" + id;
    history.push(path);
  }

  useEffect(() => {
    console.log(postingListState);
    //saveSeen(postingListState.slice(-2))
  },[postingListState])


  useEffect(() => {
    if(myId!=-1){
      loadMorePostings();
    }
  },[])

  function HomePage(){
    if(myId==-1){
      return (
        <div>
          <input
            type="text"
            placeholder="Enter Id"
            name="Id"
            value={userIdState}
            onChange={handleChangeId}
          />
          <button
            onClick={handleClickLogIn}
          >
            LogIn
          </button>
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