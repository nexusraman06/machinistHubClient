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
import AccordianComponent from './Utils/AccordianComponent'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import moment from 'moment'
import TablePagination from '@mui/material/TablePagination'
import MicsData from './MicsData'
const DailyActivities = (props) => {
  const [category, setCategory] = React.useState('submersible')
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)
  const [submersibleData, setSubmersibleData] = useState([])
  const [fanData, setFanData] = useState([])
  const [formattedFanData, setFormattedFanData] = useState([])
  const [formattedSubData, setFormattedSubData] = useState([])
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

  useEffect(() => {
    if (category === 'submersible') {
      axios.get(`/submersible`).then((res) => {
        setSubmersibleData(res.data)
      })
    }

    if (category === 'fan') {
      axios.get(`/fan`).then((res) => {
        setFanData(res.data)
      })
    }
  }, [category])

  useEffect(() => {
    setFormattedFanData([])
    setFormattedSubData([])
    let backwardDate = new Date()
    if (props.calenderValue === 'weekly') {
      backwardDate.setDate(backwardDate.getDate() - 7)
    }
    if (props.calenderValue === 'monthly') {
      backwardDate.setDate(backwardDate.getDate() - 30)
    }

    let subArr = []
    let fanArr = []
    if (props.calenderValue === 'daily') {
      setFormattedSubData([])
      setFormattedFanData([])
      for (let i = 0; i < fanData.length; i++) {
        if (
          new Date().toLocaleDateString() ===
          new Date(fanData[i].date).toLocaleDateString()
        ) {
          fanArr.push(fanData[i])
          setFormattedFanData(fanArr)
        }
      }
      for (let i = 0; i < submersibleData.length; i++) {
        if (
          new Date().toLocaleDateString() ===
          new Date(submersibleData[i].date).toLocaleDateString()
        ) {
          subArr.push(submersibleData[i])
          setFormattedSubData(subArr)
        }
      }
    } else if (
      props.calenderValue === 'weekly' ||
      props.calenderValue === 'monthly'
    ) {
      for (let i = 0; i < fanData.length; i++) {
        if (
          new Date(fanData[i].date).getTime() >= backwardDate.getTime() &&
          new Date(fanData[i].date).getTime() <= Date.now()
        ) {
          fanArr.push(fanData[i])
          setFormattedFanData(fanArr)
        }
      }
      for (let i = 0; i < submersibleData.length; i++) {
        if (
          new Date(submersibleData[i].date).getTime() >=
            backwardDate.getTime() &&
          new Date(submersibleData[i].date).getTime() <= Date.now()
        ) {
          subArr.push(submersibleData[i])
          setFormattedSubData(subArr)
        }
      }
    } else if (props.customDates[0] || props.customDates[1]) {
      for (let i = 0; i < submersibleData.length; i++) {

        if (
          new Date(submersibleData[i].date).getTime() >= props.customDates[0] &&
          new Date(submersibleData[i].date).getTime() <= props.customDates[1]
        ) {
          subArr.push(submersibleData[i])
          setFormattedSubData(subArr)
        }
      }
      for (let i = 0; i < fanData.length; i++) {
        if (
          new Date(fanData[i].date).getTime() >= props.customDates[0] &&
          new Date(fanData[i].date).getTime() <= props.customDates[1]
        ) {
          fanArr.push(fanData[i])
          setFormattedFanData(fanArr)
        }
      }
    }
  }, [props.calenderValue, fanData, submersibleData, props.customDates])

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
      backgroundColor: '#b9dcee',
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }))

  return (
    <>
      <AccordianComponent heading='Daily Activities'>
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
          <TableContainer sx={{ maxHeight: 350 }}>
            <Table stickyHeader aria-label='sticky table'>
              <TableHead>
                <TableRow>
                  {MicsData.comodityColumn.map((cl, i) => (
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
                {formattedFanData
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
                        <TableCell>{row.quantity}</TableCell>
                        <TableCell>{row.rotorSize}</TableCell>
                        <TableCell>
                          {moment(row.date).format('MMMM Do YYYY, h:mm a')}
                        </TableCell>
                      </StyledTableRow>
                    )
                  })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        {category === 'submersible' && (
          <TableContainer sx={{ maxHeight: 350 }}>
            <Table stickyHeader aria-label='sticky table'>
              <TableHead>
                <TableRow>
                  {MicsData.comodityColumn.map((cl, i) => (
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
                {formattedSubData
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
                        <TableCell>{row.quantity}</TableCell>
                        <TableCell>{row.rotorSize}</TableCell>
                        <TableCell>
                          {moment(row.date).format('MMMM Do YYYY, h:mm a')}
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
            category === 'fan'
              ? formattedFanData.length
              : formattedSubData.length
          }
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </AccordianComponent>
    </>
  )
}

export default DailyActivities
