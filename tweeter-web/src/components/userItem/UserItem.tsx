import { User } from "tweeter-shared";
import { Link } from "react-router-dom";
import useNavigateUser from "../userInfo/UserNavigationHook";

interface Props {
  index: number;
  item: User;
}

const UserItem = (props: Props) => {
  const { navigateToUser } = useNavigateUser();

  return (
    <div className="col bg-light mx-0 px-0">
      <div className="container px-0">
        <div className="row mx-0 px-0">
          <div className="col-auto p-3">
            <img
              src={props.item.imageUrl}
              className="img-fluid"
              width="80"
              alt="Posting user"
            />
          </div>
          <div className="col">
            <h2>
              <b>
                {props.item.firstName} {props.item.lastName}
              </b>{" "}
              -{" "}
              <Link to={props.item.alias} onClick={navigateToUser}>
                {props.item.alias}
              </Link>
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserItem;
