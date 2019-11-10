"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var handleDomo = function handleDomo(e) {
  e.preventDefault();

  $("#domoMessage").animate({ width: "hide" }, 350);
  if ($("#domoName").val() == "" || $("#domoAge").val() == "" || $("#domoFavoriteFood").val() == "") {
    handleError("RAWR! All fields are required");
    return false;
  }

  sendAjax("POST", $("#domoForm").attr("action"), $("#domoForm").serialize(), function () {
    loadDomosFromServer();
  });

  return false;
};

var DomoForm = function DomoForm(props) {
  return React.createElement(
    "form",
    {
      id: "domoForm",
      onSubmit: handleDomo,
      name: "domoForm",
      action: "/maker",
      method: "POST",
      className: "domoForm"
    },
    React.createElement(
      "label",
      { htmlFor: "name" },
      "Name: "
    ),
    React.createElement("input", { id: "domoName", type: "text", name: "name", placeholder: "Domo Name" }),
    React.createElement(
      "label",
      { htmlFor: "age" },
      "Age: "
    ),
    React.createElement("input", { id: "domoAge", type: "text", name: "age", placeholder: "Domo Age" }),
    React.createElement(
      "label",
      { htmlFor: "favoriteFood" },
      "Favorite food: "
    ),
    React.createElement("input", {
      id: "domoFavoriteFood",
      type: "text",
      name: "favoriteFood",
      placeholder: "Domo Favorite Food"
    }),
    React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
    React.createElement("input", { className: "makeDomoSubmit", type: "submit", value: "Make Domo" })
  );
};

var handlePawpost = function handlePawpost(e) {
  e.preventDefault();

  $("#domoMessage").animate({ width: "hide" }, 350);
  console.log($("#pawpostContent").val());
  if ($("#pawpostContent").val() == "") {
    handleError("Content is empty!");
    return false;
  }

  sendAjax("POST", $("#pawpostForm").attr("action"), $("#pawpostForm").serialize(), function () {
    loadPawpostsFromServer();
  });

  return false;
};

var PawpostForm = function PawpostForm(props) {
  return React.createElement(
    "div",
    { className: "formLayout" },
    React.createElement("img", { className: "profilePic", src: "./assets/img/cookie.jpg" }),
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
        id: "content",
        placeholder: "What's on your mind?",
        name: "content"
      }),
      React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
      React.createElement("input", { className: "makePawpostSubmit", type: "submit", value: "Post" })
    )
  );
};

var PawpostList = function PawpostList(props) {
  console.log("props.pawposts", props.pawposts);
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
    return React.createElement(
      "div",
      { key: pawpost._id, className: "pawpost" },
      React.createElement("img", {
        src: "./assets/img/cookie.jpg",
        alt: "profile pic",
        className: "profilePic"
      }),
      React.createElement(
        "p",
        null,
        "Cookie updated their status."
      ),
      React.createElement(
        "h3",
        { className: "pawpostContent" },
        pawpost.content
      ),
      React.createElement(
        "h3",
        { className: "pawpostContentImg" },
        pawpost.contentImg
      )
    );
  });

  return React.createElement(
    "div",
    { className: "pawpostList" },
    pawpostNodes
  );
};

var DomoList = function DomoList(props) {
  if (props.domos.length === 0) {
    return React.createElement(
      "div",
      { className: "domosList" },
      React.createElement(
        "h3",
        { className: "emptyDomo" },
        "No Domos yet"
      )
    );
  }

  // make a GET request to get another csrf token back
  var domoNodes = props.domos.map(function (domo) {
    return React.createElement(
      "div",
      {
        key: domo._id,
        className: "domo",
        onClick: function onClick(e) {
          ReactDOM.render(React.createElement(EditDomo, { domos: domo, csrf: props.csrf }), e.target.querySelector("#renderModal"));
        }
      },
      React.createElement("div", { id: "renderModal" }),
      React.createElement("img", {
        src: "/assets/img/domoface.jpeg",
        alt: "domo face",
        className: "domoFace"
      }),
      React.createElement(
        "h3",
        { className: "domoName" },
        "Name: ",
        domo.name
      ),
      React.createElement(
        "h3",
        { className: "domoAge" },
        "Age: ",
        domo.age
      ),
      React.createElement(
        "h3",
        { className: "domoFavoriteFood" },
        "Favorite food: ",
        domo.favoriteFood
      )
    );
  });

  return React.createElement(
    "div",
    { className: "domoList" },
    domoNodes
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

      // The gray background
      var backdropStyle = {
        position: "fixed",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "rgba(0,0,0,0.3)",
        padding: 50
      };

      // The modal "window"
      var modalStyle = {
        backgroundColor: "#fff",
        borderRadius: 5,
        maxWidth: 500,
        minHeight: 300,
        margin: "0 auto",
        padding: 30
      };

      return React.createElement(
        "div",
        { className: "backdrop", style: { backdropStyle: backdropStyle } },
        React.createElement(
          "div",
          { className: "modal", style: { modalStyle: modalStyle } },
          this.props.children,
          React.createElement(
            "div",
            { className: "footer" },
            React.createElement(
              "button",
              { onClick: this.props.onClose },
              "Close"
            )
          )
        )
      );
    }
  }]);

  return Modal;
}(React.Component);

