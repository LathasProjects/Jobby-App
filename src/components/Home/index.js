import {Link} from 'react-router-dom'
import './index.css'
import Header from '../Header'

function Home(props) {
  const {history} = props
  const handleFindJobs = () => {
    history.replace('/jobs')
  }
  return (
    <div className="home-container">
      <Header />
      <div className="body-container">
        <div className="content">
          <h1>Find The Job That Fits Your Life</h1>
          <p>
            Millions of people are searching for jobs,salary information,company
            reviews.Find the job that fits your abilities and potential.
          </p>
          <Link to="/jobs">
            <button
              type="button"
              className="find-jobs-button"
              onClick={handleFindJobs}
            >
              Find Jobs
            </button>
          </Link>
        </div>
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          alt="no jobs"
        />
      </div>
    </div>
  )
}

export default Home
