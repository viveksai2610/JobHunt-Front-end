import './index.css'

const SkillItem = props => {
  const {skillDetails} = props
  const {imageUrl, name} = skillDetails
  return (
    <li className="skill-item-container">
      <img src={imageUrl} className="skill-image" alt={name} />
      <p>{name}</p>
    </li>
  )
}

export default SkillItem
