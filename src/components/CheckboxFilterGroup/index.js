import './index.css'

const CheckboxFilterGroup = props => {
  const {employmentTypeDetails, changeCheckboxInput, value} = props
  const {label, employmentTypeId} = employmentTypeDetails

  const onChangeCheckboxInput = () => {
    changeCheckboxInput(employmentTypeId)
  }

  return (
    <li className="employment-type-item-container">
      <div className="checkbox-label-container">
        <input
          type="checkbox"
          className="input-checkbox"
          id={employmentTypeId}
          onChange={onChangeCheckboxInput}
          value={value}
        />
        <label className="label" htmlFor={employmentTypeId}>
          {label}
        </label>
      </div>
    </li>
  )
}
export default CheckboxFilterGroup
