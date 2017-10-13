// var x =  require("firebaseDB.js");

(function () {
    'use strict'

    class Validation {
        constructor() {
            this.elLoginForm = document.querySelector('#form');
            this.elInputs = this.elLoginForm.querySelectorAll('input');
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

        formValidationFn(event) {
            if (event) {
                event.preventDefault();
            }

            if (this.nameValidationFlag && this.emailValidationFlag && this.passwordValidationFlag) {
                this.elSubmitBtn.classList.remove('disable');

                this.requestSubmitFn();
            } else {
                this.elSubmitBtn.classList.add('disable');
            }
        }

        requestSubmitFn() {
            this.elSubmitBtn.addEventListener('click', function (e) {
                window.location.href="/home";
            });
        }
    }

    var validation = new Validation();

    // module.exports = {
    //     chkFn : validation.requestSubmitFn
    // };
}());