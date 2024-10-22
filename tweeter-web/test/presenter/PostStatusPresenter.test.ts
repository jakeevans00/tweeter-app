import {
  anyNumber,
  anything,
  capture,
  instance,
  mock,
  spy,
  verify,
  when,
} from "ts-mockito";
import {
  PostStatusPresenter,
  PostStatusView,
} from "../../src/presenter/PostStatusPresenter";
import { AuthToken, Status, User } from "tweeter-shared";
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
    mockStatusService = mock<StatusService>();

    const mockPostStatusViewInstance = instance(mockPostStatusView);
    const mockStatusServiceInstance = instance(mockStatusService);

    const spiedPostStatusPresenter = spy(
      new PostStatusPresenter(mockPostStatusViewInstance)
    );

    postStatusPresenter = instance(spiedPostStatusPresenter);
    when(spiedPostStatusPresenter.statusService).thenReturn(
      mockStatusServiceInstance
    );
  });

  it("tells the view to display a posting status message", async () => {
    await postStatusPresenter.submitPost(post, currentUser, authToken);

    verify(
      mockPostStatusView.displayInfoMessage("Posting status...", anyNumber())
    ).once();
  });

  it("calls postStatus on post status service with correct status string and auth token", async () => {
    await postStatusPresenter.submitPost(post, currentUser, authToken);
    const [capturedToken, capturedStatus] = capture(
      mockStatusService.postStatus
    ).last();
    expect(capturedToken).toBe(authToken);
    expect(capturedStatus).toBeInstanceOf(Status);
    expect(capturedStatus.post).toBe(post);
  });

  it("tells the view to clear last info message, clear post, and diaplay a status posted message (on success)", async () => {
    await postStatusPresenter.submitPost(post, currentUser, authToken);
    verify(mockPostStatusView.clearLastInfoMessage()).once();
    verify(mockPostStatusView.setPost("")).once();
    verify(
      mockPostStatusView.displayInfoMessage("Status posted!", anyNumber())
    ).once();
  });

  it("tells the view to display an error message and clear the last info message, does not clear post or display status posted (on failure)", async () => {
    const error = new Error("An error has occured");
    when(mockStatusService.postStatus(anything(), anything())).thenThrow(error);

    await postStatusPresenter.submitPost(post, currentUser, authToken);
    verify(mockPostStatusView.clearLastInfoMessage()).once();
    verify(mockPostStatusView.displayErrorMessage(error.message));
    verify(mockPostStatusView.setPost("")).never();
    verify(
      mockPostStatusView.displayInfoMessage("Status posted!", anyNumber())
    ).never();
  });
});
