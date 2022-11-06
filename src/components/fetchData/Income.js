import React, { useState, useEffect } from 'react'
import axios from 'axios'

const Income = () => {
  const [income, setIncome] = useState([])
  useEffect(() => {
    axios.get(`/income`).then((res) => {
      setIncome(res.data)
    })
  }, [])

  return income
}

export default Income
