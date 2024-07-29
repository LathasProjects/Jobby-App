import './index.css'

function NotFound() {
  return (
    <div className="not-found-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/jobby-app-not-found-img.png"
        alt="not found"
        className="not-found-image"
      />
      <h1 className="page-not-found-header">Page Not Found</h1>
      <p className="not-found-message">
        We are sorry, the page you requested could not be found
      </p>
    </div>
  )
}

export default NotFound
