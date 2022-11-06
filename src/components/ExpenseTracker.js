import React from 'react'
import Layout from './Layout'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'

import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'

const ExpenseTracker = () => {
  const [category, setCategory] = React.useState('expense')
  const handleChange = (event) => {
    setCategory(event.target.value)
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
        <Box
          component='form'
          sx={{
            '& .MuiTextField-root': { m: 1, width: '25ch' },
          }}
          noValidate
          autoComplete='off'
        >
          <div>
            <TextField
              required
              id='standard-required'
              label='Client'
              variant='standard'
            />
            <TextField
              required
              id='standard-required'
              label='Amount'
              variant='standard'
            />
            <TextField
              required
              id='standard-required'
              label='Reason'
              variant='standard'
            />
          </div>
        </Box>
      )}
      {category === 'expense' && (
        <Box
          component='form'
          sx={{
            '& .MuiTextField-root': { m: 1, width: '25ch' },
          }}
          noValidate
          autoComplete='off'
        >
          <div>
            <TextField
              required
              id='standard-required'
              label='Payee'
              variant='standard'
            />
            <TextField
              required
              id='standard-required'
              label='Reason'
              variant='standard'
            />
            <TextField
              required
              id='standard-required'
              label='Amount'
              variant='standard'
            />
          </div>
        </Box>
      )}
    </Layout>
  )
}

export default ExpenseTracker
