import React, { useEffect } from 'react'
import Layout from '../Layout'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import { InputLabel } from '@mui/material'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import ButtonComponent from '../Utils/ButtonComponent'
import swal from 'sweetalert'
import axios from 'axios'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import Grid from '@mui/material/Grid'

const ExpenseTracker = () => {
  const [category, setCategory] = React.useState('expense')
  const [date, setDate] = React.useState(Date.now())
  const [client, setClient] = React.useState([])
  const [selectedClient, setSelectedClient] = React.useState('')
  const [selectedReason, setSelectedReason] = React.useState('')
  const [selectedPayee, setSelectedPayee] = React.useState('')
  const [selectedAmount, setSelectedAmount] = React.useState()
  const [selectedMedium, setSelectedMedium] = React.useState('')

  const handleChange = (event) => {
    setCategory(event.target.value)
  }

  const handleChangeSelect = (event) => {
    setSelectedClient(event.target.value)
  }

  const handleReason = (event) => {
    setSelectedReason(event.target.value)
  }

  const handleAmount = (event) => {
    setSelectedAmount(event.target.value)
  }

  const handlePayee = (event) => {
    setSelectedPayee(event.target.value)
  }

  const handleMedium = (event) => {
    setSelectedMedium(event.target.value)
  }
  const handleCancel = (event) => {
    setSelectedPayee('')
    setSelectedAmount(0)
    setSelectedReason('')
    setSelectedClient('')
    setSelectedMedium('')
  }

  const handleSubmit = async () => {
    let expenseBody = {
      payee: selectedPayee,
      reason: selectedReason,
      amount: selectedAmount,
      date: new Date(date),
      medium: selectedMedium,
    }
    let incomeBody = {
      client: selectedClient,
      reason: selectedReason,
      amount: selectedAmount,
      date: new Date(date),
      medium: selectedMedium,
    }
    let response = ''

    try {
      if (category === 'expense') {
        response = await axios.post('/expense', expenseBody)
      }
      if (category === 'income') {
        response = await axios.post('/income', incomeBody)
      }
      swal({
        title: 'Success!',
        text: response.data.message,
        icon: 'success',
        button: 'OK!',
        width: '100px',
      })
    } catch (e) {
      if (e.message.includes('status')) {
        swal({
          title: 'Error!',
          text: 'Data exist',
          icon: 'error',
          button: 'OK!',
        })
      }
      if (e.message.includes('Network'))
        swal({
          title: 'Error!',
          text: e.message,
          icon: 'error',
          button: 'OK!',
          width: '100px',
        })
    }
  }

  useEffect(() => {
    axios.get(`/client`).then((res) => {
      setClient(res.data)
    })
  }, [])

  const reasons = {
    expenseReasons: [
      'Labour Cost',
      'Oil',
      'Hardware',
      'Electricity',
      'Maintenence',
      'Mics',
    ],
    incomeReasons: [
      'Fan Payment',
      'Submersible Payment',
      'Scrap Payment',
      'Mics',
    ],
  }
  return (
    <Layout title='Expense Tracker'>
      <div>
        <FormControl
          className='formButton'
          variant='standard'
          sx={{ m: 1, minWidth: 120 }}
        >
          <Select
            labelId='demo-simple-select-standard-label'
            id='demo-simple-select-standard'
            value={category}
            label='Category'
            onChange={handleChange}
          >
            <MenuItem value={'expense'}>Expense</MenuItem>
            <MenuItem value={'income'}>Income</MenuItem>
          </Select>
        </FormControl>
      </div>
      {category === 'income' && (
        <Box>
          <Grid
            container
            display='flex'
            justifyContent='space-around'
            alignItems='end'
            component='form'
            sx={{
              '& .MuiTextField-root': { m: 1, width: '25ch' },
              mb: 3,
            }}
            noValidate
            autoComplete='off'
          >
            <Grid item xs={12} sm={6} md={4} lg={12 / 5}>
              <FormControl variant='standard' sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id='test-select-label'>Client</InputLabel>
                <Select value={selectedClient} onChange={handleChangeSelect}>
                  {client.map((cl, i) => (
                    <MenuItem key={'clentsExpense' + i} value={cl.name}>
                      {cl.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={12 / 5}>
              <FormControl variant='standard' sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id='test-select-label'>Reason</InputLabel>
                <Select value={selectedReason} onChange={handleReason}>
                  {reasons.incomeReasons.map((item, i) => (
                    <MenuItem key={'incomeReasons' + i} value={item}>
                      {item}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={12 / 5}>
              <TextField
                required
                id='standard-required'
                label='Amount'
                variant='standard'
                value={selectedAmount}
                onChange={handleAmount}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={12 / 5}>
              <FormControl variant='standard' sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id='test-select-label'>Medium</InputLabel>
                <Select value={selectedMedium} onChange={handleMedium}>
                  <MenuItem value={'Cash'}>Cash</MenuItem>
                  <MenuItem value={'Transfer'}>Transfer</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={12 / 5}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label='Date'
                  value={date}
                  onChange={(newValue) => {
                    setDate(newValue)
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>

          <ButtonComponent
            submitLabel='Submit'
            cancelLabel='Cancel'
            submit={handleSubmit}
            cancel={handleCancel}
          />
        </Box>
      )}
      {category === 'expense' && (
        <Box>
          <Grid
            container
            display='flex'
            justifyContent='space-around'
            alignItems='end'
            component='form'
            sx={{
              '& .MuiTextField-root': { m: 1, width: '25ch' },
              mb: 3,
            }}
            noValidate
            autoComplete='off'
          >
            <Grid item xs={12} sm={6} md={4} lg={12 / 5}>
              <TextField
                required
                id='standard-required'
                label='Payee'
                variant='standard'
                value={selectedPayee}
                onChange={handlePayee}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4} lg={12 / 5}>
              <FormControl variant='standard' sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id='test-select-label'>Reason</InputLabel>
                <Select value={selectedReason} onChange={handleReason}>
                  {reasons.expenseReasons.map((item, i) => (
                    <MenuItem key={'expenseReasons' + i} value={item}>
                      {item}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={4} lg={12 / 5}>
              <TextField
                required
                id='standard-required'
                label='Amount'
                variant='standard'
                value={selectedAmount}
                onChange={handleAmount}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4} lg={12 / 5}>
              <FormControl variant='standard' sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id='test-select-label'>Medium</InputLabel>
                <Select value={selectedMedium} onChange={handleMedium}>
                  <MenuItem value={'Cash'}>Cash</MenuItem>
                  <MenuItem value={'Transfer'}>Transfer</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={4} lg={12 / 5}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label='Date'
                  value={date}
                  onChange={(newValue) => {
                    setDate(newValue)
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>

          <ButtonComponent
            submitLabel='Submit'
            cancelLabel='Cancel'
            submit={handleSubmit}
            cancel={handleCancel}
          />
        </Box>
      )}
    </Layout>
  )
}

export default ExpenseTracker
