import { Status } from "tweeter-shared";
import { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import useToastListener from "../toaster/ToastListenerHook";
import { StatusItem } from "../statusItem/StatusItem";
import useUserInfo from "../userInfo/UserInfoHook";
import {
  StatusItemPresenter,
  StatusItemView,
} from "../../presenter/StatusItemPresenter";

interface Props {
  presenterGenerator: (view: StatusItemView) => StatusItemPresenter;
}

const StoryScroller = (props: Props) => {
  const { displayErrorMessage } = useToastListener();
  const { displayedUser, authToken } = useUserInfo();

  const [items, setItems] = useState<Status[]>([]);
  const [newItems, setNewItems] = useState<Status[]>([]);
  const [changedDisplayedUser, setChangedDisplayedUser] = useState(true);

  // Initialize the component whenever the displayed user changes
  useEffect(() => {
    reset();
  }, [displayedUser]);

  // Load initial items whenever the displayed user changes. Done in a separate useEffect hook so the changes from reset will be visible.
  useEffect(() => {
    if (changedDisplayedUser) {
      loadMoreItems();
    }
  }, [changedDisplayedUser]);

  // Add new items whenever there are new items to add
  useEffect(() => {
    if (newItems) {
      setItems([...items, ...newItems]);
    }
  }, [newItems]);

  const reset = async () => {
    setItems([]);
    setNewItems([]);
    setChangedDisplayedUser(true);
    presenter.reset();
  };

  const listener: StatusItemView = {
    addItems: (newItems: Status[]) => setNewItems(newItems),
    displayErrorMessage: displayErrorMessage,
  };
  const [presenter] = useState(props.presenterGenerator(listener));

  const loadMoreItems = async () => {
    presenter.loadMoreItems(authToken!, displayedUser!.alias);
    setChangedDisplayedUser(false);
  };

  return (
    <div className="container px-0 overflow-visible vh-100">
      <InfiniteScroll
        className="pr-0 mr-0"
        dataLength={items.length}
        next={loadMoreItems}
        hasMore={presenter.hasMoreItems}
        loader={<h4>Loading...</h4>}
      >
        {items.map((item, index) => (
          <StatusItem index={index} item={item} />
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default StoryScroller;
