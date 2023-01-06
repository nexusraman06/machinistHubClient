import React, { useEffect } from 'react'
import Layout from '../Layout'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'

import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import axios from 'axios'
import { InputLabel } from '@mui/material'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import swal from 'sweetalert'
import ButtonComponent from '../Utils/ButtonComponent'
import Grid from '@mui/material/Grid'
const DataEntry = () => {
  const [client, setClient] = React.useState([])
  const [selectedClient, setSelectedClient] = React.useState('')
  const [quantity, setQuantity] = React.useState([])
  const [selectedFanRotorSize, setSelectedFanRotorSize] = React.useState('')
  const [date, setDate] = React.useState(Date.now())

  const handleChangeSelect = (event) => {
    setSelectedClient(event.target.value)
  }

  const handleQuantitySelect = (event) => {
    setQuantity(event.target.value)
  }

  const handleFanRotorSize = (event) => {
    setSelectedFanRotorSize(event.target.value)
  }
  const handleCancel = (event) => {
    setQuantity(0)
    setSelectedClient('')
    setSelectedFanRotorSize('')
  }

  const handleSubmit = async () => {
    let fanRotorBody = {
      client: selectedClient,
      rotorSize: selectedFanRotorSize,

      quantity: quantity,
      date: new Date(date),
    }
    let response = ''
    try {
      response = await axios.post(process.env.REACT_APP_BACKEND_LINK +'/fanRotor', fanRotorBody)

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
          text: 'User Aleardy Exist',
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

  const fanItems = {
    fanRotor: ["6'", "7'", '1"', '1.25"', "6' kit", '1" kit', '1.25 kit'],
  }

  useEffect(() => {
    axios.get( process.env.REACT_APP_BACKEND_LINK +`/client`).then((res) => {
      setClient(res.data)
    })
  }, [])
  return (
    <Layout title='Rotor Entry'>
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
                {client.map(
                  (cl, i) =>
                    cl.category === 'fan' && (
                      <MenuItem key={'clentsInFan' + i} value={cl.name}>
                        {cl.name}
                      </MenuItem>
                    )
                )}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={12 / 5}>
            <FormControl variant='standard' sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id='test-select-label'>Rotor Size</InputLabel>
              <Select
                value={selectedFanRotorSize}
                onChange={handleFanRotorSize}
              >
                {fanItems.fanRotor.map((item, i) => (
                  <MenuItem key={'fanItems' + i} value={item}>
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
              label='Quantity'
              variant='standard'
              value={quantity}
              onChange={handleQuantitySelect}
            />
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
    </Layout>
  )
}

export default DataEntry
