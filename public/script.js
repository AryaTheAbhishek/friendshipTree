var firebaseConfig = {
  apiKey: "AIzaSyCny2DIk7IlHZxZsKtmzl0DVJurj9Zj6YE",
  authDomain: "frienzshipday.firebaseapp.com",
  databaseURL: "https://frienzshipday.firebaseio.com",
  projectId: "frienzshipday",
  storageBucket: "frienzshipday.appspot.com",
  messagingSenderId: "139231808706",
  appId: "1:139231808706:web:93695b07cf18cb4fb77f5b"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var database = firebase.database();

const inpFile = document.getElementById('inpFile');
const previewContainer = document.getElementById('imagePreview');
const previewImage = previewContainer.querySelector('.image-preview__image');
const previewDefaultText = previewContainer.querySelector('.image-preview__default-text');

var file;
var srcEncoded;

inpFile.addEventListener('change', function(){
  file = this.files[0];
  if (file) {
    const reader = new FileReader();

    previewDefaultText.style.display = 'none';
    previewImage.style.display = 'block';

    reader.addEventListener('load', function(){
      previewImage.setAttribute('src', this.result);
    });
    reader.readAsDataURL(file);

    reader.addEventListener('load', function(event){
      const imgElement = document.createElement('img');
      imgElement.src = event.target.result;
      imgElement.addEventListener('load', function(e){
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 400;

        const scaleSize = MAX_WIDTH / e.target.width;
        canvas.width = MAX_WIDTH;
        canvas.height = e.target.height * scaleSize;

        const ctx = canvas.getContext('2d');

        ctx.drawImage(e.target, 0, 0, canvas.width, canvas.height);

        srcEncoded = ctx.canvas.toDataURL(e.target, 'image/jpeg');

      });
    });

  } else {
    previewDefaultText.style.display = null;
    previewImage.style.display = null;
    previewImage.setAttribute('src', '');
  }

});



const inpFileFd = document.getElementById('inpFileFd');
const previewContainerFd = document.getElementById('imagePreviewFd');
const previewImageFd = previewContainerFd.querySelector('.image-preview__image');
const previewDefaultTextFd = previewContainerFd.querySelector('.image-preview__default-text');

inpFileFd.addEventListener('change', function(){
  file = this.files[0];
  if (file) {
    const reader = new FileReader();

    previewDefaultTextFd.style.display = 'none';
    previewImageFd.style.display = 'block';

    reader.addEventListener('load', function(){
      previewImageFd.setAttribute('src', this.result);
    });
    reader.readAsDataURL(file);

    reader.addEventListener('load', function(event){
      const imgElement = document.createElement('img');
      imgElement.src = event.target.result;
      imgElement.addEventListener('load', function(e){
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 400;

        const scaleSize = MAX_WIDTH / e.target.width;
        canvas.width = MAX_WIDTH;
        canvas.height = e.target.height * scaleSize;

        const ctx = canvas.getContext('2d');

        ctx.drawImage(e.target, 0, 0, canvas.width, canvas.height);

        srcEncoded = ctx.canvas.toDataURL(e.target, 'image/jpeg');

      });
    });

  } else {
    previewDefaultTextFd.style.display = null;
    previewImageFd.style.display = null;
    previewImageFd.setAttribute('src', '');
  }
  
});

//Function for new user registation
function newUserReg(e){
  e.preventDefault();

  let newUserMailIdPre = document.getElementById("newUsrMail").value;
  let newUserMailId = newUserMailIdPre.toLowerCase();
  let newUserName = document.getElementById("newUsrName").value;
  document.getElementById("newUsrMail").value = '';
  document.getElementById("newUsrName").value = '';

  var encd = encodeURIComponent(newUserMailId);
  var uid = encd.replace(/\./g, '&');

  // console.log(srcEncoded);

  firebase.database().ref(`users/${uid}`).once("value", snapshot => {
    if (snapshot.exists()){
      alert('Already Registered.!! Please login or try another ID');
    }
    else {

      if(typeof file !== "undefined"){

        var storageRef = firebase.storage().ref('userImg').child(uid);
        var thisRef = storageRef.child(file.name);
        var uploadTask = thisRef.putString(srcEncoded, 'data_url');

        uploadTask.on('state_changed', function(snapshot){
          var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

          document.getElementsByClassName('usrLoginSecC')[0].style.display = 'none';
          document.getElementsByClassName('imgUpStatusCls')[0].style.display = 'block';
          document.getElementById('imgUpStatus').textContent = Math.trunc(progress);

        }, function(error){

        }, function(){

          document.getElementsByClassName('imgUpStatusCls')[0].style.display = null;
          hvToShowDetails(newUserMailId,newUserName);

          uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {

            firebase.database().ref('users').child(uid).set({
              email: newUserMailId,
              name: newUserName,
              proPicUrl: downloadURL
            });
            var newUsrImage = document.getElementById('usrImage')
            newUsrImage.setAttribute('src', downloadURL);
          });

        });

      }
      else {

        hvToShowDetails(newUserMailId,newUserName);

          firebase.database().ref('users').child(uid).set({
            email: newUserMailId,
            name: newUserName,
            proPicUrl: 'https://firebasestorage.googleapis.com/v0/b/frienzshipday.appspot.com/o/aa.png?alt=media&token=77d8b7e4-6e8d-4b33-b04f-afafc36148f7'
          });

          var newUsrImage = document.getElementById('usrImage')
          newUsrImage.setAttribute('src', 'https://firebasestorage.googleapis.com/v0/b/frienzshipday.appspot.com/o/aa.png?alt=media&token=77d8b7e4-6e8d-4b33-b04f-afafc36148f7');

      }

    }

  });
  document.getElementById("msgrLink").onclick = function() {
    window.open('fb-messenger://share?link=https://frienzshipday.web.app/?' + encodeURIComponent(uid) + '&app_id=' + encodeURIComponent('1:139231808706:web:93695b07cf18cb4fb77f5b'));
  }
  document.getElementById("fbLink").href = 'https://www.facebook.com/sharer/sharer.php?u=https://frienzshipday.web.app/?'+ uid;
  document.getElementById("wpLink").href = 'https://api.whatsapp.com/send?text=https://frienzshipday.web.app/?'+ uid;

  document.getElementById('shToFdLink').textContent = 'https://frienzshipday.web.app/?' + uid;

}

