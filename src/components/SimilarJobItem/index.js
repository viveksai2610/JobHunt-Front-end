import {Link} from 'react-router-dom'

import {FaStar} from 'react-icons/fa'

import './index.css'

const SimilarJobItem = props => {
  const {similarJobDetails} = props
  const {id, companyLogoUrl, jobDescription, rating, title} = similarJobDetails

  return (
    <Link to={`/similarJobs/${id}`} className="link">
      <li className="similar-job-item-container">
        <div className="company-logo-name-container">
          <img
            src={companyLogoUrl}
            alt="similar job company logo"
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
        <div>
          <h1 className="side-heading">Description</h1>
          <p>{jobDescription}</p>
        </div>
      </li>
    </Link>
  )
}

export default SimilarJobItem
