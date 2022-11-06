import React, { useEffect } from 'react'
import Layout from './Layout'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'

import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import axios from 'axios'

const DataEntry = () => {
  const [category, setCategory] = React.useState('submersible')
  const [client, setClient] = React.useState([])
  const [selectedClient, setSelectedClient] = React.useState('')
  const [quantity, setQuantity] = React.useState(0)
  const [rotorSize, setRototSize] = React.useState('')
  const [shaftSize, setShaftSize] = React.useState('')

  const handleChange = (event) => {
    setCategory(event.target.value)
  }

  const handleChangeSelect = (event) => {
    setSelectedClient(event.target.value)
  }

  const handleSubmit = async () => {
    let body = {}
  }

  useEffect(() => {
    axios.get(`/client`).then((res) => {
      setClient(res.data)
    })
  }, [])
  console.log(category)
  return (
    <Layout title='Data Entry'>
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
            <MenuItem value={'fan'}>Fan</MenuItem>
            <MenuItem value={'submersible'}>Submersible</MenuItem>
          </Select>
        </FormControl>
      </div>
      {category === 'fan' && (
        <Box display='flex' alignItems='center'>
          <Box
            display='flex'
            justify='center'
            alignItems='end'
            component='form'
            sx={{
              '& .MuiTextField-root': { m: 1, width: '25ch' },
            }}
            noValidate
            autoComplete='off'
          >
            <FormControl variant='standard' sx={{ m: 1, minWidth: 120 }}>
              <Select value={selectedClient} onChange={handleChangeSelect}>
                {client.map(
                  (cl, i) =>
                    cl.category === category && (
                      <MenuItem key={'cl' + i} value={cl.name}>
                        {cl.name}
                      </MenuItem>
                    )
                )}
              </Select>
            </FormControl>
            <TextField
              required
              id='standard-required'
              label='Rotor Size'
              variant='standard'
              value={rotorSize}
            />
            <TextField
              required
              id='standard-required'
              label='Shaft Size'
              variant='standard'
              value={shaftSize}
            />
            <TextField
              required
              id='standard-required'
              label='Quantity'
              variant='standard'
              value={quantity}
            />
          </Box>
          <Button size='medium' variant='contained'>
            Submit
          </Button>
        </Box>
      )}
      {category === 'submersible' && (
        <Box display='flex' alignItems='center'>
          <Box
            display='flex'
            justify='center'
            alignItems='end'
            component='form'
            sx={{
              '& .MuiTextField-root': { m: 1, width: '25ch' },
            }}
            noValidate
            autoComplete='off'
          >
            <FormControl variant='standard' sx={{ m: 1, minWidth: 120 }}>
              <Select value={selectedClient} onChange={handleChangeSelect}>
                {client.map(
                  (cl, i) =>
                    cl.category === category && (
                      <MenuItem key={'cl' + i} value={cl.name}>
                        {cl.name}
                      </MenuItem>
                    )
                )}
              </Select>
            </FormControl>
            <TextField
              required
              id='standard-required'
              label='Size'
              variant='standard'
            />
            <TextField
              required
              id='standard-required'
              label='Quantity'
              variant='standard'
            />
            <Button size='medium' variant='contained'>
              Sumbit
            </Button>
          </Box>
        </Box>
      )}
    </Layout>
  )
}

export default DataEntry
