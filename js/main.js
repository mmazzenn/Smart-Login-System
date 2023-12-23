"use strict";

let usersList = [];
let fileName = location.href.substring(location.href.lastIndexOf("/") + 1);
if (
  fileName === "index.html" ||
  location.href === 'https://mmazzenn.github.io/Smart-Login-System/'
) {
  let showSignUp = document.getElementById("showSignUp"),
    showSignIn = document.getElementById("showSignIn"),
    contentInfo = document.querySelector(".main-img .content"),
    signInForm = document.querySelector(".sign-in-form"),
    signUpForm = document.querySelector(".sign-up-form");

  if (localStorage.getItem("users")) {
    usersList = JSON.parse(localStorage.getItem("users"));
  }

  // Switch Between Sign In And Sign Up

  showSignUp.addEventListener("click", () => {
    getSignUp();
  });

  showSignIn.addEventListener("click", () => {
    getSignIn();
  });

  function getSignIn() {
    contentInfo.classList.add("chng-width");
    setTimeout(function () {
      contentInfo.classList.remove("chng-width");
    }, 1200);
    setTimeout(function () {
      showSignUp.parentElement.classList.add("show");
      showSignIn.parentElement.classList.remove("show");
    }, 600);
    signInForm.classList.add("show-form");
    signUpForm.classList.remove("show-form");
    clear();
  }

  function getSignUp() {
    contentInfo.classList.add("chng-width");
    setTimeout(function () {
      contentInfo.classList.remove("chng-width");
    }, 1200);
    setTimeout(function () {
      showSignUp.parentElement.classList.remove("show");
      showSignIn.parentElement.classList.add("show");
    }, 600);
    signInForm.classList.remove("show-form");
    signUpForm.classList.add("show-form");
    clear(true);
  }

  // Stop Form

  document.forms[0].addEventListener("click", function (e) {
    e.preventDefault();
  });

  document.forms[1].addEventListener("click", function (e) {
    e.preventDefault();
  });

  let signInBtn = document.getElementById("signIn"),
    signInEmail = document.getElementById("signInEmail"),
    signInPass = document.getElementById("signInPass"),
    signUpBtn = document.getElementById("signUp"),
    signUpName = document.getElementById("signUpName"),
    signUpEmail = document.getElementById("signUpEmail"),
    signUpPass = document.getElementById("signUpPass");

  // Sign In

  signInBtn.addEventListener("click", () => {
    checkInData(signInEmail.value, signInPass.value);
  });

  function checkInData(email, pass) {
    let validEmail = checkValidEmail(email);
    let validPass = checkValidPass(pass);
    let checkEmail = document.querySelector(".check-in-email");
    let checkPass = document.querySelector(".check-in-pass");
    let fieldEmail = document.querySelector(".field-in-email");
    let fieldPass = document.querySelector(".field-in-pass");

    showSignUp.addEventListener("click", () => {
      checkEmail.innerHTML = "";
      checkPass.innerHTML = "";
      fieldEmail.classList.remove("invalid");
      fieldEmail.classList.remove("valid");
      fieldPass.classList.remove("invalid");
      fieldPass.classList.remove("valid");
    });

    if (validEmail && !validPass) {
      checkEmail.innerHTML = "";
      addValid(fieldEmail);
    } else {
      checkEmail.innerHTML = `<span class="text-danger">Invalid email</span>`;
      addInvalid(fieldEmail);
    }

    if (validPass && !validEmail) {
      checkPass.innerHTML = "";
      addValid(fieldPass);
    } else {
      checkPass.innerHTML = `<span class="text-danger">Invalid password</span>`;
      addInvalid(fieldPass);
    }

    if (validEmail && validPass) {
      checkEmail.innerHTML = "";
      checkPass.innerHTML = "";
      if (localStorage.getItem("users")) {
        let searchRes = findUser(email, pass);
        if (searchRes === "email password") {
          checkEmail.innerHTML = "";
          checkPass.innerHTML = "";
          clear(true);
          addValid(fieldEmail);
          addValid(fieldPass);
          linkHome(email);
        } else if (searchRes === "email") {
          checkEmail.innerHTML = "";
          addValid(fieldEmail);
          checkPass.innerHTML = `<span class="text-danger">Password dosen't match with that email</span>`;
          addInvalid(fieldPass);
        } else if (searchRes === "") {
          checkEmail.innerHTML = "";
          checkEmail.innerHTML = `<span class="text-danger">This email doesn't exists</span>`;
          fieldPass.classList.remove("invalid");
          addInvalid(fieldEmail);
        }
      } else {
        checkPass.innerHTML = `<span class="text-danger">User not exists</span>`;
        addInvalid(fieldEmail);
        addInvalid(fieldPass);
      }
    }
  }

  // Sign Up

  let checkUpName = document.querySelector(".check-up-name");
  let checkupEmail = document.querySelector(".check-up-email");
  let checUpkPass = document.querySelector(".check-up-pass");
  let fieldUpName = document.querySelector(".field-up-name");
  let fieldUpEmail = document.querySelector(".field-up-email");
  let fieldUpPass = document.querySelector(".field-up-pass");

  showSignIn.addEventListener("click", () => {
    checkUpName.innerHTML = "";
    checkupEmail.innerHTML = "";
    checUpkPass.innerHTML = "";
    fieldUpName.classList.remove("invalid");
    fieldUpName.classList.remove("valid");
    fieldUpEmail.classList.remove("invalid");
    fieldUpEmail.classList.remove("valid");
    fieldUpPass.classList.remove("invalid");
    fieldUpPass.classList.remove("valid");
  });

  signUpBtn.addEventListener("click", () => {
    addUser(signUpName.value, signUpEmail.value, signUpPass.value);
  });

  function addUser(name, email, pass) {
    let validName = checkValidName(name);
    let validEmail = checkValidEmail(email);
    let validPass = checkValidPass(pass);
    let checker = "";

    let user = {};

    if (validName) {
      let searchRes = searchData("name", name);
      if (searchRes) {
        checkUpName.innerHTML = `<span class="text-danger">Name exsits</span>`;
        addInvalid(fieldUpName);
      } else {
        checkUpName.innerHTML = `<span class="text-success">Verified</span>`;
        user.name = name;
        checker += "t";
        addValid(fieldUpName);
      }
    } else {
      checkUpName.innerHTML = `<span class="text-danger">Name must contain letters only</span>`;
      addInvalid(fieldUpName);
    }

    if (validEmail) {
      let searchRes = searchData("email", email);
      if (searchRes) {
        checkupEmail.innerHTML = `<span class="text-danger">Email exsits</span>`;
        addInvalid(fieldUpEmail);
      } else {
        checkupEmail.innerHTML = `<span class="text-success">Verified</span>`;
        user.email = encryptEmail(email);
        checker += "t";
        addValid(fieldUpEmail);
      }
    } else {
      checkupEmail.innerHTML = `<span class="text-danger">Email must be in format (abc@abc.com)</span>`;
      addInvalid(fieldUpEmail);
    }

    if (validPass) {
      checUpkPass.innerHTML = `<span class="text-success">Verified</span>`;
      user.password = encryptPass(pass);
      addValid(fieldUpPass);
    } else {
      checUpkPass.innerHTML = `<span class="text-danger">Password must include lower, upper, number and special letter</span>`;
      addInvalid(fieldUpPass);
    }

    if (validName && validEmail && validPass && checker === "tt") {
      checkUpName.innerHTML = "";
      checkupEmail.innerHTML = "";
      checUpkPass.innerHTML = "";
      usersList.push(user);
      localStorage.setItem("users", JSON.stringify(usersList));
      document.querySelector(".signed-up").classList.add("show-signed-up");
      document.querySelector(".main-syetem").classList.add("opacity-50");
      setTimeout(function () {
        getSignIn();
        document.querySelector(".signed-up").classList.remove("show-signed-up");
        document.querySelector(".main-syetem").classList.remove("opacity-50");
      }, 4000);
    }
  }

  // Validation

  function checkValidName(name) {
    let regex = /^[A-Za-z]{3,}$/gi;
    if (regex.test(name)) {
      return true;
    } else {
      return false;
    }
  }

  function checkValidEmail(email) {
    let regex = /^[a-z\d\-\.]+@[a-z\d-]+\.[a-z]{2,8}(\.[a-z]{2,8})?$/gi;
    if (regex.test(email)) {
      return true;
    } else {
      return false;
    }
  }

  function checkValidPass(pass) {
    let regex =
      /(?=.*[a-z])(?=.*[A-Z])(?=.*[\d])(?=.*[~`!@#\$%\^&\*\(\)_\-\+={\[}\]\|\:;"'<,>\.\?\/])[a-zA-Z\d~`!@#\$%\^&\*\(\)_\-\+={\[}\]\|\:;"'<,>\.\?\/]{8,}$/gi;
    if (regex.test(pass)) {
      return true;
    } else {
      return false;
    }
  }

  // Clear Data

  function clear(flag) {
    if (flag) {
      signInEmail.value = "";
      signInPass.value = "";
    } else {
      signUpName.value = "";
      signUpEmail.value = "";
      signUpPass.value = "";
    }
  }

  // Search

  function searchData(prop, data) {
    if (prop === "name") {
      for (let i = 0; i < usersList.length; i++) {
        if (usersList[i].name === data) {
          return true;
        }
      }
    } else if (prop === "email") {
      for (let i = 0; i < usersList.length; i++) {
        if (usersList[i].email === data) {
          return true;
        }
      }
    }
  }

  function findUser(email, pass) {
    let res = "";
    for (let i = 0; i < usersList.length; i++) {
      if (decryptEmail(usersList[i].email) === email) {
        res += "email";
        if (decryptPass(usersList[i].password) === pass) {
          res += " password";
        }
      }
    }
    return res;
  }

  // Add Valid, Add Invalid

  function addValid(fieldName) {
    fieldName.classList.remove("invalid");
    fieldName.classList.add("valid");
  }

  function addInvalid(fieldName) {
    fieldName.classList.add("invalid");
    fieldName.classList.remove("valid");
  }
}

// Encryption and Decryption

function encryptPass(pass) {
  return window.btoa(pass);
}

function decryptPass(pass) {
  return window.atob(pass);
}

function encryptEmail(email) {
  return window.btoa(email);
}

function decryptEmail(email) {
  return window.atob(email);
}

// Home Page

let name = "";

function linkHome(email) {
  for (let i = 0; i < usersList.length; i++) {
    if (decryptEmail(usersList[i].email) === email) {
      name = usersList[i].name;
    }
  }
  localStorage.setItem("userName", name);
  window.location.href = "home.html";
}

let homeFileName = location.href.substring(location.href.lastIndexOf("/") + 1);

if (homeFileName === "home.html") {
  window.onload = function () {
    if (localStorage.getItem("userName")) {
      document.getElementById("introName").innerHTML =
        localStorage.getItem("userName");
      document.getElementById("logOut").addEventListener("click", () => {
        localStorage.removeItem("userName");
        window.location.replace("index.html");
      });
    } else {
      window.location.replace("index.html");
    }
  };
}
