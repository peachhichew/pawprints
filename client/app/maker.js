// Add more structure to the app.handlebars page and render
// the PawpostForm and PawpostList components
const CreatePawpostContainer = props => {
  return (
    <div>
      <h2 className="pageTitle">Feed</h2>
      <section id="makePawpost">
        <PawpostForm csrf={props.csrf} />
      </section>
      <section id="pawposts">
        <PawpostList pawposts={[]} csrf={props.csrf} />
      </section>
      <section id="uploadImageTest">
        <UploadImage csrf={props.csrf} />
      </section>
    </div>
  );
};

// Use AJAX to send a POST request to the server to add a new
// pawpost. Then, clear out the form when finished.
const handlePawpost = e => {
  e.preventDefault();

  $("#toastMessage").animate({ bottom: "hide" }, 250);

  if ($("#postContent").val() == "") {
    handleError("Content is empty!");
    $("#toastMessage").css("border-top", `5px solid #d5300d`);
    $("#errorMessage").css("color", `#d5300d`);
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

  $("#postContent").val("");

  return false;
};

// Renders the form for adding a new pawpost
const PawpostForm = props => {
  return (
    <div className="formLayout">
      <img className="profilePic" src="./assets/img/propic.jpg" />
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
          id="postContent"
          placeholder="What's on your mind?"
          name="postContent"
        />
        <input type="hidden" name="_csrf" value={props.csrf} />
        <input className="makePawpostSubmit" type="submit" value="Post" />
      </form>
    </div>
  );
};

// Display all pawposts to the screen and properly format the information.
// Also, render the EditPawpost component to allow the user to edit their
// previous pawposts.
const PawpostList = function(props) {
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
          src="./assets/img/propic.jpg"
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

// Base modal component for editing a pawpost
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
              <i className="fa fa-times fa-lg" aria-hidden="true" />
            </button>
          </div>
          {this.props.children}
        </div>
      </div>
    );
  }
}

// Use AJAX to send a POST request to the server when the user wants to
// edit a pawpost
const handleEditPawpost = e => {
  e.preventDefault();

  $("#toastMessage").animate({ bottom: "hide" }, 250);

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

// Toggles the visibility of the edit pawpost modal and renders a form
// for the editing.
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
    return (
      <div>
        <button onClick={this.toggleModal} className="editButton">
          <i className="fa fa-pencil" aria-hidden="true" />
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
            />
            <input type="hidden" name="_csrf" value={this.state.csrf} />
            <input type="hidden" name="_id" value={this.state.pawposts._id} />
            <input className="makePawpostSubmit" type="submit" value="Update" />
          </form>
        </Modal>
      </div>
    );
  }
}

const UploadImage = props => {
  return (
    <div>
      <form
        id="uploadForm"
        action="/upload"
        method="POST"
        encType="multipart/form-data"
      >
        <input type="file" name="sampleFile" />
        <input type="submit" value="Upload" />
        <input type="hidden" name="_csrf" value={props.csrf} />
      </form>
    </div>
  );
};

// Sends a GET request to the server to retrieve all pawposts
const loadPawpostsFromServer = csrf => {
  sendAjax("GET", "/getPawposts", null, data => {
    ReactDOM.render(
      <PawpostList pawposts={data.pawposts} csrf={csrf} />,
      document.querySelector("#pawposts")
    );
  });
};

// Renders the CreatePawpostContainer component on the scrreen
const createFeedWindow = csrf => {
  ReactDOM.render(
    <CreatePawpostContainer pawposts={[]} csrf={csrf} />,
    document.querySelector("#content")
  );

  loadPawpostsFromServer(csrf);
};

// Renders the ChangePassword component on the screen
const createSettingsWindow = csrf => {
  ReactDOM.render(
    <ChangeSettingsContainer csrf={csrf} />,
    document.querySelector("#content")
  );
};

// Renders the feed or settings components based on which button is
// clicked in the nav. The default appearance of the "/feed" page
// should display the feed + pawpost content.
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

// Retrieves the csrf token from the server
const getToken = () => {
  sendAjax("GET", "/getToken", null, result => {
    setup(result.csrfToken);
  });
};

$(document).ready(function() {
  getToken();
});
