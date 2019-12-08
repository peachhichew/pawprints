"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// Add more structure to the app.handlebars page and render
// the PawpostForm and PawpostList components
var CreatePawpostContainer = function CreatePawpostContainer(props) {
  console.log("createPawpostContainer props.imgSrc:", props.imgSrc);
  return React.createElement(
    "div",
    null,
    React.createElement(
      "h2",
      { className: "pageTitle" },
      "Profile"
    ),
    React.createElement(
      "section",
      { id: "makePawpost" },
      React.createElement(PawpostForm, { imgSrc: props.imgSrc, csrf: props.csrf })
    ),
    React.createElement(
      "section",
      { id: "pawposts" },
      React.createElement(PawpostList, { imgSrc: props.imgSrc, pawposts: [], csrf: props.csrf })
    )
  );
};

var CreateFeedContainer = function CreateFeedContainer(props) {
  return React.createElement(
    "div",
    null,
    React.createElement(
      "h2",
      { className: "pageTitle" },
      "Feed"
    ),
    React.createElement(
      "section",
      { id: "pawposts" },
      React.createElement(PawpostsInFeed, { imgSrc: props.imgSrc, pawposts: [], csrf: props.csrf })
    )
  );
};

// Use AJAX to send a POST request to the server to add a new
// pawpost. Then, clear out the form when finished.
var handlePawpost = function handlePawpost(e) {
  e.preventDefault();

  $("#toastMessage").animate({ bottom: "hide" }, 250);

  if ($("#postContent").val() == "") {
    handleError("Content is empty!");
    $("#toastMessage").css("border-top", "5px solid #d5300d");
    $("#errorMessage").css("color", "#d5300d");
    return false;
  }

  sendAjax("POST", $("#pawpostForm").attr("action"), $("#pawpostForm").serialize(), function () {
    // loadProfilePawpostsFromServer();
    loadPawpostsAndProfilePic();
  });

  if ($("#fileInput").val() !== "") {
    console.log("posting to upload content");
    sendAjax("POST", $("#uploadContentImageForm").attr("action"), $("#uploadContentImageForm").serialize(), function () {
      console.log("uploading pic");
      // loadProfilePawpostsFromServer();
      // loadPawpostsAndProfilePic();
    });
  }

  $("#postContent").val("");

  return false;
};

// Renders the form for adding a new pawpost
var PawpostForm = function PawpostForm(props) {
  console.log("props.imgSrc in PawpostForm:", props.imgSrc);
  if (props.imgSrc === undefined || props.imgSrc === "") {
    console.log("image src is undefined or blank");
    $(".profilePic").attr("src", "./assets/img/propic.jpg");
  } else {
    $(".profilePic").attr("src", "retrieve?_id=" + props.imgSrc);
  }
  return React.createElement(
    "div",
    { className: "formLayout" },
    React.createElement("img", {
      className: "profilePic"
      // src="./assets/img/propic.jpg"
      , src: "retrieve?_id=" + props.imgSrc
    }),
    React.createElement(
      "form",
      {
        id: "pawpostForm",
        onSubmit: handlePawpost,
        name: "pawpostForm",
        action: "/profile",
        method: "POST",
        className: "pawpostForm"
      },
      React.createElement("textarea", {
        rows: "5",
        cols: "60",
        id: "postContent",
        placeholder: "What's on your mind?",
        name: "postContent"
      }),
      React.createElement(UploadContentImage, { csrf: props.csrf }),
      React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
      React.createElement("input", { className: "makePawpostSubmit", type: "submit", value: "Post" })
    )
  );
};

