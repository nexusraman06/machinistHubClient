import React, { useState, useEffect } from 'react'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import axios from 'axios'
import '../Styles.css'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
const OverviewCard = () => {
  const [income, setIncome] = useState(0)
  const [expense, setExpenses] = useState(0)
  const [pnl, setPnl] = useState(0)

  useEffect(() => {
    axios.get(`/totalExpense`).then((res) => {
      setExpenses(res.data)
    })

    axios.get(`/totalIncome`).then((res) => {
      setIncome(res.data)
    })

    setPnl(income - expense)
  }, [])
  return (
    <div>
      <div>
        <FormControl
          className='formButton'
          variant='standard'
          sx={{ m: 1, minWidth: 120 }}
        >
          <Select
            labelId='demo-simple-select-standard-label'
            id='demo-simple-select-standard'
            label='Category'
          >
            <MenuItem value={'daily'}>Daily</MenuItem>
            <MenuItem value={'weekly'}>Weekly</MenuItem>
            <MenuItem value={'monthly'}>Monthly</MenuItem>
            <MenuItem value={'custom'}>Custom</MenuItem>

          </Select>
        </FormControl>
      </div>
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <Card>
            <CardContent className='dashboardCard'>
              <div className='baseFlex'>
                <Typography
                  sx={{ fontSize: 15 }}
                  color='text.secondary'
                  gutterBottom
                >
                  Total Income
                </Typography>
                <Typography
                  sx={{ fontSize: 15 }}
                  color='text.primary'
                  gutterBottom
                >
                  {income}
                </Typography>
              </div>
              <div className='baseFlex'>
                <Typography
                  sx={{ fontSize: 15 }}
                  color='text.secondary'
                  gutterBottom
                >
                  Total Expense
                </Typography>
                <Typography
                  sx={{ fontSize: 15 }}
                  color='text.primary'
                  gutterBottom
                >
                  {expense}
                </Typography>
              </div>

              <div className='baseFlex'>
                <Typography
                  sx={{ fontSize: 15 }}
                  color='text.secondary'
                  gutterBottom
                >
                  Total
                </Typography>
                <Typography
                  sx={{ fontSize: 15 }}
                  color='text.primary'
                  gutterBottom
                >
                  {pnl}
                </Typography>
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  )
}

export default OverviewCard
