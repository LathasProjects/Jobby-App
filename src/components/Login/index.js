import {useState} from 'react'
import Cookies from 'js-cookie'
import './index.css'

function Login(props) {
  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [showSubmitError, setShowSubmitError] = useState(false)
  const [errorMes, setErrorMes] = useState('')

  const onChangeUserName = e => {
    setUserName(e.target.value)
  }
  const onChangePassword = e => {
    setPassword(e.target.value)
  }
  const onSubmitSuccess = jToken => {
    const {history} = props
    Cookies.set('jwt_token', jToken, {expires: 2})
    history.replace('/')
  }
  const onSubmitFailure = error => {
    setShowSubmitError(true)
    setErrorMes(error.error_msg)
  }
  const onSubmitForm = async e => {
    e.preventDefault()
    // if (userName === '' || password === '') {
    //   return
    // }
    const userDetails = {
      username: userName,
      password,
    }
    try {
      const url = 'https://apis.ccbp.in/login'
      const options = {method: 'POST', body: JSON.stringify(userDetails)}
      const response = await fetch(url, options)
      const data = await response.json()
      if (response.ok) {
        onSubmitSuccess(data.jwt_token)
        console.log(data)
      } else {
        onSubmitFailure(data)
      }
    } catch (err) {
      console.log(err)
    }
  }
  return (
    <div className="login-container">
      <div className="login-form-details">
        <img
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          alt="website logo"
          className="login-image"
        />
        <form onSubmit={onSubmitForm} className="login-form">
          <div className="input-container">
            <label htmlFor="username" className="username">
              USERNAME
            </label>
            <input
              type="text"
              id="username"
              placeholder="Username"
              value={userName}
              onChange={onChangeUserName}
              className="input"
            />
          </div>
          <div className="input-container">
            <label htmlFor="password" className="password">
              PASSWORD
            </label>
            <input
              type="password"
              id="password"
              placeholder="Password"
              onChange={onChangePassword}
              value={password}
              className="input"
            />
          </div>
          <div className="button-container">
            <button type="submit" className="button">
              Login
            </button>
          </div>
          {showSubmitError && <p className="error-message">{errorMes}</p>}
        </form>
      </div>
    </div>
  )
}

export default Login
