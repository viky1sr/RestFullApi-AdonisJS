'use strict'
const {rule} = require("@adonisjs/validator/src/Validator");
const { validate } = use('Validator')
const User = use('App/Models/User')

class AuthController {

  async login ({ request, auth }) {
    const { email, password } = request.all()
    const token = await auth.attempt(email, password)
    return token;
  }

  async register({ request, response }){
    const data = request.all();
    const msg = {
      'username.required': 'Please add your email',
      'username.unique': 'Username sudah terdaftar',
      'email.required': 'Please add your email',
      'email.unique': 'Email sudah terdaftar',
      'password.required': 'Please add your password',
      'password.min': "Minimal password 8",
      'password.regex': "Password harus mengunakan huruf '@aw2F&d%'"
    };

    const validation = await validate(data,{
      username: 'required|unique:users',
      email: 'required|email|unique:users,email',
      password: [
        rule('regex', new RegExp('[A-z]+[0-9]+[@$!%*#?&-.]+'))
      ]
    },msg);

    if (validation.fails()) {
      return validation.messages()
    }

    const input = {
      username: data.username,
      email: data.email,
      password: data.password
    }

    await User.create(input)

    // untung ngerender token
    // const token = this.login(...arguments);
    // return token

    return response.json({
      messages: 'Berhasil created member',
      status: 'success'
    });

  }

}

module.exports = AuthController
