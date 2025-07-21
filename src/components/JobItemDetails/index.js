import {Component} from 'react'

import Loader from 'react-loader-spinner'

import Cookies from 'js-cookie'

import {FaStar, FaBusinessTime} from 'react-icons/fa'

import Header from '../Header'

import SkillItem from '../SkillItem'

import SimilarJobItem from '../SimilarJobItem'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class JobItemDetails extends Component {
  state = {
    jobDetails: {},
    similarJobs: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getJobDetails()
  }

  getFormmatedSimilarJobData = jobData => ({
    companyLogoUrl: jobData.company_logo_url,
    employmentType: jobData.employment_type,
    id: jobData.id,
    jobDescription: jobData.job_description,
    location: jobData.location,
    rating: jobData.rating,
    title: jobData.title,
  })

  getFormmatedlifeAtCompanyData = data => ({
    description: data.description,
    imageUrl: data.image_url,
  })

  getFormmatedSkill = skillData => ({
    imageUrl: skillData.image_url,
    name: skillData.name,
  })

  getJobDetails = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })

    const {match} = this.props
    const {params} = match
    const {id} = params

    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(`https://apis.ccbp.in/jobs/${id}`, options)
    const data = await response.json()

    if (response.ok) {
      const formattedData = {
        companyLogoUrl: data.job_details.company_logo_url,
        employmentType: data.job_details.employment_type,
        id: data.job_details.id,
        jobDescription: data.job_details.job_description,
        skills: data.job_details.skills.map(eachSkill =>
          this.getFormmatedSkill(eachSkill),
        ),
        lifeAtCompany: this.getFormmatedlifeAtCompanyData(
          data.job_details.life_at_company,
        ),
        location: data.job_details.location,
        packagePerAnnum: data.job_details.package_per_annum,
        rating: data.job_details.rating,
        title: data.job_details.title,
      }

      this.setState({
        jobDetails: formattedData,
        similarJobs: data.similar_jobs.map(eachJob =>
          this.getFormmatedSimilarJobData(eachJob),
        ),
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderSuccessView = () => {
    const {jobDetails, similarJobs} = this.state
    const {
      companyLogoUrl,
      employmentType,
      jobDescription,
      title,
      packagePerAnnum,
      location,
      lifeAtCompany,
      rating,
      skills,
    } = jobDetails
    return (
      <div className="job-bg-container">
        <div className="job-container">
          <div className="company-logo-name-container">
            <img
              src={companyLogoUrl}
              alt="job details company logo"
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
                <FaStar className="icon" />
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
          <h1 className="side-heading">Description</h1>
          <p>{jobDescription}</p>
          <a href="https://www.google.com" className="apply-now-link">
            <button type="button" className="apply-now-button">
              Apply now{' '}
            </button>
          </a>
        </div>
        <div>
          <h1>Skills</h1>
          <ul className="skills-list-container">
            {skills !== undefined &&
              skills.map(eachSkill => (
                <SkillItem key={eachSkill.name} skillDetails={eachSkill} />
              ))}
          </ul>
        </div>
        <div className="life-at-company-container">
          <div>
            <h1>Life at Company</h1>
            {lifeAtCompany !== undefined && <p>{lifeAtCompany.description}</p>}
          </div>
          {lifeAtCompany !== undefined && (
            <img
              src={lifeAtCompany.imageUrl}
              className="company-img"
              alt="life at company"
            />
          )}
        </div>
        <h1>Similar Jobs</h1>
        <ul className="similar-jobs-list-container">
          {similarJobs !== undefined &&
            similarJobs.map(eachSimilarJobItem => (
              <SimilarJobItem
                key={eachSimilarJobItem.id}
                similarJobDetails={eachSimilarJobItem}
              />
            ))}
        </ul>
      </div>
    )
  }

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#4f46e5" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div className="failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        className="failure-img"
        alt="failure view"
      />
      <h1>Opps! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for.</p>
      <button type="button" onClick={this.getJobsList} className="retry-btn">
        Retry
      </button>
    </div>
  )

  renderJobItemDetails = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <div>
        <Header />
        {this.renderJobItemDetails()}
      </div>
    )
  }
}

export default JobItemDetails
