const selector = document.querySelector('.selector')
const optionSelector = document.querySelector('.selector__option')
const display = document.querySelector('.display')
const displayTitle = document.querySelector('.display__title')
const rowNow = document.querySelector('.row-now')
const rowPrev = document.querySelector('.row-prev')
let data
// let currenciesData, currencyArray

async function getCurrencies() {
  try {
    const response = await fetch('https://www.cbr-xml-daily.ru/daily_json.js')
    const data = await response.json()
    return data
  } catch (error) {
    console.error(error)
  }
}

function getCurrencyArray(data) {
  const currencyArray = []
  for (let key in data) {
    const { ID, Name, CharCode } = data[key]
    currencyArray.push({ code: CharCode, display: `${ID} - ${Name}` })
  }

  return currencyArray
}

function formatDate(dateString) {
  const date = new Date(dateString)

  return date.toLocaleString('en-GB')
}

function getDisplayData(data, currency) {
  if (!data.Valute) return
  const { Name, Value, Previous, CharCode, ID } = data.Valute[currency]
  // получаем дату и форматируем ее
  const date = formatDate(data.Date)
  const prevDate = formatDate(data.PreviousDate)

  return {
    date,
    prevDate,
    name: Name,
    value: Value,
    charCode: CharCode,
    id: ID,
    prevValue: Previous,
  }
}

function getOption(data) {
  const option = optionSelector.cloneNode(true)
  option.textContent = data.display
  option.value = data.code
  return option
}

function handleSelect(event) {
  if (!event.target.value) {
    changeVisibility(display, false)
    return
  }
  const currency = event.target.value
  const currencyData = getDisplayData(data, currency)
  displayTitle.textContent = currencyData.name
  rowNow.textContent = `${currencyData.value} ${currencyData.charCode}`
  rowPrev.textContent = `${currencyData.prevValue} ${currencyData.charCode}`
  changeVisibility(display, true)
}

function changeVisibility(element, visibility) {
  if (visibility) {
    element.classList.remove('hidden')
  } else {
    element.classList.add('hidden')
  }
}

async function main() {
  changeVisibility(display, false)
  data = await getCurrencies()
  const currencyArray = getCurrencyArray(data.Valute)

  currencyArray.forEach(currency => {
    const option = getOption(currency)
    selector.append(option)
  })
}

main()

selector.addEventListener('change', handleSelect)
