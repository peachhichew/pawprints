"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CreatePawpostContainer = function CreatePawpostContainer(props) {
  console.log("csrf", props.csrf);
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
      { id: "makePawpost" },
      React.createElement(PawpostForm, { csrf: props.csrf })
    ),
    React.createElement(
      "section",
      { id: "pawposts" },
      React.createElement(PawpostList, { pawposts: [], csrf: props.csrf })
    )
  );
};

var handlePawpost = function handlePawpost(e) {
  e.preventDefault();

  $("#toastMessage").animate({ bottom: "hide" }, 250);

  console.log("postContent: ", $("#postContent").val());

  console.log("content empty?", $("#postContent").val() == "");
  if ($("#postContent").val() == "") {
    handleError("Content is empty!");
    return false;
  }

  sendAjax("POST", $("#pawpostForm").attr("action"), $("#pawpostForm").serialize(), function () {
    loadPawpostsFromServer();
  });

  $("#postContent").val("");

  return false;
};

var PawpostForm = function PawpostForm(props) {
  console.log("props.csrf", props.csrf);
  return React.createElement(
    "div",
    { className: "formLayout" },
    React.createElement("img", { className: "profilePic", src: "./assets/img/propic.jpg" }),
    React.createElement(
      "form",
      {
        id: "pawpostForm",
        onSubmit: handlePawpost,
        name: "pawpostForm",
        action: "/feed",
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
      React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
      React.createElement("input", { className: "makePawpostSubmit", type: "submit", value: "Post" })
    )
  );
};

var PawpostList = function PawpostList(props) {
  console.log("props.pawposts", props.pawposts);
  console.log("props.csrf in pawpostList", props.csrf);
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
        src: "./assets/img/propic.jpg",
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
      React.createElement(EditPawpost, { pawposts: pawpost, csrf: props.csrf })
    );
  });

  return React.createElement(
    "div",
    { className: "pawpostList" },
    pawpostNodes.reverse()
  );
};

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

var handleEditPawpost = function handleEditPawpost(e) {
  e.preventDefault();

  $("#toastMessage").animate({ bottom: "hide" }, 250);

  console.log("inside contentEdit", $("#contentEdit").val());
  if ($("#contentEdit").val() == "") {
    handleError("All fields are required");
    return false;
  }

  sendAjax("POST", $("#pawpostFormEdit").attr("action"), $("#pawpostFormEdit").serialize(), function () {
    loadPawpostsFromServer();
  });

  return false;
};

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
      console.log(this.state);

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
            React.createElement("textarea", {
              rows: "5",
              cols: "68",
              id: "contentEdit",
              placeholder: this.state.pawposts.content,
              name: "contentEdit"
            }),
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

var loadPawpostsFromServer = function loadPawpostsFromServer(csrf) {
  console.log("inside loadPawpostsFromServer");
  sendAjax("GET", "/getPawposts", null, function (data) {
    ReactDOM.render(React.createElement(PawpostList, { pawposts: data.pawposts, csrf: csrf }), document.querySelector("#pawposts"));
  });
};

var createFeedWindow = function createFeedWindow(csrf) {
  ReactDOM.render(React.createElement(CreatePawpostContainer, { pawposts: [], csrf: csrf }), document.querySelector("#content"));

  loadPawpostsFromServer(csrf);

  console.log("feedWindow csrf", csrf);
};

var createSettingsWindow = function createSettingsWindow(csrf) {
  ReactDOM.render(React.createElement(ChangePassword, { csrf: csrf }), document.querySelector("#content"));
};

var setup = function setup(csrf) {
  console.log("setup csrf", csrf);
  var feedButton = document.querySelector("#feedButton");
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
  createFeedWindow(csrf); // default view
};

var getToken = function getToken() {
  sendAjax("GET", "/getToken", null, function (result) {
    setup(result.csrfToken);
  });
};

$(document).ready(function () {
  getToken();
});
"use strict";

var handleChangePassword = function handleChangePassword(e) {
  console.log("change password");
  e.preventDefault();

  console.log("current pwd:", $("#currentPassword").val());
  console.log("new pwd:", $("#newPassword1").val());
  console.log("new pwd 2:", $("#newPassword1").val());
  if ($("#currentPassword").val() == "" || $("#newPassword1").val() == "" || $("#newPassword2").val() == "") {
    handleError("All fields are required");
    return false;
  }

  sendAjax("POST", $("#changePasswordForm").attr("action"), $("#changePasswordForm").serialize(), function () {
    console.log("meow");
  });

  return false;
};

var ChangePassword = function ChangePassword(props) {
  return React.createElement(
    "div",
    null,
    React.createElement(
      "h2",
      { className: "pageTitle" },
      "Settings"
    ),
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

var handleError = function handleError(message) {
  $("#errorMessage").text(message);
  $("#toastMessage").animate({ bottom: "toggle" }, 250);
};

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

var changeBackground = function changeBackground() {
  var imgs = [];
  imgs[0] = "alexandru-zdrobau-_STvosrG-pw-unsplash.jpg";
  imgs[1] = "clement-falize-b9K_LTz079c-unsplash.jpg";
  imgs[2] = "jf-brou-915UJQaxtrk-unsplash.jpg";
  imgs[3] = "krista-mangulsone-9gz3wfHr65U-unsplash.jpg";
  imgs[4] = "ludemeula-fernandes-9UUoGaaHtNE-unsplash.jpg";
  imgs[5] = "mikhail-vasilyev-IFxjDdqK_0U-unsplash.jpg";
  var rand = Math.floor(Math.random() * imgs.length);
  return "./images/" + imgs[rand];
};
