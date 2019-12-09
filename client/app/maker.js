// Source: https://stackoverflow.com/questions/5587973/javascript-upload-file
// Uses FETCH API to upload images from pawposts to the server
const fileUpload = e => {
  e.preventDefault();

  let formData = new FormData();
  let picture = document.querySelector("#contentImageFile").files[0];
  let csrfToken = document
    .querySelector("#pawpostForm")
    .querySelector('input[name="_csrf"]').value;

  formData.append("sampleFile", picture);
  formData.append("_csrf", csrfToken);

  fetch(`/upload/contentImage?_csrf=${csrfToken}`, {
    method: "POST",
    body: formData
  }).then(function(response) {
    if (response.status === 200) {
      response.json().then(function(data) {
        // window.location = data.redirect;
      });
    }
  });
  return false;
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
      loadPawpostsAndProfilePic();
    }
  );

  if ($("#contentImageFile").val() !== "") {
    fileUpload(e);
  }

  $("#postContent").val("");
  $("#contentImageFile").val("");

  return false;
};

// Renders the form for adding a new pawpost
const PawpostForm = props => {
  return (
    <div className="formLayout">
      <img
        className="profilePic"
        id="formProfilePic"
        src={
          props.imgSrc === undefined
            ? "./assets/img/propic.jpg"
            : `retrieve?_id=${props.imgSrc}`
        }
      />
      <form
        id="pawpostForm"
        onSubmit={handlePawpost}
        name="pawpostForm"
        action="/profile"
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
        <UploadPawpostImage csrf={props.csrf} />
        <input type="hidden" name="_csrf" value={props.csrf} />
        <input className="makePawpostSubmit" type="submit" value="Post" />
      </form>
    </div>
  );
};

// Display all feed or profile pawposts to the screen and properly format
// the information. Also, render the EditPawpost and DeletePawpost components
//  to allow the user to edit/delete their previous pawposts.
const DisplayPawposts = function(props) {
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
        <img
          src={
            props.isFeed
              ? pawpost.profilePic === undefined
                ? "./assets/img/propic.jpg"
                : `retrieve?_id=${pawpost.profilePic}`
              : props.imgSrc === undefined
              ? "./assets/img/propic.jpg"
              : `retrieve?_id=${props.imgSrc}`
          }
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
          <img
            className="pawpostContentImg"
            src={
              pawpost.contentImg === undefined
                ? null
                : `/retrieve?_id=${pawpost.contentImg}`
            }
          />
        </div>
        {props.isFeed ? null : (
          <EditPawpost pawposts={pawpost} csrf={props.csrf} />
        )}
        {props.isFeed ? null : (
          <DeletePawpost pawposts={pawpost} csrf={props.csrf} />
        )}
      </div>
    );
  });

  return <div className="pawpostList">{pawpostNodes.reverse()}</div>;
};

// Base modal component for editing/deleting a pawpost
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
            <h3>{this.props.modalTitle}</h3>
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
    $("#toastMessage").css("border-top", `5px solid #d5300d`);
    $("#errorMessage").css("color", `#d5300d`);
    return false;
  }

  sendAjax(
    "POST",
    $("#pawpostFormEdit").attr("action"),
    $("#pawpostFormEdit").serialize(),
    function() {
      loadPawpostsAndProfilePic();
      handleError("Pawpost updated successfully");
      $("#toastMessage").css("border-top", `5px solid #358c02`);
      $("#errorMessage").css("color", `#358c02`);
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

        <Modal
          show={this.state.isOpen}
          onClose={this.toggleModal}
          modalTitle={"Edit Pawpost"}
        >
          <form
            id="pawpostFormEdit"
            onSubmit={handleEditPawpost}
            name="pawpostFormEdit"
            action="/updatePawpost"
            method="POST"
          >
            <textarea rows="5" cols="68" id="contentEdit" name="contentEdit">
              {this.state.pawposts.content}
            </textarea>
            <input type="hidden" name="_csrf" value={this.state.csrf} />
            <input type="hidden" name="_id" value={this.state.pawposts._id} />
            <input
              className="cancelAction"
              onClick={this.toggleModal}
              value="Cancel"
            />
            <input className="makePawpostSubmit" type="submit" value="Update" />
          </form>
        </Modal>
      </div>
    );
  }
}