// Display all pawposts to the screen and properly format the information.
// Also, render the EditPawpost component to allow the user to edit their
// previous pawposts.
var PawpostList = function PawpostList(props) {
  console.log("props.imgSrc in PawpostList():", props.imgSrc);
  if (props.pawposts.length === 0) {
    return React.createElement(
      "div",
      { className: "pawpostList" },
      React.createElement(
        "h3",
        { className: "emptyPawpost" },
        "No pawposts yet"
      )
    );
  }

  var pawpostNodes = props.pawposts.map(function (pawpost) {
    var options = {
      year: "numeric",
      month: "long",
      day: "numeric"
    };
    var date = new Date(pawpost.createdDate.substring(0, 10));
    var time = new Date(pawpost.createdDate);

    return React.createElement(
      "div",
      { key: pawpost._id, className: "pawpost" },
      React.createElement("div", { id: "renderModal" }),
      React.createElement("img", {
        // src="./assets/img/propic.jpg"
        src: "retrieve?_id=" + props.imgSrc,
        alt: "profile pic",
        className: "profilePic"
      }),
      React.createElement(
        "div",
        { className: "contentInfo" },
        React.createElement(
          "p",
          { className: "statusUpdated" },
          React.createElement(
            "span",
            { className: "username" },
            pawpost.username
          ),
          " updated their status."
        ),
        React.createElement(
          "p",
          { className: "pawpostDate" },
          date.toLocaleDateString("en-US", options),
          " \u2022",
          " " + time.toLocaleTimeString("en-US").substring(0, time.toLocaleTimeString("en-US").length - 6) + " \n              " + time.toLocaleTimeString("en-US").substring(8, time.toLocaleTimeString("en-US").length)
        ),
        React.createElement(
          "p",
          { className: "pawpostContent" },
          pawpost.content
        ),
        React.createElement(
          "h3",
          { className: "pawpostContentImg" },
          pawpost.contentImg
        )
      ),
      React.createElement(EditPawpost, { pawposts: pawpost, csrf: props.csrf }),
      React.createElement(DeletePawpost, { pawposts: pawpost, csrf: props.csrf })
    );
  });

  return React.createElement(
    "div",
    { className: "pawpostList" },
    pawpostNodes.reverse()
  );
};

var PawpostsInFeed = function PawpostsInFeed(props) {
  console.log("props.imgSrc:", props.imgSrc);
  if (props.pawposts.length === 0) {
    return React.createElement(
      "div",
      { className: "pawpostList" },
      React.createElement(
        "h3",
        { className: "emptyPawpost" },
        "No pawposts yet"
      )
    );
  }

  var pawpostNodes = props.pawposts.map(function (pawpost) {
    var options = {
      year: "numeric",
      month: "long",
      day: "numeric"
    };
    var date = new Date(pawpost.createdDate.substring(0, 10));
    var time = new Date(pawpost.createdDate);

    return React.createElement(
      "div",
      { key: pawpost._id, className: "pawpost" },
      React.createElement("img", {
        src: "./assets/img/propic.jpg"
        // src={`retrieve?_id=${props.imgSrc}`}
        // src={}
        , alt: "profile pic"
        // className="profilePic"
        , className: "feedProfilePic"
      }),
      React.createElement(
        "div",
        { className: "contentInfo" },
        React.createElement(
          "p",
          { className: "statusUpdated" },
          React.createElement(
            "span",
            { className: "username" },
            pawpost.username
          ),
          " updated their status."
        ),
        React.createElement(
          "p",
          { className: "pawpostDate" },
          date.toLocaleDateString("en-US", options),
          " \u2022",
          " " + time.toLocaleTimeString("en-US").substring(0, time.toLocaleTimeString("en-US").length - 6) + " \n              " + time.toLocaleTimeString("en-US").substring(8, time.toLocaleTimeString("en-US").length)
        ),
        React.createElement(
          "p",
          { className: "pawpostContent" },
          pawpost.content
        ),
        React.createElement(
          "h3",
          { className: "pawpostContentImg" },
          pawpost.contentImg
        )
      )
    );
  });

  return React.createElement(
    "div",
    { className: "pawpostList" },
    pawpostNodes.reverse()
  );
};

// Base modal component for editing a pawpost

