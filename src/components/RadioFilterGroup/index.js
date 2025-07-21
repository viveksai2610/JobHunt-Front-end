import './index.css'

const RadioFilterGroup = props => {
  const {salaryRangeDetails, changeRadioInput, value} = props
  const {label, salaryRangeId} = salaryRangeDetails

  const onChangeRadioInput = () => {
    changeRadioInput(salaryRangeId)
  }

  return (
    <li className="salary-range-item-container">
      <div className="radio-label-container">
        <input
          type="radio"
          className="input-radio"
          id={salaryRangeId}
          onChange={onChangeRadioInput}
          value={value}
          name="salary"
        />
        <label className="label" htmlFor={salaryRangeId}>
          {label}
        </label>
      </div>
    </li>
  )
}
export default RadioFilterGroup
