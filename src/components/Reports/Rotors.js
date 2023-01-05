import React, { useEffect, useState } from 'react'
import { styled } from '@mui/material/styles'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import axios from 'axios'
import AccordianComponent from '../Utils/AccordianComponent'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import moment from 'moment'
import TablePagination from '@mui/material/TablePagination'
import MicsData from '../MicsData'
const DailyActivities = (props) => {
  const [category, setCategory] = React.useState('submersible')
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)
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
    axios.get(`/fanRotor`).then((res) => {
      setFanData(res.data)
    })
  })

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
    } else if (props.customDates[0] || props.customDates[1]) {
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
  }, [props.calenderValue, fanData, props.customDates])

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
      <AccordianComponent heading='Rotor Inventory'>
        <TableContainer sx={{ maxHeight: 350 }}>
          <Table stickyHeader aria-label='sticky table'>
            <TableHead>
              <TableRow>
                {MicsData.submersibleColumn.map((cl, i) => (
                  <StyledTableCell
                    key={'clMicsSub' + i}
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

        <TablePagination
          rowsPerPageOptions={[5, 10, 30]}
          component='div'
          count={formattedFanData.length}
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
