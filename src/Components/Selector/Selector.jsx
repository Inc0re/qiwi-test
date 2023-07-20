import './Selector.css'

function Selector({ defaultOption, options, value, onChange }) {
  return (
    <select className="selector" value={value} onChange={onChange}>
      <option  value=''>{defaultOption}</option>
      {options.map(option => (
        <option key={option.code} value={option.code}>
          {option.display}
        </option>
      ))}
    </select>
  )
}

export default Selector
