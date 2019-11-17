const handleError = message => {
  $("#errorMessage").text(message);
  // $("#toastMessage").animate({ width: "toggle" }, 350);
  $("#toastMessage").animate({ bottom: "toggle" }, 250);
};

const redirect = response => {
  // $("#toastMessage").animate({ width: "hide" }, 350);
  $("#toastMessage").animate({ bottom: "hide" }, 250);
  window.location = response.redirect;
};

const sendAjax = (type, action, data, success) => {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: "json",
    success: success,
    error: function(xhr, status, error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};

const changeBackground = () => {
  let imgs = [];
  imgs[0] = "alexandru-zdrobau-_STvosrG-pw-unsplash.jpg";
  imgs[1] = "clement-falize-b9K_LTz079c-unsplash.jpg";
  imgs[2] = "jf-brou-915UJQaxtrk-unsplash.jpg";
  imgs[3] = "krista-mangulsone-9gz3wfHr65U-unsplash.jpg";
  imgs[4] = "ludemeula-fernandes-9UUoGaaHtNE-unsplash.jpg";
  imgs[5] = "mikhail-vasilyev-IFxjDdqK_0U-unsplash.jpg";
  let rand = Math.floor(Math.random() * imgs.length);

  console.log(rand);

  console.log(`./../hosted/img/${imgs[rand]}`);
  // /Users/sky/Documents/School/IGME-430/pawprints/hosted/img/alexandru-zdrobau-_STvosrG-pw-unsplash.jpg
  // /Users/sky/Documents/School/IGME-430/pawprints/client/helper/helper.js
  return `./../hosted/img/${imgs[rand]}`;
};