function hvToShowDetails(newUserMailId,newUserName){

  document.getElementById('user').textContent = newUserName;

  document.getElementsByClassName('usrLoginSecC')[0].style.display = 'none';
  document.getElementsByClassName('usrHeadC')[0].style.display = 'block';
  document.getElementsByClassName('newToWebC')[0].style.display = 'block';

}

//Function for rtesistered user
function regUserLogin(e){
  e.preventDefault();

  let regUserMailIdPre = document.getElementById("regUsrMail").value;
  let regUserMailId = regUserMailIdPre.toLowerCase();
  // document.getElementById("regUsrMail").value = '';

  var encd = encodeURIComponent(regUserMailId);
  var uid = encd.replace(/\./g, '&');

  //Check that it's already is a user
  firebase.database().ref(`users/${uid}`).on("value", snapshot => {

    document.getElementById('frzList').innerHTML = '';

    if (snapshot.exists()){
      // console.log(snapshot.val());
      document.getElementById('usrLoginName').textContent = snapshot.val().name;

      var cUpropic = snapshot.val().proPicUrl;
      var regUsrImage = document.getElementById('usrImage');
      regUsrImage.setAttribute('src', cUpropic);

      if (snapshot.child('friends').exists()){
        var myFrd = snapshot.val();
        var sFrnd = myFrd.friends;
        var totalNo = Object.keys(sFrnd);
        // console.log(totalNo);
        for (var i=0; i < totalNo.length; i++){
          var k = totalNo[i];
          var fdImage = sFrnd[k].image;
          var fdName = sFrnd[k].name;
          // console.log(fdImage,fdName);
          showDataToWeb(fdImage,fdName);
        }

      }
      else {
        document.getElementsByClassName('nofFrnd')[0].style.display = 'block';
      }

      document.getElementsByClassName('usrLoginSecC')[0].style.display = null;
      document.getElementsByClassName('takeFdInput')[0].style.display = 'none';
      document.getElementsByClassName('usrHeadC')[0].style.display = 'block';
      document.getElementsByClassName('friendsInputC')[0].style.display = 'block';
      document.getElementsByClassName('oldToWebC')[0].style.display = 'block';
      document.getElementsByClassName('frzListC')[0].style.display = 'block';
      
      document.getElementById("msgrLinkRu").onclick = function() {
        window.open('fb-messenger://share?link=https://frienzshipday.web.app/?' + encodeURIComponent(uid) + '&app_id=' + encodeURIComponent('1:139231808706:web:93695b07cf18cb4fb77f5b'));
      }
      document.getElementById("fbLinkRu").href = 'https://www.facebook.com/sharer/sharer.php?u=https://frienzshipday.web.app/?'+ uid;
      document.getElementById("wpLinkRu").href = 'https://api.whatsapp.com/send?text=https://frienzshipday.web.app/?'+ uid;

      document.getElementById('shToFdLinkRu').textContent = 'https://frienzshipday.web.app/?' + uid;

    }
    else {
      alert('You are not Registered.!! Please Register');
    }

  });

}


