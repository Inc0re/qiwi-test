import './Display.css'

function Display({data}) {
    return (
      <div className='display'>
        <h2 className='display__title'>{`${data.id} - ${data.name} (${data.charCode}).`}</h2>
        <p className='display__row'>{`${data.date} - ${data.value}`}</p>
        <p className='display__row'>{`${data.prevDate} - ${data.prevValue}`}</p>
      </div>
    )
}

export default Display