import {Link, withRouter} from 'react-router-dom'

import Cookies from 'js-cookie'
import './index.css'

function Header(props) {
  const {history} = props
  const handleLogOut = () => {
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <div className="header-container">
      <div>
        <Link to="/" className="website-logo">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png "
            alt="website logo"
            className="website-logo-img"
          />
        </Link>
      </div>
      <ul className="list-menu">
        <li className="list-item">
          <Link to="/" className="list-item-link">
            Home
          </Link>
        </li>
        <li className="list-item">
          <Link to="/jobs" className="list-item-link">
            Jobs
          </Link>
        </li>
      </ul>
      <div className="button-container">
        <button type="button" className="button" onClick={handleLogOut}>
          Logout
        </button>
      </div>
    </div>
  )
}

export default withRouter(Header)
