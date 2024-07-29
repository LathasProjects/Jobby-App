import {
  FaStar,
  FaMapMarkerAlt,
  FaBriefcase,
  FaExternalLinkAlt,
} from 'react-icons/fa'
import './index.css'

function EachJobItemDetails(props) {
  const {eachJobDetails} = props
  const {jobDetails, similarJobs} = eachJobDetails || {}

  if (!jobDetails) {
    return <p>Loading</p>
  }

  const {
    companyLogoUrl,
    companyWebsiteUrl,
    employmentType,
    title,
    jobDescription,
    skills,
    lifeAtCompany,
    location,
    packagePerAnnum,
    rating,
  } = jobDetails

  return (
    <div className="similar-jobs-and-each-job-list">
      <div className="job-list-container">
        <div className="first-container">
          <img
            src={companyLogoUrl}
            alt="job details company logo"
            className="company-logo-image"
          />
          <div className="title-and-star">
            <h1 className="job-title">{title}</h1>
            <div className="rating">
              <FaStar className="star-image" />
              <p className="company-rating">{rating}</p>
            </div>
          </div>
        </div>
        <div className="middle-container">
          <div className="left-container">
            <div className="location">
              <FaMapMarkerAlt className="location-icon" />
              <span className="location-name">{location}</span>
            </div>
            <div className="employment">
              <FaBriefcase className="brief-icon" />
              <p className="brief-name">{employmentType}</p>
            </div>
          </div>
          <div className="right-container">
            <p className="package">{packagePerAnnum}</p>
          </div>
        </div>
        <hr className="hr" />
        <div className="last-container">
          <div className="description-container">
            <h3 className="description-header">Description</h3>
            <div className="company-url-and-icon">
              <a href={companyWebsiteUrl} className="company-url">
                Visit <FaExternalLinkAlt />
              </a>
            </div>
          </div>

          <p className="job-description">{jobDescription}</p>
        </div>
        <h1 className="skills-heading">Skills</h1>
        <ul className="skill-list">
          {skills.map(skill => (
            <li className="skill-item">
              <img src={skill.imageUrl} alt="name" className="skill-image" />
              <h1 className="skill-name">{skill.name}</h1>
            </li>
          ))}
        </ul>
        <h1 className="life-at-company-header">Life at Company</h1>
        <div className="life-at-company-container">
          <p className="life-at-company-description">
            {lifeAtCompany.description}
          </p>
          <img
            src={lifeAtCompany.imageUrl}
            alt="life at company"
            className="life-at-company-image"
          />
        </div>
      </div>
      <h1 className="similar-jobs-header">Similar Jobs</h1>
      <ul className="similar-job-list-container">
        {similarJobs.map(similarJob => (
          <li className="similar-job-list" key={similarJob.id}>
            <div className="first-container">
              <img
                src={similarJob.companyLogoUrl}
                alt="similar job company logo"
                className="company-logo-image"
              />
              <div className="title-and-star">
                <h1 className="job-title">{similarJob.title}</h1>
                <div className="rating">
                  <FaStar className="star-image" />
                  <p className="company-rating">{similarJob.rating}</p>
                </div>
              </div>
            </div>
            <div className="last-container">
              <h3 className="description-header">Description</h3>
              <p className="job-description">{similarJob.jobDescription}</p>
            </div>
            <div className="middle-container">
              <div className="left-container">
                <div className="location">
                  <FaMapMarkerAlt className="location-icon" />
                  <p className="location-name">{similarJob.location}</p>
                </div>
                <div className="employment">
                  <FaBriefcase className="brief-icon" />
                  <p className="brief-name">{similarJob.employmentType}</p>
                </div>
              </div>
              <div className="right-container">
                <p className="package">{similarJob.packagePerAnnum}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default EachJobItemDetails
