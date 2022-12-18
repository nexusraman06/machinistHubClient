import React, { useState } from 'react'
import DailyActivities from './DailyActivities'
import DailyTransactions from './DailyTransactions'
import OverviewCard from './Utils/OverviewCard'
import Layout from './Layout'
import './Styles.css'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
const Reports = () => {
  const [calender, setCalender] = useState('daily')
  const handleChange = (event) => {
    setCalender(event.target.value)
  }

  return (
    <Layout title='Reports'>
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
      <OverviewCard calenderValue={calender} className='reportMargin' />
      <DailyTransactions calenderValue={calender} className='reportMargin' />
      <DailyActivities calenderValue={calender} className='reportMargin' />
    </Layout>
  )
}

export default Reports
