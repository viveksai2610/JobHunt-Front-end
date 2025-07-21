import {Component} from 'react'

import Cookies from 'js-cookie'

import './index.css'

class Login extends Component {
  state = {
    username: '',
    password: '',
    showErrorMsg: false,
    errorMsg: '',
    showPassword: false,
  }

  onSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 5})
    history.replace('/')
  }

  onChangeShowPassword = () => {
    this.setState(prevState => ({
      showPassword: !prevState.showPassword,
    }))
  }

  onFailure = errorMsg => {
    this.setState({showErrorMsg: true, errorMsg})
  }

  onSubmitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const loginAPIUrl = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }

    const response = await fetch(loginAPIUrl, options)
    const data = await response.json()
    if (response.ok) {
      this.onSuccess(data.jwt_token)
    }
    if (response.ok === false) {
      this.onFailure(data.error_msg)
    }
  }

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  render() {
    const {
      username,
      password,
      showErrorMsg,
      errorMsg,
      showPassword,
    } = this.state
    return (
      <div className="login-bg-container">
        <form className="form-container" onSubmit={this.onSubmitForm}>
          <h1 className="login-page-website-name">JobHunt</h1>
          <div>
            <label htmlFor="username" className="input-label">
              USERNAME
            </label>
            <br />
            <input
              type="text"
              className="input-element"
              id="username"
              value={username}
              placeholder="Username"
              onChange={this.onChangeUsername}
            />
          </div>
          <div>
            <label htmlFor="password" className="input-label">
              PASSWORD
            </label>
            <br />
            <input
              type={showPassword ? 'text' : 'password'}
              className="input-element"
              id="password"
              value={password}
              placeholder="Password"
              onChange={this.onChangePassword}
            />
            <div className="show-password-container">
              <input
                type="checkbox"
                className="checkbox-input"
                id="show-password"
                checked={showPassword}
                onChange={this.onChangeShowPassword}
              />
              <label
                htmlFor="show-password"
                className="show-password-input-label"
              >
                Show Password
              </label>
            </div>
          </div>
          {showErrorMsg && <p className="error-msg">{errorMsg}</p>}
          <button type="submit" className="login-btn">
            Login
          </button>
        </form>
      </div>
    )
  }
}

export default Login