var Modal = function (_React$Component) {
  _inherits(Modal, _React$Component);

  function Modal() {
    _classCallCheck(this, Modal);

    return _possibleConstructorReturn(this, (Modal.__proto__ || Object.getPrototypeOf(Modal)).apply(this, arguments));
  }

  _createClass(Modal, [{
    key: "render",
    value: function render() {
      // Render nothing if the "show" prop is false
      if (!this.props.show) {
        return null;
      }

      return React.createElement(
        "div",
        { className: "backdrop" },
        React.createElement(
          "div",
          { className: "modal" },
          React.createElement(
            "div",
            { className: "footer" },
            React.createElement(
              "h3",
              null,
              "Edit Pawpost"
            ),
            React.createElement(
              "button",
              { onClick: this.props.onClose, className: "closeButton" },
              React.createElement("i", { className: "fa fa-times fa-lg", "aria-hidden": "true" })
            )
          ),
          this.props.children
        )
      );
    }
  }]);

  return Modal;
}(React.Component);

// Use AJAX to send a POST request to the server when the user wants to
// edit a pawpost


var handleEditPawpost = function handleEditPawpost(e) {
  e.preventDefault();

  $("#toastMessage").animate({ bottom: "hide" }, 250);

  if ($("#contentEdit").val() == "") {
    handleError("All fields are required");
    return false;
  }

  sendAjax("POST", $("#pawpostFormEdit").attr("action"), $("#pawpostFormEdit").serialize(), function () {
    // loadProfilePawpostsFromServer();
    loadPawpostsAndProfilePic();
  });

  return false;
};

// Toggles the visibility of the edit pawpost modal and renders a form
// for the editing.

var EditPawpost = function (_React$Component2) {
  _inherits(EditPawpost, _React$Component2);

  function EditPawpost(props) {
    _classCallCheck(this, EditPawpost);

    var _this2 = _possibleConstructorReturn(this, (EditPawpost.__proto__ || Object.getPrototypeOf(EditPawpost)).call(this, props));

    _this2.state = { isOpen: false, pawposts: props.pawposts, csrf: props.csrf };
    _this2.toggleModal = _this2.toggleModal.bind(_this2);
    return _this2;
  }

  _createClass(EditPawpost, [{
    key: "toggleModal",
    value: function toggleModal() {
      this.setState({ isOpen: !this.state.isOpen });
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        null,
        React.createElement(
          "button",
          { onClick: this.toggleModal, className: "editButton" },
          React.createElement("i", { className: "fa fa-pencil", "aria-hidden": "true" })
        ),
        React.createElement(
          Modal,
          { show: this.state.isOpen, onClose: this.toggleModal },
          React.createElement(
            "form",
            {
              id: "pawpostFormEdit",
              onSubmit: handleEditPawpost,
              name: "pawpostFormEdit",
              action: "/updatePawpost",
              method: "POST"
            },
            React.createElement(
              "textarea",
              {
                rows: "5",
                cols: "68",
                id: "contentEdit"
                // placeholder={this.state.pawposts.content}
                , name: "contentEdit"
              },
              this.state.pawposts.content
            ),
            React.createElement("input", { type: "hidden", name: "_csrf", value: this.state.csrf }),
            React.createElement("input", { type: "hidden", name: "_id", value: this.state.pawposts._id }),
            React.createElement("input", { className: "makePawpostSubmit", type: "submit", value: "Update" })
          )
        )
      );
    }
  }]);

  return EditPawpost;
}(React.Component);

var handleDeletePawpost = function handleDeletePawpost(e) {
  // e.preventDefault();

  $("#toastMessage").animate({ bottom: "hide" }, 250);

  sendAjax("DELETE", $("#pawpostFormDelete").attr("action"), $("#pawpostFormDelete").serialize(), function () {
    // loadProfilePawpostsFromServer();

    loadPawpostsAndProfilePic();
  });

  // return false;
};

