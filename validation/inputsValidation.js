const validator = require('validator');

class inputsValidation {
    validateRegisterInputs({name, email, password, password2}) {
        let errors = {};
        name = !this.isEmpty(name) ? name : "";
        email = !this.isEmpty(email) ? email : "";
        password = !this.isEmpty(password) ? password : "";
        password2 = !this.isEmpty(password2) ? password2 : "";

        // check on the length of the name and if is empty
        if (!validator.isLength(name, {min: 3, max: 30}))
            errors.name = "name must be between 3 and 30 characters";

        if (validator.isEmpty(name))
            errors.name = "name is required";

        //check if the email is valied or empty
        if (!validator.isEmail(email))
            errors.email = "email is invalid";

        if (validator.isEmpty(email))
            errors.email = "email is required";

        //check on the length of the password and if is empty
        if (!validator.isLength(password, {min: 5, max: 20}))
            errors.password = "password must be between 5 and 20 characters";

        if (validator.isEmpty(password2))
            errors.password2 = "confirm password is required";

        // check if the tow password field are equal or not
        if (password !== password2)
            errors.password2 = "the tow password field are different";
        return {
            errors,
            isValid: this.isEmpty(errors),
        }
    };

    validateLoginInputs({email, password}) {
        let errors = {};
        email = !this.isEmpty(email) ? email : "";
        password = !this.isEmpty(password) ? password : "";
        //check if the email is valied or empty
        if (!validator.isEmail(email)) errors.email = "email is invalid";
        if (validator.isEmpty(email)) errors.email = "email is required";
        //check on the length of the password and if is empty
        if (!validator.isLength(password, {min: 5, max: 20}))
            errors.password = "password must be between 5 and 20 characters";
        if (validator.isEmpty(password))
            errors.password = "password is required";
        return {
            errors,
            isValid: this.isEmpty(errors),
        }
    };


    isEmpty(value) {
        return value === undefined || value === null ||
            (typeof value === 'object' && Object.keys(value).length === 0) ||
            (typeof value === 'string' && value.trim().length === 0);
    }
}


const validation = new inputsValidation();
module.exports = validation;
