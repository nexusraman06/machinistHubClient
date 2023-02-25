import { Box, Card, Paper } from '@mui/material'
import React, { useEffect, useState } from 'react'
import MicsData from './MicsData'
import axios from 'axios'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
const Client = () => {
  const [client, setClient] = useState('')
  const [clients, setClients] = useState([])
  const [balance, setBalance] = useState('')
  const [clientName, setClientName] = useState('')
  const [entries, setEntries] = useState([])
  const [payments, setPayments] = useState([])
  const [priceList, setPriceList] = useState({})
  useEffect(() => {
    setClientName(
      window.location.href.split('/')[
        window.location.href.split('/').length - 1
      ]
    )
    axios.get(process.env.REACT_APP_BACKEND_LINK + `/client`).then((res) => {
      const persons = res.data
      setClients(persons)
    })
  }, [])

  useEffect(() => {
    const arr = clients.filter((item) => item.name === clientName)
    setPriceList(MicsData.priceList.clientName)
    console.log(arr)
    setClient(arr)
    setEntries(client[0]?.entries)
    setPayments(client[0]?.payments)
    //balance calculate
    let bal = client[0]?.balance
    for (let i = 0; i < client[0]?.payments.length; i++) {
      console.log(client[0]?.payments[i].amount)
      bal -= client[0]?.payments[i].amount
    }
    setBalance(bal)
  }, [clients])

  console.log(priceList)
  return (
    <Box m='20px'>
      <Paper elevation={3} sx={{ padding: 3 }}>
        <h2>Account Details</h2>
        <h3>Name: {clientName} </h3>
        <h3>Balance:{balance} </h3>
        <Card sx={{ minWidth: 275, margin: 3, padding: 3 }} elevation={3}>
          <CardContent>
            <Typography
              sx={{ fontSize: 14 }}
              color='text.secondary'
              gutterBottom
            >
              Word of the Day
            </Typography>
            <Typography variant='h5' component='div'>
              dasdas
            </Typography>
            <Typography sx={{ mb: 1.5 }} color='text.secondary'>
              adjective
            </Typography>
            <Typography variant='body2'>
              well meaning and kindly.
              <br />
              {'"a benevolent smile"'}
            </Typography>
          </CardContent>
          <CardActions>
            <Button size='small'>Learn More</Button>
          </CardActions>
        </Card>
      </Paper>
    </Box>
  )
}

export default Client