var DeletePawpost = function (_React$Component3) {
  _inherits(DeletePawpost, _React$Component3);

  function DeletePawpost(props) {
    _classCallCheck(this, DeletePawpost);

    var _this3 = _possibleConstructorReturn(this, (DeletePawpost.__proto__ || Object.getPrototypeOf(DeletePawpost)).call(this, props));

    _this3.state = { isOpen: false, pawposts: props.pawposts, csrf: props.csrf };
    _this3.toggleModal = _this3.toggleModal.bind(_this3);
    return _this3;
  }

  _createClass(DeletePawpost, [{
    key: "toggleModal",
    value: function toggleModal() {
      this.setState({ isOpen: !this.state.isOpen });
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        null,
        React.createElement(
          "button",
          { onClick: this.toggleModal, id: "deleteButton" },
          React.createElement("i", { className: "fa fa-trash", "aria-hidden": "true" })
        ),
        React.createElement(
          Modal,
          { show: this.state.isOpen, onClose: this.toggleModal },
          React.createElement(
            "form",
            {
              id: "pawpostFormDelete",
              onSubmit: handleDeletePawpost,
              name: "pawpostFormDelete",
              action: "/deletePawpost",
              method: "DELETE"
            },
            React.createElement(
              "p",
              null,
              "Are you sure you want to delete this pawpost?"
            ),
            React.createElement("input", { type: "hidden", name: "_csrf", value: this.state.csrf }),
            React.createElement("input", { type: "hidden", name: "_id", value: this.state.pawposts._id }),
            React.createElement("input", { className: "makePawpostSubmit", type: "submit", value: "Yes" }),
            React.createElement("input", {
              className: "cancelDeletePawpost",
              onClick: this.toggleModal,
              value: "No"
            })
          )
        )
      );
    }
  }]);

  return DeletePawpost;
}(React.Component);

var getProfilePic = function getProfilePic(csrf) {
  sendAjax("GET", "/profilePic", null, function (data) {
    console.log("data from getProfilePic", data.account.profilePic);
    ReactDOM.render(React.createElement(UploadImage, { imgSrc: data.account.profilePic, csrf: csrf }), document.querySelector("#profilePic"));
  });
};

var UploadImage = function UploadImage(props) {
  // console.log("props.imgSrc UploadImage()", props.imgSrc);
  return React.createElement(
    "div",
    null,
    React.createElement(
      "h3",
      null,
      "Profile Picture"
    ),
    React.createElement("img", {
      // src="./assets/img/propic.jpg"
      src: "retrieve?_id=" + props.imgSrc,
      alt: "profile pic",
      className: "changeProfilePic"
    }),
    React.createElement(
      "form",
      {
        id: "uploadForm",
        action: "/upload",
        method: "POST",
        encType: "multipart/form-data"
      },
      React.createElement("input", { type: "file", name: "sampleFile" }),
      React.createElement("input", { type: "submit", value: "Upload" }),
      React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf })
    )
  );
};

var UploadContentImage = function UploadContentImage(props) {
  return React.createElement(
    "div",
    null,
    React.createElement(
      "form",
      {
        id: "uploadContentImageForm",
        action: "/upload/contentImage",
        method: "POST",
        encType: "multipart/form-data"
      },
      React.createElement("input", { type: "file", id: "fileInput", name: "sampleFile" }),
      React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf })
    )
  );
};

// Sends a GET request to the server to retrieve all pawposts
var loadProfilePawpostsFromServer = function loadProfilePawpostsFromServer(csrf, imgSrc) {
  sendAjax("GET", "/getPawposts", null, function (data) {
    console.log("data.pawposts: ", data.pawposts);
    ReactDOM.render(React.createElement(PawpostList, { imgSrc: imgSrc, pawposts: data.pawposts, csrf: csrf }), document.querySelector("#pawposts"));
  });
};

var loadPawpostsAndProfilePic = function loadPawpostsAndProfilePic(csrf) {
  sendAjax("GET", "/getPawposts", null, function (pawpostData) {
    // console.log("pawpostData.pawposts: ", pawpostData.pawposts);

    sendAjax("GET", "/profilePic?username=" + pawpostData.pawposts[0].username, null, function (data) {
      ReactDOM.render(React.createElement(PawpostForm, { imgSrc: data.account.profilePic, csrf: csrf }), document.querySelector("#makePawpost"));

      ReactDOM.render(React.createElement(PawpostList, {
        imgSrc: data.account.profilePic,
        pawposts: pawpostData.pawposts,
        csrf: csrf
      }), document.querySelector("#pawposts"));
    });
  });
};

