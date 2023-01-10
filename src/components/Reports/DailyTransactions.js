import React, { useEffect, useState } from 'react'
import { styled } from '@mui/material/styles'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import axios from 'axios'
import moment from 'moment'
import AccordianComponent from '../Utils/AccordianComponent'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import TablePagination from '@mui/material/TablePagination'
import MicsData from '../MicsData'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import ModalComponent from '../Utils/ModelComponent'
import swal from 'sweetalert'
const DailyTransactions = (props) => {
  const [open, setOpen] = React.useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)
  const [expense, setExpense] = useState([])
  const [income, setIncome] = useState([])

  const [category, setCategory] = React.useState('income')
  const [formattedIncome, setFormattedIncome] = useState([])
  const [formattedExpenses, setFormattedExpenses] = useState([])
  const [res, setRes] = useState('')
  const onHandleDelete = async (_id, category) => {
    setRes('')
    let body = {
      _id: _id,
      category: category,
    }
    try {
      const response = await axios.post(
        process.env.REACT_APP_BACKEND_LINK + '/deleteExpense',
        body
      )
      setRes(response)
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

  const handleChange = (event) => {
    setCategory(event.target.value)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  //Fetch Expense and Income Data
  useEffect(() => {
    if (category === 'expense') {
      axios.get(process.env.REACT_APP_BACKEND_LINK + `/expense`).then((res) => {
        const expense = res.data
        setExpense(expense)
      })
    }
    if (category === 'income') {
      axios.get(process.env.REACT_APP_BACKEND_LINK + `/income`).then((res) => {
        const income = res.data
        setIncome(income)
      })
    }
  }, [category, res])

  //Filter Expenses and Income based on calender
  useEffect(() => {
    setFormattedIncome([])
    setFormattedExpenses([])
    let backwardDate = new Date()
    if (props.calenderValue === 'weekly') {
      backwardDate.setDate(backwardDate.getDate() - 7)
    }
    if (props.calenderValue === 'monthly') {
      backwardDate.setDate(backwardDate.getDate() - 30)
    }

    let incomeArr = []
    let expenseArr = []

    //Daily Filter
    //Income
    if (props.calenderValue === 'daily') {
      for (let i = 0; i < income.length; i++) {
        if (
          new Date().toLocaleDateString() ===
          new Date(income[i].date).toLocaleDateString()
        ) {
          incomeArr.push(income[i])
          setFormattedIncome(incomeArr)
        }
      }
      //Daily Filter
      //Expense
      for (let i = 0; i < expense.length; i++) {
        if (
          new Date().toLocaleDateString() ===
          new Date(expense[i].date).toLocaleDateString()
        ) {
          expenseArr.push(expense[i])
          setFormattedExpenses(expenseArr)
        }
      }
      //Custom Filter
    } else if (
      props.calenderValue === 'weekly' ||
      props.calenderValue === 'monthly'
    ) {
      for (let i = 0; i < income.length; i++) {
        if (
          new Date(income[i].date).getTime() >= backwardDate.getTime() &&
          new Date(income[i].date).getTime() <= Date.now()
        ) {
          incomeArr.push(income[i])
          setFormattedIncome(incomeArr)
        }
      }
      for (let i = 0; i < expense.length; i++) {
        if (
          new Date(expense[i].date).getTime() >= backwardDate.getTime() &&
          new Date(expense[i].date).getTime() <= Date.now()
        ) {
          expenseArr.push(expense[i])
          setFormattedExpenses(expenseArr)
        }
      }
    } else if (props.customDates[0] || props.customDates[1]) {
      for (let i = 0; i < income.length; i++) {
        if (
          new Date(income[i].date).getTime() >= props.customDates[0] &&
          new Date(income[i].date).getTime() <= props.customDates[1]
        ) {
          incomeArr.push(income[i])
          setFormattedIncome(incomeArr)
        }
      }
      for (let i = 0; i < expense.length; i++) {
        if (
          new Date(expense[i].date).getTime() >= props.customDates[0] &&
          new Date(expense[i].date).getTime() <= props.customDates[1]
        ) {
          expenseArr.push(expense[i])
          setFormattedExpenses(expenseArr)
        }
      }
    }
  }, [props.calenderValue, expense, income, props.customDates])

  useEffect(() => {}, [expense])

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.success.light,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }))

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: '#b9dceb',
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }))

  return (
    <AccordianComponent heading='Daily Transactions'>
      <ModalComponent
        open={open}
        handleOpen={handleOpen}
        handleClose={handleClose}
      />
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
          <MenuItem value={'expense'}>Expenses</MenuItem>
          <MenuItem value={'income'}>Income</MenuItem>
        </Select>
      </FormControl>

      {category === 'expense' && (
        <TableContainer sx={{ maxHeight: 350 }}>
          <Table stickyHeader aria-label='sticky table'>
            <TableHead>
              <TableRow>
                {MicsData.expenseColumn.map((cl, i) => (
                  <StyledTableCell
                    key={'clExpenseMics' + i}
                    align={cl.align}
                    style={{ minWidth: cl.minWidth }}
                  >
                    {cl.label}
                  </StyledTableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {formattedExpenses
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return (
                    <StyledTableRow
                      hover
                      role='checkbox'
                      tabIndex={-1}
                      key={row.code}
                    >
                      <TableCell>{row.payee}</TableCell>
                      <TableCell>{row.amount}</TableCell>
                      <TableCell>{row.reason}</TableCell>
                      <TableCell>
                        {moment(row.date).format('MMMM Do YYYY, h:mm a')}
                      </TableCell>
                      <TableCell>{row.medium}</TableCell>
                      <TableCell>
                        <DeleteForeverIcon
                          onClick={() => onHandleDelete(row._id, category)}
                        ></DeleteForeverIcon>
                      </TableCell>
                    </StyledTableRow>
                  )
                })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {category === 'income' && (
        <TableContainer sx={{ maxHeight: 350 }}>
          <Table stickyHeader aria-label='sticky table'>
            <TableHead>
              <TableRow>
                {MicsData.incomeColumn.map((cl, i) => (
                  <StyledTableCell
                    key={'cl' + i}
                    align={cl.align}
                    style={{ minWidth: cl.minWidth }}
                  >
                    {cl.label}
                  </StyledTableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {formattedIncome
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return (
                    <StyledTableRow
                      hover
                      role='checkbox'
                      tabIndex={-1}
                      key={row.code}
                    >
                      <TableCell>{row.client}</TableCell>
                      <TableCell>{row.amount}</TableCell>
                      <TableCell>{row.reason}</TableCell>
                      <TableCell>
                        {moment(row.date).format('MMMM Do YYYY, h:mm a')}
                      </TableCell>
                      <TableCell>{row.medium}</TableCell>
                      <TableCell>
                        <DeleteForeverIcon
                          onClick={() => onHandleDelete(row._id, category)}
                        ></DeleteForeverIcon>
                      </TableCell>
                    </StyledTableRow>
                  )
                })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <TablePagination
        rowsPerPageOptions={[5, 10, 30]}
        component='div'
        count={
          category === 'expense'
            ? formattedExpenses.length
            : formattedIncome.length
        }
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </AccordianComponent>
  )
}

export default DailyTransactions
