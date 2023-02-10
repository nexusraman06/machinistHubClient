import { Box, Paper } from '@mui/material'
import React, { useEffect, useState } from 'react'
import MicsData from './MicsData'
import axios from 'axios'
const Client = () => {
  const [client, setClient] = useState('')
  const [clients, setClients] = useState('')
  const [balance, setBalance] = useState('')

  useEffect(() => {
    setClient(
      window.location.href.split('/')[
        window.location.href.split('/').length - 1
      ]
    )
    axios.get(process.env.REACT_APP_BACKEND_LINK + `/client`).then((res) => {
      const persons = res.data
      setClients(persons)
    })
  }, [])

  return (
    <Box m='20px'>
      <Paper elevation={3}>
        <h2>Account Details</h2>
        <h3>Balance:</h3>
      </Paper>
    </Box>
  )
}

export default Client
