import { Button } from 'reactstrap';
import '../App.css';
import { Link } from "react-router-dom";

//<TreeList action="old" id="82"/>
//params={{ action: "old", id:"82" }

export default function Generator() {
  return (
    <div>
      <Link to={{
        pathname: '/Tree/new'
      }}>
          Tree
      </Link>
      <hr></hr>

      <Link to={{
        pathname: '/SnowFlake/new'
      }}>
          SnowFlake
      </Link>
      <hr></hr>

      <Link to={{
        pathname: '/Mountain/new'
      }}>
          Mountain
      </Link>
      <hr></hr>

      <Link to={{
        pathname: '/ImageCreator/new'
      }}>
          ImageCreator
      </Link>
    </div>
  );
}
