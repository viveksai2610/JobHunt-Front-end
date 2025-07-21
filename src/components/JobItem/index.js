import {Link} from 'react-router-dom'

import './index.css'

import {FaStar, FaBusinessTime} from 'react-icons/fa'

import {MdLocationOn} from 'react-icons/md'

const JobItem = props => {
  const {jobDetails} = props
  const {
    companyLogoUrl,
    employmentType,
    jobDescription,
    title,
    packagePerAnnum,
    location,
    id,
    rating,
  } = jobDetails
  return (
    <Link to={`/jobs/${id}`} className="link">
      <li className="job-item-container">
        <div className="company-logo-name-container">
          <img
            src={companyLogoUrl}
            alt="company logo"
            className="company-logo"
          />
          <div className="company-name-container">
            <h1 className="title">{title}</h1>
            <div className="icon-container">
              <FaStar className="icon" />
              <p>{rating}</p>
            </div>
          </div>
        </div>
        <div className="location-type-package-container">
          <div className="location-type-container">
            <div className="icon-container">
              <MdLocationOn className="icon" />
              <p className="paragraph">{location}</p>
            </div>
            <div className="icon-container">
              <FaBusinessTime className="icon" />
              <p className="paragraph">{employmentType}</p>
            </div>
          </div>
          <p>{packagePerAnnum}</p>
        </div>
        <hr />
        <h1 className="description-heading">Description</h1>
        <p className="job-description">{jobDescription}</p>
      </li>
    </Link>
  )
}
export default JobItem