var loadFeedAndProfilePic = function loadFeedAndProfilePic(csrf) {
  sendAjax("GET", "/allPawposts", null, function (pawpostData) {
    // console.log("pawpostData.pawposts: ", pawpostData.pawposts);
    var users = pawpostData.pawposts.map(function (pawpost) {
      return pawpost.username;
    });

    users.forEach(function (user) {
      sendAjax("GET", "/profilePic?username=" + user, null, function (data) {
        console.log("user: " + user + " data: " + data.account.profilePic);
        ReactDOM.render(React.createElement(PawpostsInFeed, {
          imgSrc: data.account.profilePic,
          pawposts: pawpostData.pawposts,
          csrf: csrf
        }), document.querySelector("#pawposts"));

        // $(".feedProfilePic")[3].src = `retrieve?_id=${data.account.profilePic}`;
      });

      // console.log("getUsername: ", getUsername);
      // sendAjax("GET", `/profilePic?username=${getUsername}`, null, data => {
      //   ReactDOM.render(
      //     <PawpostsInFeed
      //       imgSrc={data.account.profilePic}
      //       pawposts={pawpostData.pawposts}
      //       csrf={csrf}
      //     />,
      //     document.querySelector("#pawposts")
      //   );
      // });
    });
  });
};

var loadFeedPawpostsFromServer = function loadFeedPawpostsFromServer(csrf) {
  sendAjax("GET", "/allPawposts", null, function (data) {
    console.log("data.pawposts all", data.pawposts);
    ReactDOM.render(React.createElement(PawpostsInFeed, { pawposts: data.pawposts, csrf: csrf }), document.querySelector("#pawposts"));
  });
};

// Renders the CreatePawpostContainer component on the scrreen
var createFeedWindow = function createFeedWindow(csrf) {
  ReactDOM.render(React.createElement(CreateFeedContainer, { imgSrc: "", pawposts: [], csrf: csrf }), document.querySelector("#content"));

  loadFeedPawpostsFromServer(csrf);
  // loadFeedAndProfilePic(csrf);
};

// Renders the ChangePassword component on the screen
var createSettingsWindow = function createSettingsWindow(csrf) {
  ReactDOM.render(React.createElement(ChangeSettingsContainer, { imgSrc: "", csrf: csrf }), document.querySelector("#content"));

  getProfilePic(csrf);
};

var createProfileWindow = function createProfileWindow(csrf) {
  ReactDOM.render(React.createElement(CreatePawpostContainer, { imgSrc: "", pawposts: [], csrf: csrf }), document.querySelector("#content"));

  // loadProfilePawpostsFromServer(csrf);
  loadPawpostsAndProfilePic(csrf);
};

// Renders the feed or settings components based on which button is
// clicked in the nav. The default appearance of the "/feed" page
// should display the feed + pawpost content.
var setup = function setup(csrf) {
  var feedButton = document.querySelector("#feedButton");
  var profileButton = document.querySelector("#profileButton");
  var settingsButton = document.querySelector("#settingsButton");
  feedButton.addEventListener("click", function (e) {
    e.preventDefault();
    createFeedWindow(csrf);
    return false;
  });
  settingsButton.addEventListener("click", function (e) {
    e.preventDefault();
    createSettingsWindow(csrf);
    return false;
  });
  profileButton.addEventListener("click", function (e) {
    e.preventDefault();
    createProfileWindow(csrf);
    return false;
  });
  createProfileWindow(csrf); // default view
};

// Retrieves the csrf token from the server
var getToken = function getToken() {
  sendAjax("GET", "/getToken", null, function (result) {
    setup(result.csrfToken);
  });
};

$(document).ready(function () {
  getToken();
});
"use strict";

