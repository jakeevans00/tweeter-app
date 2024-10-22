import { anyNumber, anything, instance, mock, spy, verify } from "ts-mockito";
import {
  PostStatusPresenter,
  PostStatusView,
} from "../../src/presenter/PostStatusPresenter";
import { AuthToken, User } from "tweeter-shared";
import { StatusService } from "../../src/model/service/StatusService";

describe("PostStatusPresenter", () => {
  let mockPostStatusView: PostStatusView;
  let postStatusPresenter: PostStatusPresenter;
  let mockStatusService: StatusService;

  const post = "message";
  const currentUser = new User("john", "doe", "jdoe", "url");
  const authToken = new AuthToken("token", Date.now());

  beforeEach(() => {
    mockPostStatusView = mock<PostStatusView>();
    const mockpostStatusViewInstance = instance(mockPostStatusView);

    const spiedPostStatusPresenter = spy(
      new PostStatusPresenter(mockpostStatusViewInstance)
    );

    postStatusPresenter = instance(spiedPostStatusPresenter);

    mockStatusService = mock<StatusService>();
  });

  it("tells the view to display a posting status message", async () => {
    await postStatusPresenter.submitPost(post, currentUser, authToken);

    verify(
      mockPostStatusView.displayInfoMessage(anything(), anyNumber())
    ).once();

    it("calls postStatus on post status service with correct status string and auth token", async () => {});
  });
});
