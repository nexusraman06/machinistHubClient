import React, { useEffect, useState } from 'react'
import DailyActivities from './DailyActivities'
import DailyTransactions from './DailyTransactions'
import OverviewCard from './Utils/OverviewCard'
import Layout from './Layout'
import './Styles.css'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker'

import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import { Box } from '@mui/material'
import moment from 'moment'
const Reports = () => {
  const [calender, setCalender] = useState('daily')
  const handleChange = (event) => {
    setCalender(event.target.value)
  }
  const [fromValue, setFromValue] = React.useState()
  const [toValue, setToValue] = React.useState()
  const [formattedFromDate, setFormattedFromDate] = React.useState()
  const [formattedToDate, setFormattedToDate] = React.useState()

  const handleFromDateChange = (newValue) => {
    setFromValue(newValue.$d.getTime())
    console.log(newValue)
  }
  const handleToDateChange = (newValue) => {
    setToValue(newValue.$d.getTime())
  }

  useEffect(() => {
    const backwardDate = new Date()
    if (calender === 'custom') {

      setFormattedFromDate(fromValue)
      setFormattedToDate(toValue)
    } else if (calender === 'daily') {
      setFormattedFromDate(Date.now())
      setFormattedToDate(Date.now())
    } else if (calender === 'weekly') {
      setFormattedFromDate(backwardDate.setDate(backwardDate.getDate() - 7))
      setFormattedToDate(Date.now())
    } else if (calender === 'monthly') {
      setFormattedFromDate(backwardDate.setDate(backwardDate.getDate() - 30))
      setFormattedToDate(Date.now())
    }
  }, [fromValue, toValue, calender])

  return (
    <Layout title='Reports'>
      <Box
        display='flex'
        justifyContent='space-between'
        flexDirection='row-reverse'
      >
        <Box width='440px'>
          <Box display='flex' justifyContent='right'>
            {calender === 'custom' && (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Stack spacing={1} width='150px' height='0px'>
                  <DesktopDatePicker
                    label='From'
                    inputFormat='MM/DD/YYYY'
                    value={fromValue}
                    onChange={handleFromDateChange}
                    renderInput={(params) => (
                      <TextField size='small' {...params} />
                    )}
                  />
                </Stack>
              </LocalizationProvider>
            )}
            {calender === 'custom' && (
              <>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Stack spacing={1} width='150px' height='0px'>
                    <DesktopDatePicker
                      label='To'
                      inputFormat='MM/DD/YYYY'
                      value={toValue}
                      onChange={handleToDateChange}
                      renderInput={(params) => (
                        <TextField size='small' {...params} />
                      )}
                    />
                  </Stack>
                </LocalizationProvider>
              </>
            )}
            <FormControl
              className='formButton'
              variant='standard'
              sx={{ m: 1, minWidth: 120 }}
            >
              <Select
                labelId='demo-simple-select-standard-label'
                id='demo-simple-select-standard'
                label='Category'
                value={calender}
                onChange={handleChange}
              >
                <MenuItem value={'daily'}>Daily</MenuItem>
                <MenuItem value={'weekly'}>Weekly</MenuItem>
                <MenuItem value={'monthly'}>Monthly</MenuItem>
                <MenuItem value={'custom'}>Custom</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box
            display='flex'
            alignItems='center'
            justifyContent='space-between'
          >
            <h4>Date Range:</h4>
            <Box display='flex' alignItems='center'>
              <h4>{moment(formattedFromDate).format('MMM Do YY')}</h4> -
              <h4>{moment(formattedToDate).format('MMM Do YY')}</h4>
            </Box>
          </Box>
        </Box>

        <OverviewCard
          calenderValue={calender}
          customDates={[fromValue, toValue]}
          className='reportMargin'
        />
      </Box>

      <DailyTransactions
        calenderValue={calender}
        customDates={[fromValue, toValue]}
        className='reportMargin'
      />
      <DailyActivities
        calenderValue={calender}
        customDates={[fromValue, toValue]}
        className='reportMargin'
      />
    </Layout>
  )
}

export default Reports