//Copy to clipboard function
function copyToClipboard(element) {
  var $temp = $("<input>");
  $("body").append($temp);
  $temp.val($(element).text()).select();
  document.execCommand("copy");
  $temp.remove();
  alert('Copied to clipboard.!')
}

//Friends name to the website function
function showDataToWeb(fdImage,fdName){

  let prDiv = document.createElement("div");
  let chFstDiv = document.createElement("div");
  let chSecDiv = document.createElement("div");

  prDiv.className = "friends";
  chSecDiv.className = "text-center py-2 text-xs";

  var fdImg = new Image();
  fdImg.className = "rounded-full border-4 p-0";
  fdImg.src =  fdImage; 

  let fdNm = document.createTextNode(fdName);

  chFstDiv.appendChild(fdImg);
  chSecDiv.appendChild(fdNm);

  prDiv.appendChild(chFstDiv);
  prDiv.appendChild(chSecDiv);

  document.getElementById("frzList").appendChild(prDiv);

}


//Function for add new friend and update data in friend section
function addFrzDetails(e){
  e.preventDefault();

  let addFrzName = document.getElementById("frzName").value;
  document.getElementById("frzName").value = '';

  if(typeof file !== "undefined"){

    var storageRef = firebase.storage().ref('userImg').child(fdUid);
    var usersFriends = storageRef.child('friends');
    var thisRef = usersFriends.child(file.name);
    var uploadTask = thisRef.putString(srcEncoded, 'data_url');

    uploadTask.on('state_changed', function(snapshot){
      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      // console.log('Upload is ' + progress + '% done');

      document.getElementsByClassName('imgUpStatusClsFd')[0].style.display = 'block';
      document.getElementById('imgUpStatusFd').textContent = Math.trunc(progress);

    }, function(error){

    }, function(){

      document.getElementsByClassName('imgUpStatusClsFd')[0].style.display = null;

      uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
        firebase.database().ref('users').child(fdUid).child('friends').push({
          image: downloadURL,
          name: addFrzName
        });

        firebase.database().ref(`users/${fdUid}`).on("value", snapshot => {

        document.getElementById('frzList').innerHTML = '';

          if (snapshot.exists()){
            var myFrd = snapshot.val();
            var sFrnd = myFrd.friends;
            var totalNo = Object.keys(sFrnd);
            for (var i=0; i < totalNo.length; i++){
              var k = totalNo[i];
              var fdImage = sFrnd[k].image;
              var fdName = sFrnd[k].name;
              showDataToWeb(fdImage,fdName);

            }
          }
          else {
            alert('Error to update friends list');
          }

        });

      });

    });

  }
  else {

    firebase.database().ref('users').child(fdUid).child('friends').push({
      image: 'https://firebasestorage.googleapis.com/v0/b/frienzshipday.appspot.com/o/aa.png?alt=media&token=77d8b7e4-6e8d-4b33-b04f-afafc36148f7',
      name: addFrzName
    });

    firebase.database().ref(`users/${fdUid}`).on("value", snapshot => {

      document.getElementById('frzList').innerHTML = '';

        if (snapshot.exists()){
          // console.log(snapshot.val());
          // location.reload();
          // const email = snapshot.val();
          // console.log(email);
          var myFrd = snapshot.val();
          var sFrnd = myFrd.friends;
          var totalNo = Object.keys(sFrnd);
          // console.log(totalNo);
          for (var i=0; i < totalNo.length; i++){
            var k = totalNo[i];
            var fdImage = sFrnd[k].image;
            var fdName = sFrnd[k].name;
            // console.log(fdImage,fdName);
            showDataToWeb(fdImage,fdName);

          }
        }
        else {
          alert('Error to update friends list');
        }

    });

  }
  previewDefaultTextFd.style.display = null;
  previewImageFd.style.display = null;
  previewImageFd.setAttribute('src', '');
}

