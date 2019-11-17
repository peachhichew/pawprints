const CreatePawpostContainer = csrf => {
  return (
    <div>
      <h2 className="pageTitle">Feed</h2>
      <section id="makePawpost">
        <PawpostForm csrf={csrf} />
      </section>
      <section id="pawposts">
        <PawpostList pawposts={[]} csrf={csrf} />
      </section>
    </div>
  );
};

const handlePawpost = e => {
  e.preventDefault();

  $("#toastMessage").animate({ bottom: "hide" }, 250);

  console.log($("#content").val());
  if ($("#content").val() == "") {
    handleError("Content is empty!");
    return false;
  }

  sendAjax(
    "POST",
    $("#pawpostForm").attr("action"),
    $("#pawpostForm").serialize(),
    function() {
      loadPawpostsFromServer();
    }
  );

  $("#content").val("");

  return false;
};

const PawpostForm = props => {
  return (
    <div className="formLayout">
      <img className="profilePic" src="./assets/img/cookie.jpg"></img>
      <form
        id="pawpostForm"
        onSubmit={handlePawpost}
        name="pawpostForm"
        action="/feed"
        method="POST"
        className="pawpostForm"
      >
        <textarea
          rows="5"
          cols="60"
          id="content"
          placeholder="What's on your mind?"
          name="content"
        ></textarea>
        <input type="hidden" name="_csrf" value={props.csrf} />
        <input className="makePawpostSubmit" type="submit" value="Post" />
      </form>
    </div>
  );
};

const PawpostList = function(props) {
  console.log("props.pawposts", props.pawposts);
  if (props.pawposts.length === 0) {
    return (
      <div className="pawpostList">
        <h3 className="emptyPawpost">No pawposts yet</h3>
      </div>
    );
  }

  const pawpostNodes = props.pawposts.map(function(pawpost) {
    let options = {
      year: "numeric",
      month: "long",
      day: "numeric"
    };
    let date = new Date(pawpost.createdDate.substring(0, 10));
    let time = new Date(pawpost.createdDate);

    return (
      <div key={pawpost._id} className="pawpost">
        <div id="renderModal" />
        <img
          src="./assets/img/cookie.jpg"
          alt="profile pic"
          className="profilePic"
        />
        <div className="contentInfo">
          <p className="statusUpdated">
            <span className="username">{pawpost.username}</span> updated their
            status.
          </p>

          <p className="pawpostDate">
            {date.toLocaleDateString("en-US", options)} •
            {` ${time
              .toLocaleTimeString("en-US")
              .substring(0, time.toLocaleTimeString("en-US").length - 6)} 
              ${time
                .toLocaleTimeString("en-US")
                .substring(8, time.toLocaleTimeString("en-US").length)}`}
          </p>
          <p className="pawpostContent">{pawpost.content}</p>
          <h3 className="pawpostContentImg">{pawpost.contentImg}</h3>
        </div>
        <EditPawpost pawposts={pawpost} csrf={props.csrf} />
      </div>
    );
  });

  return <div className="pawpostList">{pawpostNodes.reverse()}</div>;
};

class Modal extends React.Component {
  render() {
    // Render nothing if the "show" prop is false
    if (!this.props.show) {
      return null;
    }

    return (
      <div className="backdrop">
        <div className="modal">
          <div className="footer">
            <h3>Edit Pawpost</h3>
            <button onClick={this.props.onClose} className="closeButton">
              <i className="fa fa-times fa-lg" aria-hidden="true"></i>
            </button>
          </div>
          {this.props.children}
        </div>
      </div>
    );
  }
}

const handleEditPawpost = e => {
  e.preventDefault();

  $("#toastMessage").animate({ bottom: "hide" }, 250);

  console.log("inside contentEdit", $("#contentEdit").val());
  if ($("#contentEdit").val() == "") {
    handleError("All fields are required");
    return false;
  }

  sendAjax(
    "POST",
    $("#pawpostFormEdit").attr("action"),
    $("#pawpostFormEdit").serialize(),
    function() {
      loadPawpostsFromServer();
    }
  );

  return false;
};

class EditPawpost extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isOpen: false, pawposts: props.pawposts, csrf: props.csrf };
    this.toggleModal = this.toggleModal.bind(this);
  }

  toggleModal() {
    this.setState({ isOpen: !this.state.isOpen });
  }

  render() {
    console.log(this.state);

    return (
      <div>
        <button onClick={this.toggleModal} className="editButton">
          <i className="fa fa-pencil" aria-hidden="true"></i>
        </button>

        <Modal show={this.state.isOpen} onClose={this.toggleModal}>
          <form
            id="pawpostFormEdit"
            onSubmit={handleEditPawpost}
            name="pawpostFormEdit"
            action="/updatePawpost"
            method="POST"
          >
            <textarea
              rows="5"
              cols="68"
              id="contentEdit"
              placeholder={this.state.pawposts.content}
              name="contentEdit"
            ></textarea>
            <input type="hidden" name="_csrf" value={this.state.csrf} />
            <input type="hidden" name="_id" value={this.state.pawposts._id} />
            <input className="makePawpostSubmit" type="submit" value="Update" />
          </form>
        </Modal>
      </div>
    );
  }
}

const loadPawpostsFromServer = csrf => {
  console.log("inside loadPawpostsFromServer");
  sendAjax("GET", "/getPawposts", null, data => {
    ReactDOM.render(
      <PawpostList pawposts={data.pawposts} csrf={csrf} />,
      document.querySelector("#pawposts")
    );
  });
};

const createFeedWindow = csrf => {
  ReactDOM.render(
    <CreatePawpostContainer pawposts={[]} csrf={csrf} />,
    document.querySelector("#content")
  );

  loadPawpostsFromServer(csrf);
};

const createSettingsWindow = csrf => {
  ReactDOM.render(
    <ChangePassword csrf={csrf} />,
    document.querySelector("#content")
  );
};

const setup = function(csrf) {
  const feedButton = document.querySelector("#feedButton");
  const settingsButton = document.querySelector("#settingsButton");
  feedButton.addEventListener("click", e => {
    e.preventDefault();
    createFeedWindow(csrf);
    return false;
  });
  settingsButton.addEventListener("click", e => {
    e.preventDefault();
    createSettingsWindow(csrf);
    return false;
  });
  createFeedWindow(csrf); // default view
};

const getToken = () => {
  sendAjax("GET", "/getToken", null, result => {
    setup(result.csrfToken);
  });
};

$(document).ready(function() {
  getToken();
});
