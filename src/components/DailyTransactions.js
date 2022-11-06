import React, { useEffect, useState } from 'react'
import { styled } from '@mui/material/styles'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import axios from 'axios'
import moment from 'moment'
import AccordianComponent from './Utils/AccordianComponent'

const DailyTransactions = () => {
  const [expenses, setExpenses] = useState([])
  const [income, setIncome] = useState([])

  useEffect(() => {
    axios.get(`/expense`).then((res) => {
      const expense = res.data
      setExpenses(expense)
    })

    axios.get(`/income`).then((res) => {
      const income = res.data
      setIncome(income)
    })
  }, [])

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }))

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }))

  return (
    <div>
      <AccordianComponent heading='Expenses'>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label='customized table'>
            <TableHead>
              <TableRow>
                <StyledTableCell>Payee</StyledTableCell>
                <StyledTableCell align='right'>Amount</StyledTableCell>
                <StyledTableCell align='right'>Reason</StyledTableCell>
                <StyledTableCell align='right'>Date</StyledTableCell>
                <StyledTableCell align='right'>Medium</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {expenses.map((row) => (
                <StyledTableRow key={row.name}>
                  <StyledTableCell component='th' scope='row'>
                    {row.payee}
                  </StyledTableCell>
                  <StyledTableCell align='right'>{row.amount}</StyledTableCell>
                  <StyledTableCell align='right'>{row.reason}</StyledTableCell>
                  <StyledTableCell align='right'>
                    {moment(row.date).format('MMMM Do YYYY, h:mm a')}
                  </StyledTableCell>
                  <StyledTableCell align='right'>{row.medium}</StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </AccordianComponent>
      <AccordianComponent heading='Income'>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label='customized table'>
            <TableHead>
              <TableRow>
                <StyledTableCell>Client</StyledTableCell>
                <StyledTableCell align='right'>Amount</StyledTableCell>
                <StyledTableCell align='right'>Reason</StyledTableCell>
                <StyledTableCell align='right'>Date</StyledTableCell>
                <StyledTableCell align='right'>Medium</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {income.map((row) => (
                <StyledTableRow key={row.name}>
                  <StyledTableCell component='th' scope='row'>
                    {row.client}
                  </StyledTableCell>
                  <StyledTableCell align='right'>{row.amount}</StyledTableCell>
                  <StyledTableCell align='right'>{row.reason}</StyledTableCell>
                  <StyledTableCell align='right'>
                    {moment(row.date).format('MMMM Do YYYY, h:mm a')}
                  </StyledTableCell>
                  <StyledTableCell align='right'>{row.medium}</StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </AccordianComponent>
    </div>
  )
}

export default DailyTransactions