// Uses AJAX to send a DELETE request to the server so that user pawposts can be deleted
const handleDeletePawpost = e => {
  $("#toastMessage").animate({ bottom: "hide" }, 250);

  sendAjax(
    "DELETE",
    $("#pawpostFormDelete").attr("action"),
    $("#pawpostFormDelete").serialize(),
    function() {
      loadPawpostsAndProfilePic();
    }
  );
};

// Modal displays and user must confirm that they want the post to be deleted
class DeletePawpost extends React.Component {
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
        <button onClick={this.toggleModal} id="deleteButton">
          <i className="fa fa-trash" aria-hidden="true"></i>
        </button>

        <Modal
          show={this.state.isOpen}
          onClose={this.toggleModal}
          modalTitle={"Delete Pawpost"}
        >
          <form
            id="pawpostFormDelete"
            onSubmit={handleDeletePawpost}
            name="pawpostFormDelete"
            action="/deletePawpost"
            method="DELETE"
          >
            <p>Are you sure you want to delete this pawpost?</p>
            <input type="hidden" name="_csrf" value={this.state.csrf} />
            <input type="hidden" name="_id" value={this.state.pawposts._id} />
            <input
              className="cancelAction"
              onClick={this.toggleModal}
              value="No"
            />
            <input className="makePawpostSubmit" type="submit" value="Yes" />
          </form>
        </Modal>
      </div>
    );
  }
}

// Retrieves the user's account profile picture by making an AJAX call
const getProfilePic = csrf => {
  sendAjax("GET", `/profilePic`, null, data => {
    ReactDOM.render(
      <UploadProfileImage imgSrc={data.account.profilePic} csrf={csrf} />,
      document.querySelector("#profilePic")
    );
  });
};

// Allows user to upload an image when creating a pawpost
const UploadPawpostImage = props => {
  return (
    <div>
      <form
        id="uploadPawpostImageForm"
        action="/upload/contentImage"
        method="POST"
        encType="multipart/form-data"
      >
        <input type="file" name="sampleFile" id="contentImageFile" />
        <input type="hidden" name="_csrf" value={props.csrf} />
      </form>
    </div>
  );
};

// Sends a GET request to the server to retrieve all pawposts
// and user profile picture
const loadPawpostsAndProfilePic = csrf => {
  sendAjax("GET", "/getPawposts", null, pawpostData => {
    sendAjax("GET", `/profilePic`, null, data => {
      ReactDOM.render(
        <PawpostForm imgSrc={data.account.profilePic} csrf={csrf} />,
        document.querySelector("#makePawpost")
      );

      ReactDOM.render(
        <DisplayPawposts
          imgSrc={data.account.profilePic}
          pawposts={pawpostData.pawposts}
          csrf={csrf}
          isFeed={false}
        />,
        document.querySelector("#pawposts")
      );
    });
  });
};

// Uses AJAX to send a GET request to retrieve pawposts from
// all users in the db
const loadFeedPawpostsFromServer = csrf => {
  sendAjax("GET", "/allPawposts", null, data => {
    ReactDOM.render(
      <DisplayPawposts
        imgSrc={""}
        pawposts={data.pawposts}
        csrf={csrf}
        isFeed={true}
      />,
      document.querySelector("#pawposts")
    );
  });
};

// Renders the feed or settings components based on which button is
// clicked in the nav. The default appearance of the "/feed" page
// should display the feed + pawpost content.
const setup = function(csrf) {
  const feedButton = document.querySelector("#feedButton");
  const profileButton = document.querySelector("#profileButton");
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
  profileButton.addEventListener("click", e => {
    e.preventDefault();
    createProfileWindow(csrf);
    return false;
  });
  createProfileWindow(csrf); // default view
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
