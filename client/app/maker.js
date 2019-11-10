const handleDomo = e => {
  e.preventDefault();

  $("#domoMessage").animate({ width: "hide" }, 350);
  if (
    $("#domoName").val() == "" ||
    $("#domoAge").val() == "" ||
    $("#domoFavoriteFood").val() == ""
  ) {
    handleError("RAWR! All fields are required");
    return false;
  }

  sendAjax(
    "POST",
    $("#domoForm").attr("action"),
    $("#domoForm").serialize(),
    function() {
      loadDomosFromServer();
    }
  );

  return false;
};

const DomoForm = props => {
  return (
    <form
      id="domoForm"
      onSubmit={handleDomo}
      name="domoForm"
      action="/maker"
      method="POST"
      className="domoForm"
    >
      <label htmlFor="name">Name: </label>
      <input id="domoName" type="text" name="name" placeholder="Domo Name" />
      <label htmlFor="age">Age: </label>
      <input id="domoAge" type="text" name="age" placeholder="Domo Age" />
      <label htmlFor="favoriteFood">Favorite food: </label>
      <input
        id="domoFavoriteFood"
        type="text"
        name="favoriteFood"
        placeholder="Domo Favorite Food"
      />
      <input type="hidden" name="_csrf" value={props.csrf} />
      <input className="makeDomoSubmit" type="submit" value="Make Domo" />
    </form>
  );
};

const handlePawpost = e => {
  e.preventDefault();

  $("#domoMessage").animate({ width: "hide" }, 350);
  console.log($("#pawpostContent").val());
  if ($("#pawpostContent").val() == "") {
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
    return (
      <div key={pawpost._id} className="pawpost">
        <img
          src="./assets/img/cookie.jpg"
          alt="profile pic"
          className="profilePic"
        />
        <p>Cookie updated their status.</p>
        <h3 className="pawpostContent">{pawpost.content}</h3>
        <h3 className="pawpostContentImg">{pawpost.contentImg}</h3>
      </div>
    );
  });

  return <div className="pawpostList">{pawpostNodes}</div>;
};

const DomoList = function(props) {
  if (props.domos.length === 0) {
    return (
      <div className="domosList">
        <h3 className="emptyDomo">No Domos yet</h3>
      </div>
    );
  }

  // make a GET request to get another csrf token back
  const domoNodes = props.domos.map(function(domo) {
    return (
      <div
        key={domo._id}
        className="domo"
        onClick={e => {
          ReactDOM.render(
            <EditDomo domos={domo} csrf={props.csrf} />,
            e.target.querySelector("#renderModal")
          );
        }}
      >
        <div id="renderModal" />
        <img
          src="/assets/img/domoface.jpeg"
          alt="domo face"
          className="domoFace"
        />
        <h3 className="domoName">Name: {domo.name}</h3>
        <h3 className="domoAge">Age: {domo.age}</h3>
        <h3 className="domoFavoriteFood">Favorite food: {domo.favoriteFood}</h3>
      </div>
    );
  });

  return <div className="domoList">{domoNodes}</div>;
};

class Modal extends React.Component {
  render() {
    // Render nothing if the "show" prop is false
    if (!this.props.show) {
      return null;
    }

    // The gray background
    const backdropStyle = {
      position: "fixed",
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: "rgba(0,0,0,0.3)",
      padding: 50
    };

    // The modal "window"
    const modalStyle = {
      backgroundColor: "#fff",
      borderRadius: 5,
      maxWidth: 500,
      minHeight: 300,
      margin: "0 auto",
      padding: 30
    };

    return (
      <div className="backdrop" style={{ backdropStyle }}>
        <div className="modal" style={{ modalStyle }}>
          {this.props.children}
          <div className="footer">
            <button onClick={this.props.onClose}>Close</button>
          </div>
        </div>
      </div>
    );
  }
}

const handleEditDomo = e => {
  e.preventDefault();

  $("#domoMessage").animate({ width: "hide" }, 350);
  if (
    $("#domoNameEdit").val() == "" ||
    $("#domoAgeEdit").val() == "" ||
    $("#domoFavoriteFoodEdit").val() == ""
  ) {
    handleError("RAWR! All fields are required");
    return false;
  }

  sendAjax(
    "POST",
    $("#domoFormEdit").attr("action"),
    $("#domoFormEdit").serialize(),
    function() {
      loadDomosFromServer();
    }
  );

  return false;
};

class EditDomo extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isOpen: false, domos: props.domos, csrf: props.csrf };
    this.toggleModal = this.toggleModal.bind(this);
  }

  toggleModal() {
    this.setState({ isOpen: !this.state.isOpen });
  }

  render() {
    console.log(this.state);

    return (
      <div>
        <button onClick={this.toggleModal}>Edit Domo</button>

        <Modal show={this.state.isOpen} onClose={this.toggleModal}>
          <form
            id="domoFormEdit"
            onSubmit={handleEditDomo}
            name="domoForm"
            action="/updateDomo"
            method="POST"
          >
            <label htmlFor="name">Name: </label>
            <input
              id="domoNameEdit"
              type="text"
              name="name"
              placeholder={this.state.domos.name}
            />
            <br />
            <label htmlFor="age">Age: </label>
            <input
              id="domoAgeEdit"
              type="text"
              name="age"
              placeholder={this.state.domos.age}
            />
            <br />
            <label htmlFor="favoriteFood">Favorite food: </label>
            <input
              id="domoFavoriteFoodEdit"
              type="text"
              name="favoriteFood"
              placeholder={this.state.domos.favoriteFood}
            />
            <br />
            <input type="hidden" name="_csrf" value={this.state.csrf} />
            <input type="hidden" name="_id" value={this.state.domos._id} />
            <input
              className="makeDomoSubmit"
              type="submit"
              value="Update Domo"
            />
          </form>
        </Modal>
      </div>
    );
  }
}

const loadDomosFromServer = csrf => {
  sendAjax("GET", "/getDomos", null, data => {
    ReactDOM.render(
      <DomoList domos={data.domos} csrf={csrf} />,
      document.querySelector("#domos")
    );
  });
};

const loadPawpostsFromServer = csrf => {
  console.log("inside loadPawpostsFromServer");
  sendAjax("GET", "/getPawposts", null, data => {
    ReactDOM.render(
      <PawpostList pawposts={data.pawposts} csrf={csrf} />,
      document.querySelector("#pawposts")
    );
  });
};

const setup = function(csrf) {
  ReactDOM.render(
    <DomoForm csrf={csrf} />,
    document.querySelector("#makeDomo")
  );

  ReactDOM.render(
    <DomoList domos={[]} csrf={csrf} />,
    document.querySelector("#domos")
  );

  ReactDOM.render(
    <PawpostForm csrf={csrf} />,
    document.querySelector("#makePawpost")
  );

  ReactDOM.render(
    <PawpostList pawposts={[]} csrf={csrf} />,
    document.querySelector("#pawposts")
  );

  loadDomosFromServer(csrf);
  loadPawpostsFromServer(csrf);
};

const getToken = () => {
  sendAjax("GET", "/getToken", null, result => {
    setup(result.csrfToken);
  });
};

$(document).ready(function() {
  getToken();
});
