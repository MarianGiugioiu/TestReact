import { Button } from 'reactstrap';
import '../App.css';
import { Link } from "react-router-dom";

//<TreeList action="old" id="82"/>
//params={{ action: "old", id:"82" }

export default function Generator() {
  return (
    <div style={{
        display: 'flex',
        flexDirection: "column",
        alignItems:"center",
        background:"rgba(255, 255, 255, 0.75)",
        padding: "1vh",
        border: "1.5px dotted gray",
        borderRadius: "15px",
        height: "92vh",
        width:"60vw",
        overflow: "hidden"
    }}>
      <h3 className="fw-light">Generator</h3>
      <p>These generators will create various fractals based on three main algorithms which are meant to reproduce trees, snowflakes and mountains.
The Image Creator will allow you to assemble the fractals you make into an image which will then be uploaded to your profile.
All images can also be downloaded as a png or jpg.<p/>

      <p></p>Note: Generating mountains using the "High quality" option will impact your performance.</p>
      <ul className="list-group list-group-flush" style={{marginTop:"3vh"}}>
        <li className="list-group-item list-group-item-action">
          <Link to={{
            pathname: '/Tree/new'
          }}>
              Tree
          </Link>
        </li>
        <li className="list-group-item list-group-item-action">
          <Link to={{
            pathname: '/SnowFlake/new'
          }}>
              SnowFlake
          </Link>
        </li>
        <li className="list-group-item list-group-item-action">
          <Link to={{
            pathname: '/Mountain/new'
          }}>
              Mountain
          </Link>
        </li>
        <li className="list-group-item list-group-item-action">
          <Link to={{
            pathname: '/ImageCreator/new'
          }}>
              ImageCreator
          </Link>
        </li>
      </ul>
    </div>
  );
}
