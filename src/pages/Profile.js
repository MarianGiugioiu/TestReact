import '../App.css';
import { useHistory, useParams } from "react-router-dom";
import React, { useRef, useEffect, useCallback, useState, useContext } from 'react'
import httpService from '../services/httpService';
import AuthenticationContext from "../AuthenticationContext";

export default function Profile(props) {
    const history = useHistory();
    const [allImagesState,setAllImagesState] = useState([]);
    const [allImagesHiddenState, setAllImagesHiddenState] = useState("hidden");
    const [allPostingsState,setAllPostingsState] = useState([]);
    const [allPostingsHiddenState, setAllPostingsHiddenState] = useState("hidden");

    //console.log(props.profile)
    const privacyOptions = JSON.parse(props.profile.privacy);
    //console.log(privacyOptions)

    const allImagesRefs = {};
    const allPostingsRefs = {};

    function loadAllImages () {
        if(allImagesState.length == 0){
            var URL = "/profile/" + props.profile.id + "/fractals";
            httpService
                .get(URL)
                .then((response) => {
                    var data = response.data;
                    console.log(data);
                    let imageCopy = data.map((elem) => { return {
                        imageId: elem.id,
                        type: elem.type,
                        name: elem.name,
                        image: elem.dataURL
                    }})
                    setAllImagesState(imageCopy);
            })
        } else {
            if(allImagesHiddenState === "hidden"){
                setAllImagesHiddenState("visible");
            } else {
                setAllImagesHiddenState("hidden");
            }
        }
        
        
    }

    function loadAllPostings () {
        console.log(allPostingsState.length)
        if(allPostingsState.length == 0){
            var URL = "/profile/" + props.profile.id + "/postings";
            httpService
                .get(URL)
                .then((response) => {
                    var data = response.data;
                    console.log(data);
                    let postingCopy = data.map((elem) => { return {
                        postingId: elem.id,
                        imageId: elem.fractal.id,
                        name: elem.fractal.name,
                        image: elem.fractal.dataURL
                    }})
                    setAllPostingsState(postingCopy);
            })
        } else {
            if(allPostingsHiddenState === "hidden"){
                setAllPostingsHiddenState("visible");
            } else {
                setAllPostingsHiddenState("hidden");
            }
        }
        
        
    }
    useEffect(() => {
        if (allPostingsState.length > 0) {

            setAllPostingsHiddenState("visible");
        }
    },[allPostingsState])

    useEffect(() => {
        if (allImagesState.length > 0) {

            setAllImagesHiddenState("visible");
        }
    },[allImagesState])

    function choosePosting(object){
        let idPosting= object.postingId;
        let path = "/posting/" + idPosting;
        history.push(path);
    }

    function chooseImage(object){
        let idImg = object.imageId;
        let img = allImagesState.filter(obj => {
            return obj.imageId === idImg;
        })[0]
        console.log(img);
        let path = "/";
        if(img.type === "image"){
            path = "/ImageCreator/old/" + idImg;
        } else if(img.type === "tree"){
            path = "/Tree/old/" + idImg;
        }
        history.push(path);
    }

    function deleteFromList(name, i){
        if (name == "Postings"){
            let list = [...allPostingsState];
            list.splice(i,1);
            setAllPostingsState(list);
        } else if (name == "Images"){
            let URL = /fractal/ + allImagesState[i].imageId
            httpService
                .delete(URL)
                .then((response) => {
                    console.log(response);
                    if (response.status == 202) {
                        let list = [...allImagesState];
                        list.splice(i,1);
                        setAllImagesState(list);
                    }
                })
        } 
        

    }

    function MyList(name, data, refs, visibility, loadFunction, chooseFunction){
        return (
            <div>
                <button onClick={loadFunction} >{visibility === "hidden" ? "Show " + name: "Hide " + name}</button>
                <div className="myRow2" style = {{visibility:visibility}}>
                {
                        
                        data.map(function(object, i){
                            if(object!= null) {
                                return (   
                                    <div className="myColumnSimple"> 
                                        <img
                                            id={i}
                                            ref = {(ref) => refs[`img${i}`] = ref}
                                            src = {object.image}
                                            width = "100vw" height = "100vw"
                                            onClick={() => chooseFunction(object)}
                                            >
                                        </img>
                                        <pre>{object.name}</pre>
                                        <button style = {{visibility: ((visibility === "visible" && props.type === "mine") ? "visible" : "hidden")}} onClick={() => deleteFromList(name,i)}>Delete</button>
                                    </div>
                                );
                            }
                        })
                    }
                </div>
            </div>
        )
    }

    return (
        <div>
            {MyList("Postings",allPostingsState,allPostingsRefs,allPostingsHiddenState,loadAllPostings,choosePosting)}
            {props.type === "mine" || privacyOptions.fractals == true ? MyList("Images",allImagesState,allPostingsRefs,allImagesHiddenState,loadAllImages,chooseImage) : <pre>You can't see this profile's images</pre>}
        </div>
    );
}