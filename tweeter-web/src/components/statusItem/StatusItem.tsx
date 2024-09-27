import { Status } from "tweeter-shared";
import { Link } from "react-router-dom";
import Post from "./Post";
import useNavigateUser from "../userInfo/UserNavigationHook";

interface StatusItemProps {
  index: number;
  item: Status;
}

export const StatusItem: React.FC<StatusItemProps> = ({ index, item }) => {
  const { navigateToUser } = useNavigateUser();

  return (
    <div key={index} className="row mb-3 mx-0 px-0 border rounded bg-white">
      <div className="col bg-light mx-0 px-0">
        <div className="container px-0">
          <div className="row mx-0 px-0">
            <div className="col-auto p-3">
              <img
                src={item.user.imageUrl}
                className="img-fluid"
                width="80"
                alt="Posting user"
              />
            </div>
            <div className="col">
              <h2>
                <b>
                  {item.user.firstName} {item.user.lastName}
                </b>{" "}
                -{" "}
                <Link to={item.user.alias} onClick={navigateToUser}>
                  {item.user.alias}
                </Link>
              </h2>
              {item.formattedDate}
              <br />
              <Post status={item} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