var ChangeSettingsContainer = function ChangeSettingsContainer(props) {
  return React.createElement(
    "div",
    null,
    React.createElement(
      "h2",
      { className: "pageTitle" },
      "Settings"
    ),
    React.createElement(
      "section",
      { id: "profilePic" },
      React.createElement(UploadImage, { imgSrc: props.imgSrc, csrf: props.csrf })
    ),
    React.createElement(
      "section",
      { id: "changePwd" },
      React.createElement(ChangePassword, { csrf: props.csrf })
    )
  );
};

// Displays an error message if any fields are empty. Sends
// a POST request to the server using AJAX to change the pwd.
var handleChangePassword = function handleChangePassword(e) {
  e.preventDefault();

  if ($("#currentPassword").val() == "" || $("#newPassword1").val() == "" || $("#newPassword2").val() == "") {
    handleError("All fields are required");
    $("#toastMessage").css("border-top", "5px solid #d5300d");
    $("#errorMessage").css("color", "#d5300d");
    return false;
  }

  sendAjax("POST", $("#changePasswordForm").attr("action"), $("#changePasswordForm").serialize(), function () {
    handleError("Password changed successfully");
    $("#toastMessage").css("border-top", "5px solid #358c02");
    $("#errorMessage").css("color", "#358c02");
    $("#currentPassword").val("");
    $("#newPassword1").val("");
    $("#newPassword2").val("");
  });

  return false;
};

// Contains the form to change the password on the settings page.
var ChangePassword = function ChangePassword(props) {
  return React.createElement(
    "div",
    null,
    React.createElement(
      "div",
      { className: "changePassword" },
      React.createElement(
        "h3",
        null,
        "Change password"
      ),
      React.createElement(
        "form",
        {
          id: "changePasswordForm",
          onSubmit: handleChangePassword,
          name: "changePasswordForm",
          action: "/changePassword",
          method: "POST",
          className: "changePasswordForm"
        },
        React.createElement("input", {
          id: "currentPassword",
          type: "password",
          name: "currentPassword",
          placeholder: "current password"
        }),
        React.createElement("input", {
          id: "newPassword1",
          type: "password",
          name: "newPassword1",
          placeholder: "new password"
        }),
        React.createElement("input", {
          id: "newPassword2",
          type: "password",
          name: "newPassword2",
          placeholder: "retype new password"
        }),
        React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
        React.createElement("input", {
          className: "changePasswordSubmit",
          type: "submit",
          value: "Change"
        })
      )
    )
  );
};
"use strict";

// Display a message when an error occurs
var handleError = function handleError(message) {
  $("#errorMessage").text(message);
  $("#toastMessage").animate({ bottom: "toggle" }, 250);
};

// Redirects the page to a different part of the app
var redirect = function redirect(response) {
  $("#toastMessage").animate({ bottom: "hide" }, 250);
  window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: "json",
    success: success,
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};

// Randomly loads a background image from the server
var changeBackground = function changeBackground() {
  var imgs = [];
  imgs[0] = "alexandru-zdrobau-_STvosrG-pw-unsplash.jpg";
  imgs[1] = "clement-falize-b9K_LTz079c-unsplash.jpg";
  imgs[2] = "jf-brou-915UJQaxtrk-unsplash.jpg";
  imgs[3] = "krista-mangulsone-9gz3wfHr65U-unsplash.jpg";
  imgs[4] = "ludemeula-fernandes-9UUoGaaHtNE-unsplash.jpg";
  imgs[5] = "mikhail-vasilyev-IFxjDdqK_0U-unsplash.jpg";
  imgs[6] = "ipet-photo-T-0EW-SEbsE-unsplash.jpg";
  imgs[7] = "james-barker-v3-zcCWMjgM-unsplash.jpg";
  imgs[8] = "mark-zamora-Qu-T7JOu-Iw-unsplash.jpg";
  imgs[9] = "cole-keister-cX-KEISwDIw-unsplash.jpg";
  var rand = Math.floor(Math.random() * imgs.length);
  return "./images/" + imgs[rand];
};
