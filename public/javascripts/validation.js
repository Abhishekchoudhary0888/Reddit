require(["javascripts/firebaseDB.js"], function (config) {

    (function () {
        'use strict'

        class Validation {
            constructor() {
                this.elForm = document.querySelector('#form');
                this.elInputs = this.elForm.querySelectorAll('input');
                this.elSubmitBtn = document.querySelector('#submitBtn');

                this.nameValidationFlag = false;
                this.emailValidationFlag = false;
                this.passwordValidationFlag = false;

                this.attachEvent();
            }

            attachEvent() {
                var that = this;
                this.elInputs.forEach(function (elInput) {
                    elInput.addEventListener('change', function () {
                        that.validation(this);
                    });
                })

                this.elSubmitBtn.addEventListener('click', function (e) {
                    that.formValidationFn(e);
                });
            }

            validation(inputFieldEl) {
                if (inputFieldEl.classList.contains('name')) {
                    this.nameValidationFlag = this.nameValidation(inputFieldEl);
                }

                if (inputFieldEl.classList.contains('email')) {
                    this.emailValidationFlag = this.emailValidation(inputFieldEl);
                }

                if (inputFieldEl.classList.contains('password')) {
                    this.passwordValidationFlag = this.defaultValidation(inputFieldEl);
                }
                this.formValidationFn();
            }

            nameValidation(el) {
                if (/^[^0-9]{1,30}$/i.test(el.value)) {
                    this.removeError(el);
                    return true;

                } else {
                    this.addError(el, "Enter the name correctly");
                    return false;
                }
            }

            emailValidation(el) {
                var filter = /^[^@ ]+@[^@ ]+\.[^@ ]+$/;

                if (filter.test(el.value)) {
                    this.removeError(el);
                    return true;

                } else {
                    this.addError(el, "Enter the email correctly");
                    return false;
                }
            }

            defaultValidation(el) {
                if (el.value) {
                    this.removeError(el);
                    return true;
                } else {
                    this.addError(el, 'Enter the Password correctly');
                    return false;
                }
            }

            addError(el, text) {
                el.classList.add('error');

                var errorEl = document.createElement('div')
                errorEl.className = "error-msg";
                errorEl.innerHTML = text;

                var existingError = el.parentNode.querySelector('.error-msg');
                if (existingError) {
                    el.parentNode.removeChild(existingError);
                }

                el.parentNode.appendChild(errorEl);
            }

            removeError(el) {
                if (el.classList.contains('error')) {
                    el.classList.remove('error');
                    el.parentNode.removeChild(el.parentNode.querySelector('.error-msg'));
                }
            }

            resetForm() {
                this.elSubmitBtn.innerHTML = 'Login';
                this.elSubmitBtn.classList.add('disable');
                this.nameValidationFlag = false;
                this.emailValidationFlag = false;
                this.passwordValidationFlag = false;
            }

            formValidationFn(event) {
                if (event) {
                    event.preventDefault();
                }

                if (this.nameValidationFlag && this.emailValidationFlag && this.passwordValidationFlag) {
                    this.elSubmitBtn.classList.remove('disable');

                    var formData = {
                        name: this.elForm.querySelector('input[name="name"]').value,
                        email: this.elForm.querySelector('input[name="email"]').value,
                        password: this.elForm.querySelector('input[name="password"]').value,
                    };

                    this.checkForm(formData);

                } else {
                    this.elSubmitBtn.classList.add('disable');
                }
            }

            checkForm(formData) {
                if (this.elSubmitBtn.classList.contains('login-btn')) {
                    this.requestLoginFormFn(formData);
                } else if (this.elSubmitBtn.classList.contains('register-btn')) {
                    this.requestSignupFormFn(formData);
                }
            }

            requestLoginFormFn(formData) {

                var status = false,
                    that = this;


                this.elSubmitBtn.addEventListener('click', function (e) {
                    this.innerHTML = 'Login, please wait...';

                    if (!firebase.apps.length) {
                        firebase.initializeApp(config.config);
                    }

                    var database = firebase.database();
                    var loginRef = database.ref('loginDetails');


                    loginRef.once('value').then(function (obj) {
                        var content = obj.val();
                        if (content) {
                            var keys = Object.keys(content);

                            for (var i = 0; i < keys.length; i++) {
                                var k = content[keys[i]];
                                if (k.name == formData.name && k.email == formData.email && k.password == formData.password) {
                                    status = true;
                                    window.location.href = "/home";
                                }
                            }

                        }

                        if (!status) {
                            that.elForm.reset();
                            that.resetForm();
                            alert('No record found, kindly signup first !!');
                        }
                    });
                });
            }

            requestSignupFormFn(formData) {
                this.elSubmitBtn.addEventListener('click', function (e) {

                    this.innerHTML = 'Registering, please wait...';
                    firebase.initializeApp(config.config);
                    var database = firebase.database();
                    var loginRef = database.ref('loginDetails');

                    loginRef.push(formData, function () {
                        window.location.href = "/home";
                    });
                });
            }
        }

        var validation = new Validation();
    }());

});