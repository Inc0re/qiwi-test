const selector = document.querySelector('.selector')
const optionSelector = document.querySelector('.selector__option')
const display = document.querySelector('.display')
const displayTitle = document.querySelector('.display__title')
const rowNow = document.querySelector('.row-now')
const rowPrev = document.querySelector('.row-prev')
let data // переменная для данных с сервера

// получение данных с сервера
async function getCurrencies() {
  try {
    const response = await fetch('https://www.cbr-xml-daily.ru/daily_json.js')
    const data = await response.json()
    return data
  } catch (error) {
    console.error(error)
  }
}

// получение массива валют для селектора
function getCurrencyArray(data) {
  const currencyArray = []
  for (let key in data) {
    const { ID, Name, CharCode } = data[key]
    currencyArray.push({ code: CharCode, display: `${ID} - ${Name}` })
  }

  return currencyArray
}

// форматирование даты в вид dd.mm.yyyy hh:mm:ss
function formatDate(dateString) {
  const date = new Date(dateString)

  return date.toLocaleString('en-GB')
}

// преобразование данных для отображения в display
function getDisplayData(data, currency) {
  if (!data.Valute) return
  const { Name, Value, Previous, CharCode, ID } = data.Valute[currency]
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

// создание option для дальнейшего добавления в селектор
function getOption(data) {
  const option = optionSelector.cloneNode(true)
  option.textContent = data.display
  option.value = data.code
  return option
}

// обработчик события выбора валюты
function handleSelect(event) {
  // если выбрана пустая опция, то прячем display
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

// изменение видимости элемента
function changeVisibility(element, visibility) {
  if (visibility) {
    element.classList.remove('hidden')
  } else {
    element.classList.add('hidden')
  }
}

// основная функция
async function main() {
  changeVisibility(display, false) // прячем display
  data = await getCurrencies() // получаем данные с сервера
  const currencyArray = getCurrencyArray(data.Valute) // получаем массив валют

  // добавляем option для каждой валюты в селектор
  currencyArray.forEach(currency => {
    const option = getOption(currency)
    selector.append(option)
  })

  // установка обработчика события выбора валюты
  selector.addEventListener('change', handleSelect)
}

main()
