import { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import useToastListener from "../toaster/ToastListenerHook";
import useUserInfo from "../userInfo/UserInfoHook";
import React from "react";

import {
  PagedItemPresenter,
  PagedItemView,
} from "../../presenter/PagedItemPresenter";

interface Props<T, U> {
  presenterGenerator: (view: PagedItemView<T>) => PagedItemPresenter<T, U>;
  itemComponentGenerator: (item: T, index: number) => JSX.Element;
}

function ItemScroller<T, U>(props: Props<T, U>) {
  const { displayErrorMessage } = useToastListener();
  const { displayedUser, authToken } = useUserInfo();

  const [items, setItems] = useState<T[]>([]);
  const [newItems, setNewItems] = useState<T[]>([]);
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

  const listener: PagedItemView<T> = {
    addItems: (newItems: T[]) => setNewItems(newItems),
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
        {items.map((item, index) => {
          const element = props.itemComponentGenerator(item, index);
          return React.cloneElement(element, { key: index }); // Add key to existing element
        })}
      </InfiniteScroll>
    </div>
  );
}

export default ItemScroller;