var handleEditDomo = function handleEditDomo(e) {
  e.preventDefault();

  $("#domoMessage").animate({ width: "hide" }, 350);
  if ($("#domoNameEdit").val() == "" || $("#domoAgeEdit").val() == "" || $("#domoFavoriteFoodEdit").val() == "") {
    handleError("RAWR! All fields are required");
    return false;
  }

  sendAjax("POST", $("#domoFormEdit").attr("action"), $("#domoFormEdit").serialize(), function () {
    loadDomosFromServer();
  });

  return false;
};

var EditDomo = function (_React$Component2) {
  _inherits(EditDomo, _React$Component2);

  function EditDomo(props) {
    _classCallCheck(this, EditDomo);

    var _this2 = _possibleConstructorReturn(this, (EditDomo.__proto__ || Object.getPrototypeOf(EditDomo)).call(this, props));

    _this2.state = { isOpen: false, domos: props.domos, csrf: props.csrf };
    _this2.toggleModal = _this2.toggleModal.bind(_this2);
    return _this2;
  }

  _createClass(EditDomo, [{
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
          { onClick: this.toggleModal },
          "Edit Domo"
        ),
        React.createElement(
          Modal,
          { show: this.state.isOpen, onClose: this.toggleModal },
          React.createElement(
            "form",
            {
              id: "domoFormEdit",
              onSubmit: handleEditDomo,
              name: "domoForm",
              action: "/updateDomo",
              method: "POST"
            },
            React.createElement(
              "label",
              { htmlFor: "name" },
              "Name: "
            ),
            React.createElement("input", {
              id: "domoNameEdit",
              type: "text",
              name: "name",
              placeholder: this.state.domos.name
            }),
            React.createElement("br", null),
            React.createElement(
              "label",
              { htmlFor: "age" },
              "Age: "
            ),
            React.createElement("input", {
              id: "domoAgeEdit",
              type: "text",
              name: "age",
              placeholder: this.state.domos.age
            }),
            React.createElement("br", null),
            React.createElement(
              "label",
              { htmlFor: "favoriteFood" },
              "Favorite food: "
            ),
            React.createElement("input", {
              id: "domoFavoriteFoodEdit",
              type: "text",
              name: "favoriteFood",
              placeholder: this.state.domos.favoriteFood
            }),
            React.createElement("br", null),
            React.createElement("input", { type: "hidden", name: "_csrf", value: this.state.csrf }),
            React.createElement("input", { type: "hidden", name: "_id", value: this.state.domos._id }),
            React.createElement("input", {
              className: "makeDomoSubmit",
              type: "submit",
              value: "Update Domo"
            })
          )
        )
      );
    }
  }]);

  return EditDomo;
}(React.Component);

var loadDomosFromServer = function loadDomosFromServer(csrf) {
  sendAjax("GET", "/getDomos", null, function (data) {
    ReactDOM.render(React.createElement(DomoList, { domos: data.domos, csrf: csrf }), document.querySelector("#domos"));
  });
};

var loadPawpostsFromServer = function loadPawpostsFromServer(csrf) {
  console.log("inside loadPawpostsFromServer");
  sendAjax("GET", "/getPawposts", null, function (data) {
    ReactDOM.render(React.createElement(PawpostList, { pawposts: data.pawposts, csrf: csrf }), document.querySelector("#pawposts"));
  });
};

var setup = function setup(csrf) {
  ReactDOM.render(React.createElement(DomoForm, { csrf: csrf }), document.querySelector("#makeDomo"));

  ReactDOM.render(React.createElement(DomoList, { domos: [], csrf: csrf }), document.querySelector("#domos"));

  ReactDOM.render(React.createElement(PawpostForm, { csrf: csrf }), document.querySelector("#makePawpost"));

  ReactDOM.render(React.createElement(PawpostList, { pawposts: [], csrf: csrf }), document.querySelector("#pawposts"));

  loadDomosFromServer(csrf);
  loadPawpostsFromServer(csrf);
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

var handleError = function handleError(message) {
  $("#errorMessage").text(message);
  $("#domoMessage").animate({ width: "toggle" }, 350);
};

var redirect = function redirect(response) {
  $("#domoMessage").animate({ width: "hide" }, 350);
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
