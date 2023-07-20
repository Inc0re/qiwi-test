import React, { useEffect, useState } from 'react'
import Selector from '../Selector/Selector'
import Display from '../Display/Display'
import './App.css'

function App() {
  const [currenciesData, setCurrenciesData] = useState({})
  const [currencyArray, setCurrencyArray] = useState([])
  const [selectedValue, setSelectedValue] = useState('')
  const [displayData, setDisplayData] = useState()

  function getCurrencies() {
    return fetch('https://www.cbr-xml-daily.ru/daily_json.js')
      .then(res => res.json())
      .then(data => {
        return data
      })
  }

  function handleSelect(e) {
    setSelectedValue(e.target.value)
  }

  function getCurrencyArray(data) {
    const currencyArray = []
    for (let key in data) {
      const { ID, Name, CharCode } = data[key]
      currencyArray.push({ code: CharCode, display: `${ID} - ${Name}` })
    }

    setCurrencyArray(currencyArray)
  }

  function formatDate(dateString) {
    const date = new Date(dateString)

    return date.toLocaleString('en-GB')
  }

  function getDisplyData(data, currency) {
    if (!data.Valute) return
    const { Name, Value, Previous, CharCode, ID } = data.Valute[currency]
    // получаем дату и форматируем ее
    const date = formatDate(data.Date)
    const prevDate = formatDate(data.PreviousDate)

    setDisplayData({
      date,
      prevDate,
      name: Name,
      value: Value,
      charCode: CharCode,
      id: ID,
      prevValue: Previous,
    })
  }

  // получаем данные с сервера
  useEffect(() => {
    getCurrencies()
      .then(data => {
        setCurrenciesData(data)
      })
      .catch(err => {
        console.log(err)
      })
  }, [])

  // получаем массив валют для селектора
  useEffect(() => {
    if (currenciesData.Valute) {
      getCurrencyArray(currenciesData.Valute)
    }
  }, [currenciesData])

  // при изменении выбора получаем данные для отображения
  useEffect(() => {
    if (currenciesData.Valute && selectedValue) {
      getDisplyData(currenciesData, selectedValue)
    }
  }, [selectedValue])

  return (
    <div className='app'>
      <h1 className='app__title'>Курс валют</h1>
      <Selector
        options={currencyArray}
        defaultOption='Выберите валюту'
        value={selectedValue}
        onChange={handleSelect}
      />
      {selectedValue && displayData && <Display data={displayData} />}
    </div>
  )
}

export default App
