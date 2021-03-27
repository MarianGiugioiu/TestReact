import './App.css';
import React, { useRef, useEffect, useCallback, useState } from 'react'

export default function TestDrive(props){
    var sample = "sample text";

    var CLIENT_ID = '460770374774-hqa1h5irtbpo8i03g570gi4dgdcu1dol.apps.googleusercontent.com';
    var API_KEY = 'AIzaSyC-cIgQqmlD0WXoNXOeFAgAfi2rxLid4uc';
    var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];
    var SCOPES = 'https://www.googleapis.com/auth/drive.metadata.readonly';

    function handleClick(){
        console.log(sample);
        //var folder = DriveApp.getFolderById('1a3W53B9QWIA93lBxNUMpojlZR0APFV2U');
    }

    return(
        <div>
            <p>{sample}</p>
            <button onClick={handleClick}>Upload</button>
        </div>
    )
}
