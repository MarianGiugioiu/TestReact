import { Button } from 'reactstrap';
import '../App.css';
import { Link } from "react-router-dom";

//<TreeList action="old" id="82"/>
//params={{ action: "old", id:"82" }

export default function Generator() {
  return (
    <div>
      <Link to={{
        pathname: '/Tree',
        state: {
          action: "new",
          id: 2
        }
      }}>
          Tree
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
