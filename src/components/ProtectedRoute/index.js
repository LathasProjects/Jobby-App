import Cookies from 'js-cookie'
import {Redirect, Route} from 'react-router-dom'

function ProtectedRoute(props) {
  const token = Cookies.get('jwt_token')
  if (token === undefined) {
    return <Redirect to="/login" />
  }
  return <Route {...props} />
}

export default ProtectedRoute
