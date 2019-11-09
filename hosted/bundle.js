"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// import Modal from "./Modal";
// import useModal from "./useModal";

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

// can pass in e instead and query select the id of the event to get the domo info
// const handleClick = domo => {
//   // console.log("12345", e.target.querySelector("#renderModal"));
//   console.log(
//     "document.querySelector('#renderModal')",
//     document.querySelector("#renderModal")
//   );
//   // console.log("e.target: ", e.target);
//   ReactDOM.render(
//     <EditDomo domos={domo} />,
//     //e.target.querySelector("#renderModal")
//     document.querySelector("#renderModal")
//   );
// };

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
          // console.log(
          //   "document.querySelector('#renderModal')",
          //   document.querySelector("#renderModal")
          // );
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

// class DomoList extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = { domos: props.domos, isOpen: false };
//     this.toggleModal = this.toggleModal.bind(this);
//     this.loadDomosFromServer = this.loadDomosFromServer.bind(this);
//     this.loadDomosFromServer();
//   }

//   toggleModal() {
//     this.setState({ isOpen: !this.state.isOpen });
//   }

//   loadDomosFromServer() {
//     sendAjax("GET", "/getDomos", null, data => {
//       ReactDOM.render(
//         <DomoList domos={data.domos} />,
//         document.querySelector("#domos")
//       );

//       this.setState({ domos: data.domos });
//     });
//   }

//   render() {
//     console.log("state", this.state);
//     // original above
//     if (this.state.domos.length === 0) {
//       return (
//         <div className="domosList">
//           <h3 className="emptyDomo">No Domos yet</h3>
//         </div>
//       );
//     }

//     const test = () => {
//       return this.toggleModal();
//     };

//     const getState = () => {
//       return this.state;
//     };

//     const domoNodes = this.state.domos.map(function(domo) {
//       return (
//         <div key={domo._id} className="domo" onClick={test}>
//           {getState.isOpen ? (
//             <Modal show={getState.isOpen} onClose={test}>
//               Here's some content for the modal
//             </Modal>
//           ) : (
//             <div>
//               <img
//                 src="/assets/img/domoface.jpeg"
//                 alt="domo face"
//                 className="domoFace"
//               />
//               <h3 className="domoName">Name: {domo.name}</h3>
//               <h3 className="domoAge">Age: {domo.age}</h3>
//               <h3 className="domoFavoriteFood">
//                 Favorite food: {domo.favoriteFood}
//               </h3>
//             </div>
//           )}
//         </div>
//       );
//     });

//     return <div className="domoList">{domoNodes}</div>;
//   }
// }

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
            React.createElement("input", { className: "makeDomoSubmit", type: "submit", value: "Make Domo" })
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

var setup = function setup(csrf) {
  ReactDOM.render(React.createElement(DomoForm, { csrf: csrf }), document.querySelector("#makeDomo"));

  ReactDOM.render(React.createElement(DomoList, { domos: [], csrf: csrf }), document.querySelector("#domos"));
  // ReactDOM.render(<EditDomo domos={[]} />, document.querySelector("#domos"));

  loadDomosFromServer(csrf);
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
