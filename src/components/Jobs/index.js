import {useEffect, useState, useCallback} from 'react'
import Cookies from 'js-cookie'
import {FaStar, FaMapMarkerAlt, FaBriefcase} from 'react-icons/fa'
import Loader from 'react-loader-spinner'
import {BsSearch} from 'react-icons/bs'
import {Link} from 'react-router-dom'
import PropTypes from 'prop-types'
import './index.css'
import Header from '../Header'

const profileAPIConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inprogress: 'INPROGRESS',
}

const jobsAPIConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inprogress: 'INPROGRESS',
  nojobs: 'NOJOBS',
}

function Jobs({employmentTypesList, salaryRangesList}) {
  const token = Cookies.get('jwt_token')
  const initialEmploymentTypes = employmentTypesList.reduce((acc, type) => {
    acc[type.employmentTypeId] = false
    return acc
  }, {})
  const [profileData, setProfileData] = useState({})
  const [profileAPIStatus, setProfileAPIStatus] = useState(
    profileAPIConstants.initial,
  )
  const [jobsAPIStatus, setJobsAPIStatus] = useState(jobsAPIConstants.initial)
  const [searchInput, setSearchInput] = useState('')
  const [employmentTypes, setEmploymentTypes] = useState(initialEmploymentTypes)
  const [salaryRange, setSalaryRange] = useState('')
  const [jobDetails, setJobDetails] = useState([])

  const getProfileData = useCallback(async () => {
    try {
      setProfileAPIStatus(profileAPIConstants.inprogress)
      const url = 'https://apis.ccbp.in/profile'
      const options = {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
      const response = await fetch(url, options)
      const data = await response.json()
      if (response.ok) {
        setProfileData(data.profile_details)
        setProfileAPIStatus(profileAPIConstants.success)
      } else {
        setProfileAPIStatus(profileAPIConstants.failure)
      }
    } catch (err) {
      console.log(err)
      setProfileAPIStatus(profileAPIConstants.failure)
    }
  }, [token])

  useEffect(() => {
    getProfileData()
  }, [getProfileData])

  const fetchJobs = useCallback(async () => {
    try {
      setJobsAPIStatus(jobsAPIConstants.inprogress)
      const selectedEmploymentTypes = Object.keys(employmentTypes)
        .filter(type => employmentTypes[type])
        .join(',')

      const jobsAPIUrl = `https://apis.ccbp.in/jobs?employment_type=${selectedEmploymentTypes}&minimum_package=${salaryRange}&search=${searchInput}`
      const options = {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
      const response = await fetch(jobsAPIUrl, options)
      const data = await response.json()
      if (response.ok) {
        console.log('data', data)
        if (data.jobs.length === 0) {
          setJobsAPIStatus(jobsAPIConstants.nojobs)
        } else {
          setJobDetails(data.jobs)
          setJobsAPIStatus(jobsAPIConstants.success)
        }
      } else {
        console.error('Error fetching jobs:', data.error_msg)
        setJobsAPIStatus(jobsAPIConstants.failure)
      }
    } catch (err) {
      console.log(err)
      setJobsAPIStatus(jobsAPIConstants.failure)
    }
  }, [employmentTypes, salaryRange, searchInput, token])

  useEffect(() => {
    fetchJobs()
  }, [fetchJobs])

  const getLoaderView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )
  const getProfileSuccessView = () => (
    <div className="profile-container">
      <img src={profileData.profile_image_url} alt="profile" />
      <h1>{profileData.name}</h1>
      <p>{profileData.short_bio}</p>
    </div>
  )

  const handleRetry = () => {
    setProfileAPIStatus(profileAPIConstants.inprogress)
    getProfileData()
  }

  const getProfileFailureView = () => (
    <div className="retry-button-container">
      <button type="button" className="retry-button" onClick={handleRetry}>
        Retry
      </button>
    </div>
  )

  const getProfileStatusData = () => {
    switch (profileAPIStatus) {
      case profileAPIConstants.success:
        return getProfileSuccessView()
      case profileAPIConstants.failure:
        return getProfileFailureView()
      case profileAPIConstants.inprogress:
        return getLoaderView()
      default:
        return null
    }
  }

  const onChangeSearch = e => {
    setSearchInput(e.target.value)
  }

  const handleSearchIcon = async () => {
    // Perform the search logic here, e.g., make an API call with the searchQuery
    fetchJobs()
  }

  const handleCheckboxChange = e => {
    const {id, checked} = e.target
    setEmploymentTypes(prevState => ({
      ...prevState,
      [id]: checked,
    }))
  }

  const handleRadioChange = e => {
    setSalaryRange(e.target.value)
  }
  const handleJobsRetry = () => {
    setJobsAPIStatus(jobsAPIConstants.inprogress)
    fetchJobs()
  }

  const getNoJobsView = () => (
    <div className="no-jobs-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        alt="no jobs"
        className="no-jobs-image"
      />
      <h1>No Jobs Found</h1>
      <p>We could not find any jobs.Try other filters.</p>
    </div>
  )
  const getJobsFailureView = () => (
    <div className="failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        alt="no jobs"
        className="job-failure-image"
      />
      <h1 className="failure-header">Ooops! Something went wrong</h1>
      <p className="failure-message">
        we cannot seem to find the page you are looking for
      </p>
      <button
        className="jobs-retry-button"
        type="button"
        onClick={handleJobsRetry}
      >
        Retry
      </button>
    </div>
  )

  const getAllJobsData = () => {
    switch (jobsAPIStatus) {
      case jobsAPIConstants.success:
        return (
          <ul className="job-ul-container">
            {jobDetails &&
              jobDetails.map(eachJob => (
                <Link
                  key={eachJob.id}
                  to={`/jobs/${eachJob.id}`}
                  className="link-container"
                >
                  <li className="job-list-container">
                    <div className="first-container">
                      <img
                        src={eachJob.company_logo_url}
                        alt="company logo"
                        className="company-logo-image"
                      />
                      <div className="title-and-star">
                        <h1 className="job-title">{eachJob.title}</h1>
                        <div className="rating">
                          <FaStar className="star-image" />
                          <p className="company-rating">{eachJob.rating}</p>
                        </div>
                      </div>
                    </div>
                    <div className="middle-container">
                      <div className="left-container">
                        <div className="location">
                          <FaMapMarkerAlt className="location-icon" />
                          <p className="location-name">{eachJob.location}</p>
                        </div>
                        <div className="employment">
                          <FaBriefcase className="brief-icon" />
                          <p className="brief-name">
                            {eachJob.employment_type}
                          </p>
                        </div>
                      </div>
                      <div className="right-container">
                        <p className="package">{eachJob.package_per_annum}</p>
                      </div>
                    </div>
                    <hr className="hr" />
                    <div className="last-container">
                      <h1 className="description-header">Description</h1>
                      <p className="job-description">
                        {eachJob.job_description}
                      </p>
                    </div>
                  </li>
                </Link>
              ))}
          </ul>
        )
      case jobsAPIConstants.failure:
        return getJobsFailureView()
      case jobsAPIConstants.inprogress:
        return getLoaderView()
      case jobsAPIConstants.nojobs:
        return getNoJobsView()

      default:
        return null
    }
  }

  // https://apis.ccbp.in/jobs?employment_type=${selectedEmploymentTypes}&minimum_package=1000000&search=
  return (
    <div className="jobs-container">
      <Header />
      <div className="jobs-content">
        <div className="left-content">
          {getProfileStatusData()}
          <hr className="hr" />
          <ul className="employment-type">
            <h1 className="employment-type-header">Type of Employment</h1>
            {employmentTypesList.map(type => (
              <li className="checkbox-input" key={type.employmentTypeId}>
                <input
                  type="checkbox"
                  id={type.employmentTypeId}
                  onChange={handleCheckboxChange}
                  checked={employmentTypes[type.employmentTypeId]}
                />
                <label
                  htmlFor={type.employmentTypeId}
                  className="label-employment-type"
                >
                  {type.label}
                </label>
              </li>
            ))}
          </ul>
          <hr className="hr" />
          <ul className="salary-range">
            <h1 className="salary-range-header">Salary Range</h1>
            {salaryRangesList.map(range => (
              <li className="radio-input" key={range.salaryRangeId}>
                <input
                  type="radio"
                  id={range.salaryRangeId}
                  name="salary"
                  onChange={handleRadioChange}
                  value={range.salaryRangeId}
                  checked={salaryRange === range.salaryRangeId}
                />
                <label htmlFor={range.salaryRangeId}>{range.label}</label>
              </li>
            ))}
          </ul>
        </div>
        <div className="right-content">
          <div className="search-container">
            <input
              type="search"
              placeholder="Search"
              value={searchInput}
              onChange={onChangeSearch}
              className="search-input"
            />
            <button
              type="button"
              aria-label="search-icon"
              data-testid="searchButton"
              className="search-button"
              onClick={handleSearchIcon}
            >
              <BsSearch className="search-icon" />
            </button>
          </div>
          {getAllJobsData()}
        </div>
      </div>
    </div>
  )
}

Jobs.propTypes = {
  employmentTypesList: PropTypes.arrayOf(
    PropTypes.shape({
      employmentTypeId: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    }),
  ).isRequired,
  salaryRangesList: PropTypes.arrayOf(
    PropTypes.shape({
      salaryRangeId: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    }),
  ).isRequired,
}
export default Jobs
