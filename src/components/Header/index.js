import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

const Header = props => {
  const onClickLogout = () => {
    Cookies.remove('jwt_token')
    const {history} = props
    history.replace('/login')
  }

  const onClickHome = () => {
    const {history} = props
    history.replace('/')
  }

  return (
    <nav className="nav-bg-container">
      <ul className="navbar-list-container">
        <Link to="/" className="link">
          <h1 className="website-name">JobHunt</h1>
        </Link>
        <div className="list-items-container">
          <Link to="/" className="link-item" onClick={onClickHome}>
            <li>Home</li>
          </Link>
          <Link to="/jobs" className="link-item">
            <li>Jobs</li>
          </Link>
        </div>
        <button type="button" className="logout-button" onClick={onClickLogout}>
          <li>Logout</li>
        </button>
      </ul>
    </nav>
  )
}
export default withRouter(Header)