function friendsLoginFrInput(){

  firebase.database().ref(`users/${fdUid}`).once("value", snapshot => {

    document.getElementById('frzList').innerHTML = '';

    if (snapshot.exists()){
      document.getElementById('usrLoginName').textContent = snapshot.val().name;

      var fUpropic = snapshot.val().proPicUrl;
      var regUsrImageFd = document.getElementById('usrImage');
      regUsrImageFd.setAttribute('src', fUpropic);

      if (snapshot.child('friends').exists()){
        var myFrd = snapshot.val();
        var sFrnd = myFrd.friends;
        var totalNo = Object.keys(sFrnd);
        for (var i=0; i < totalNo.length; i++){
          var k = totalNo[i];
          var fdImage = sFrnd[k].image;
          var fdName = sFrnd[k].name;
          showDataToWeb(fdImage,fdName);
        }
      }
      else {
        document.getElementsByClassName('nofFrnd')[0].style.display = 'block';
      }

      document.getElementsByClassName('usrLoginSecC')[0].style.display = 'none';
      document.getElementsByClassName('takeFdInput')[0].style.display = 'block';
      document.getElementsByClassName('usrHeadC')[0].style.display = 'block';
      document.getElementsByClassName('friendsInputC')[0].style.display = 'block';
      document.getElementsByClassName('oldToWebC')[0].style.display = 'block';
      document.getElementsByClassName('frzListC')[0].style.display = 'block';
      document.getElementsByClassName('shOnlyUser')[0].style.display = 'none';

    }
    else {
      alert('Invalid Url or User not found.! Go to Homepage.?');
      window.open("https://frienzshipday.web.app/",'_self',false);
    }

  });

}

//New user register functoin call
document.getElementById("newUser").addEventListener("submit", newUserReg, false);

//Resistered User Login call
document.getElementById("regUser").addEventListener("submit", regUserLogin, false);

//Add new friend function call
document.getElementById("inputForm").addEventListener("submit", addFrzDetails, false);


var upUid = window.location.search;
var fdUid = upUid.slice(1);
// console.log(upUid)

window.onload = function(){
  if (upUid === ""){
    document.getElementsByClassName('usrLoginSecC')[0].style.display = 'block';
  }
  else {
    friendsLoginFrInput();
  }
}
