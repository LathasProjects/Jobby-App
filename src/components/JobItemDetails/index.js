import Cookies from 'js-cookie'
import {useEffect, useState, useCallback} from 'react'
import './index.css'
import Loader from 'react-loader-spinner'
import EachJobItemDetails from '../EachJobItemDetails'
import Header from '../Header'

const eachJobAPIConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inprogress: 'INPROGRESS',
}

function JobItemDetails(props) {
  const [eachJobDetails, setEachJobDetails] = useState({})
  const [eachJobAPIStatus, setEachJobAPIStatus] = useState(
    eachJobAPIConstants.initial,
  )
  const {history, match} = props
  const token = Cookies.get('jwt_token')
  const {id} = match.params

  const convertSnakeCaseToCamelCase = useCallback(data => {
    if (Array.isArray(data)) {
      return data.map(item => convertSnakeCaseToCamelCase(item))
    }
    if (typeof data === 'object' && data !== null) {
      const newData = {}
      Object.keys(data).forEach(key => {
        const camelCaseKey = key.replace(/(_[a-z])/g, g => g[1].toUpperCase())
        newData[camelCaseKey] = convertSnakeCaseToCamelCase(data[key])
      })
      return newData
    }
    return data
  }, [])

  const getEachJobDetails = useCallback(async () => {
    try {
      setEachJobAPIStatus(eachJobAPIConstants.inprogress)
      const url = `https://apis.ccbp.in/jobs/${id}`
      const options = {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
      const response = await fetch(url, options)
      const data = await response.json()
      if (response.ok) {
        const upDatedData = convertSnakeCaseToCamelCase(data)
        setEachJobDetails(upDatedData)
        setEachJobAPIStatus(eachJobAPIConstants.success)
      } else {
        setEachJobAPIStatus(eachJobAPIConstants.failure)
      }
    } catch (err) {
      console.log(err)
      setEachJobAPIStatus(eachJobAPIConstants.failure)
    }
  }, [id, token, convertSnakeCaseToCamelCase])

  useEffect(() => {
    if (token) {
      getEachJobDetails()
    } else {
      history.replace('/')
    }
  }, [id, getEachJobDetails, history, token])

  const getLoaderView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )
  const getEachJobSuccessView = () => (
    <div className="each-job-item">
      {eachJobDetails && (
        <EachJobItemDetails
          eachJobDetails={eachJobDetails}
          key={eachJobDetails.id}
        />
      )}
    </div>
  )

  const handleJobsRetry = () => {
    setEachJobAPIStatus(eachJobAPIConstants.inprogress)
    getEachJobDetails()
  }

  const getEachJobsFailureView = () => (
    <div className="failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        alt="failure view"
        className="job-failure-image"
      />
      <h1 className="failure-header">Oops! Something Went Wrong</h1>
      <p className="failure-message">
        We cannot seem to find the page you are looking for
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
  const getAllEachJobsStatusData = () => {
    switch (eachJobAPIStatus) {
      case eachJobAPIConstants.success:
        return getEachJobSuccessView()
      case eachJobAPIConstants.failure:
        return getEachJobsFailureView
      case eachJobAPIConstants.inprogress:
        return getLoaderView()
      default:
        return null
    }
  }
  return (
    <div className="job-item-details-container">
      <Header />
      {getAllEachJobsStatusData()}
    </div>
  )
}

export default JobItemDetails
