// Add more structure to the app.handlebars page and render
// the PawpostForm and PawpostList components
const CreatePawpostContainer = props => {
  return (
    <div>
      <h2 className="pageTitle">Profile</h2>
      <section id="makePawpost">
        <PawpostForm imgSrc={props.imgSrc} csrf={props.csrf} />
      </section>
      <section id="pawposts">
        {/* <PawpostList imgSrc={props.imgSrc} pawposts={[]} csrf={props.csrf} /> */}
        <TestComponent
          imgSrc={props.imgSrc}
          pawposts={[]}
          csrf={props.csrf}
          isFeed={false}
        />
      </section>
    </div>
  );
};

// Renders all the pawposts from all users to /feed page
const CreateFeedContainer = props => {
  return (
    <div>
      <h2 className="pageTitle">Feed</h2>
      <section id="pawposts">
        {/* <PawpostsInFeed pawposts={[]} csrf={props.csrf} /> */}
        <TestComponent
          imgSrc={""}
          pawposts={[]}
          csrf={props.csrf}
          isFeed={true}
        />
      </section>
    </div>
  );
};

// Renders the component to upload profile image and change account password
const ChangeSettingsContainer = props => {
  return (
    <div>
      <h2 className="pageTitle">Settings</h2>
      <section id="profilePic">
        <UploadProfileImage imgSrc={props.imgSrc} csrf={props.csrf} />
      </section>
      <section id="changePwd">
        <ChangePassword csrf={props.csrf} />
      </section>
    </div>
  );
};

// Renders the CreatePawpostContainer component on the scrreen
const createFeedWindow = csrf => {
  ReactDOM.render(
    <CreateFeedContainer imgSrc={""} pawposts={[]} csrf={csrf} />,
    document.querySelector("#content")
  );

  loadFeedPawpostsFromServer(csrf);
};

// Renders the ChangeSettningsContainer component on the screen
const createSettingsWindow = csrf => {
  ReactDOM.render(
    <ChangeSettingsContainer imgSrc={""} csrf={csrf} />,
    document.querySelector("#content")
  );

  getProfilePic(csrf);
};

// Renders the CreatePawpostContainer on the screen
const createProfileWindow = csrf => {
  ReactDOM.render(
    <CreatePawpostContainer imgSrc={""} pawposts={[]} csrf={csrf} />,
    document.querySelector("#content")
  );

  loadPawpostsAndProfilePic(csrf);
};
