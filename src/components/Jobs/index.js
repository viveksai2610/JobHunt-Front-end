import {Component} from 'react'

import Loader from 'react-loader-spinner'

import {BsSearch} from 'react-icons/bs'

import {FaSortDown, FaSortUp} from 'react-icons/fa'

import Cookies from 'js-cookie'

import JobItem from '../JobItem'

import Header from '../Header'

import CheckboxFilterGroup from '../CheckboxFilterGroup'

import RadioFilterGroup from '../RadioFilterGroup'

import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiStatusConstantsForProfileDetails = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const apiStatusConstantsForJobsList = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Jobs extends Component {
  state = {
    profileDetails: {},
    jobsList: [],
    employmentTypeList: [],
    minimumPackage: '',
    searchInput: '',
    apiStatusForProfileDetails: apiStatusConstantsForProfileDetails.initial,
    apiStatusForJobsList: apiStatusConstantsForJobsList.initial,
    showTypeOFEmploymentOptions: false,
    showSalaryRangeOptions: false,
  }

  componentDidMount() {
    this.getProfileDetails()
  }

  onClickShowTypeOFEmploymentOptions = () => {
    this.setState(prevState => ({
      showTypeOFEmploymentOptions: !prevState.showTypeOFEmploymentOptions,
    }))
  }

  onClickShowSalaryRangeOptions = () => {
    this.setState(prevState => ({
      showSalaryRangeOptions: !prevState.showSalaryRangeOptions,
    }))
  }

  changeRadioInput = minimumPackage => {
    this.setState({minimumPackage}, this.getJobsList)
  }

  changeCheckboxInput = selectedType => {
    const {employmentTypeList} = this.state

    if (employmentTypeList.includes(selectedType) === false) {
      const newEmploymentTypeList = [...employmentTypeList, selectedType]
      this.setState(
        {employmentTypeList: newEmploymentTypeList},
        this.getJobsList,
      )
    } else {
      const filteredData = employmentTypeList.filter(
        eachType => eachType !== selectedType,
      )
      this.setState({employmentTypeList: filteredData}, this.getJobsList)
    }
  }

  onClickSearchIcon = () => {
    const {searchInput} = this.state
    this.setState({searchInput}, this.getJobsList)
  }

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  getJobsList = async () => {
    this.setState({
      apiStatusForJobsList: apiStatusConstantsForJobsList.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const {employmentTypeList, minimumPackage, searchInput} = this.state
    const response = await fetch(
      `https://apis.ccbp.in/jobs?employment_type=${[
        ...employmentTypeList,
      ]}&minimum_package=${minimumPackage}&search=${searchInput}`,
      options,
    )
    const data = await response.json()
    if (response.ok) {
      const formattedData = data.jobs.map(eachJob => ({
        companyLogoUrl: eachJob.company_logo_url,
        employmentType: eachJob.employment_type,
        id: eachJob.id,
        jobDescription: eachJob.job_description,
        location: eachJob.location,
        packagePerAnnum: eachJob.package_per_annum,
        rating: eachJob.rating,
        title: eachJob.title,
      }))
      this.setState({
        jobsList: formattedData,
        apiStatusForJobsList: apiStatusConstantsForJobsList.success,
      })
    } else {
      this.setState({
        apiStatusForJobsList: apiStatusConstantsForJobsList.failure,
      })
    }
  }

  getProfileDetails = async () => {
    this.setState({
      apiStatusForProfileDetails:
        apiStatusConstantsForProfileDetails.inProgress,
    })

    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch('https://apis.ccbp.in/profile', options)
    const data = await response.json()
    if (response.ok) {
      const formattedData = {
        name: data.profile_details.name,
        profileImageUrl: data.profile_details.profile_image_url,
        shortBio: data.profile_details.short_bio,
      }
      this.setState(
        {
          profileDetails: formattedData,
          apiStatusForProfileDetails:
            apiStatusConstantsForProfileDetails.success,
        },
        this.getJobsList,
      )
    } else {
      this.setState({
        apiStatusForProfileDetails: apiStatusConstantsForProfileDetails.failure,
      })
    }
  }

  renderProfileSuccessView = () => {
    const {profileDetails} = this.state
    const {name, profileImageUrl} = profileDetails
    return (
      <div>
        <img src={profileImageUrl} className="profile-img" alt="profile" />
        <h1 className="user-name">{name}</h1>
      </div>
    )
  }

  renderProfileFailureView = () => (
    <button
      type="button"
      onClick={this.getProfileDetails}
      className="retry-btn"
    >
      Retry
    </button>
  )

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#4f46e5" height="50" width="50" />
    </div>
  )

  renderProfileDetails = () => {
    const {apiStatusForProfileDetails} = this.state
    switch (apiStatusForProfileDetails) {
      case apiStatusConstantsForProfileDetails.success:
        return this.renderProfileSuccessView()
      case apiStatusConstantsForProfileDetails.inProgress:
        return this.renderLoadingView()
      case apiStatusConstantsForProfileDetails.failure:
        return this.renderProfileFailureView()
      default:
        return null
    }
  }

  renderJobsListSuccessView = () => {
    const {jobsList} = this.state
    return (
      <ul className="jobs-list-container">
        {jobsList.map(eachJob => (
          <JobItem key={eachJob.id} jobDetails={eachJob} />
        ))}
      </ul>
    )
  }

  renderJobsListFailureView = () => (
    <div className="failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        className="failure-img"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button type="button" onClick={this.getJobsList} className="retry-btn">
        Retry
      </button>
    </div>
  )

  renderJobsListDetails = () => {
    const {apiStatusForJobsList} = this.state
    switch (apiStatusForJobsList) {
      case apiStatusConstantsForJobsList.success:
        return this.renderJobsListSuccessView()
      case apiStatusConstantsForJobsList.inProgress:
        return this.renderLoadingView()
      case apiStatusConstantsForJobsList.failure:
        return this.renderJobsListFailureView()
      default:
        return null
    }
  }

  renderNoJobsView = () => (
    <div className="no-jobs-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        className="no-jobs-img"
        alt="no jobs"
      />
      <h1>No Jobs Found</h1>
      <p>We could not find any jobs. Try other filters</p>
    </div>
  )

  render() {
    const {
      jobsList,
      searchInput,
      employmentType,
      minimumPackage,
      showTypeOFEmploymentOptions,
      showSalaryRangeOptions,
    } = this.state

    return (
      <div>
        <Header />
        <div className="jobs-bg-container">
          <div className="jobs-container">
            <div>
              <div className="profie-bg-container">
                {this.renderProfileDetails()}
              </div>
              <hr />
              <div className="filter-heading-container">
                <h1 className="type-heading">Type of Employment</h1>
                <button
                  type="button"
                  className="arrow-button"
                  onClick={this.onClickShowTypeOFEmploymentOptions}
                >
                  .
                  {showTypeOFEmploymentOptions && (
                    <FaSortUp className="arrow-icon" />
                  )}
                  {showTypeOFEmploymentOptions === false && (
                    <FaSortDown className="arrow-icon" />
                  )}
                </button>
              </div>

              <ul
                className={
                  showTypeOFEmploymentOptions
                    ? 'employment-type-list-container'
                    : 'hide-container'
                }
              >
                {employmentTypesList.map(eachType => (
                  <CheckboxFilterGroup
                    key={eachType.employmentTypeId}
                    employmentTypeDetails={eachType}
                    changeCheckboxInput={this.changeCheckboxInput}
                    value={employmentType}
                  />
                ))}
              </ul>
              <hr />
              <div className="filter-heading-container">
                <h1 className="salary-range-heading">Salary Range</h1>
                <button
                  type="button"
                  className="arrow-button"
                  onClick={this.onClickShowSalaryRangeOptions}
                >
                  .
                  {showSalaryRangeOptions && (
                    <FaSortUp className="arrow-icon" />
                  )}
                  {showSalaryRangeOptions === false && (
                    <FaSortDown className="arrow-icon" />
                  )}
                </button>
              </div>
              <ul
                className={
                  showSalaryRangeOptions
                    ? 'salary-list-container'
                    : 'hide-container'
                }
              >
                {salaryRangesList.map(eachRange => (
                  <RadioFilterGroup
                    key={eachRange.salaryRangeId}
                    salaryRangeDetails={eachRange}
                    changeRadioInput={this.changeRadioInput}
                    value={minimumPackage}
                  />
                ))}
              </ul>
            </div>
            <div>
              <div className="search-container">
                <input
                  type="search"
                  className="input-search"
                  placeholder="Search.."
                  onChange={this.onChangeSearchInput}
                  value={searchInput}
                />
                <button
                  type="button"
                  data-testid="searchButton"
                  onClick={this.onClickSearchIcon}
                  className="search-button"
                >
                  .<BsSearch className="search-icon" color="#000000" />
                </button>
              </div>
              {this.renderJobsListDetails()}
              {jobsList.length === 0 && this.renderNoJobsView()}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Jobs
