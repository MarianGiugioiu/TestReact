import '../App.css';
import { Input, FormGroup, Label, Button } from "reactstrap";
import { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";
import httpService from '../services/httpService';

export default function Home() {
  const [nameSearchState, setNameSearchState] = useState("");
  const history = useHistory();

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
    </div>
  );
}