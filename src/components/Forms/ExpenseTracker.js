import React, { useEffect, useState } from 'react'
import Layout from '../Layout'
import AddIcon from '@mui/icons-material/Add'
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import swal from 'sweetalert'
import axios from 'axios'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Container
} from '@mui/material'

const ExpenseTracker = () => {
  const [open, setOpen] = useState(false)
  const [category, setCategory] = useState('expense')
  const [dialogCategory, setDialogCategory] = useState('expense')
  const [rows, setRows] = useState([])
  const [clients, setClients] = useState([])
  const [singleEntry, setSingleEntry] = useState({
    client: '',
    reason: '',
    amount: '',
    medium: 'Cash',
    transferMethod: '',
    comment: '',
    date: new Date()
  })

  const defaultRow = {
    client: '',
    reason: '',
    amount: '',
    medium: 'Cash',
    transferMethod: '',
    comment: '',
    date: new Date()
  }

  const reasons = {
    expenseReasons: ['Labour Cost', 'Oil', 'Hardware', 'Electricity', 'Maintenance', 'Misc'],
    incomeReasons: ['Fan Payment', 'Submersible Payment', 'Scrap Payment', 'Misc']
  }

  useEffect(() => {
    axios.get(process.env.REACT_APP_BACKEND_LINK + '/client').then(res => {
      setClients(res.data)
    })
  }, [])

  useEffect(() => {
    if (open && rows.length === 0) {
      setRows([{ ...defaultRow }])
    }
  }, [open, rows.length])

  const handleAddRow = () => {
    setRows([...rows, { ...defaultRow }])
  }
  const handleRemoveRow = i => {
    setRows(rows.filter((_, idx) => idx !== i))
  }
  const handleRowChange = (i, field, val) => {
    const next = [...rows]
    next[i][field] = val
    setRows(next)
  }

  const handleCategoryChange = e => {
    setCategory(e.target.value)
  }
  const handleSingleEntryChange = (field, val) => {
    setSingleEntry(prev => ({ ...prev, [field]: val }))
  }

  // single-entry validation
  const isSingleValid = () => {
    const s = singleEntry
    if (!s.reason || !s.amount || !s.date) return false
    if (category === 'income') {
      if (!s.client || !s.medium) return false
      if (s.medium === 'Online' && !s.transferMethod) return false
    }
    return true
  }

  const handleSubmitSingle = async () => {
    if (!isSingleValid()) {
      swal('Error!', 'Please fill all required fields.', 'error')
      return
    }
    try {
      const payload = category === 'expense'
        ? { reason: singleEntry.reason, amount: singleEntry.amount, date: singleEntry.date, comment: singleEntry.comment }
        : {
            client: singleEntry.client,
            reason: singleEntry.reason,
            amount: singleEntry.amount,
            date: singleEntry.date,
            medium: singleEntry.medium,
            transferMethod: singleEntry.medium === 'Online' ? singleEntry.transferMethod : '',
            comment: singleEntry.comment
          }
      const endpoint = category === 'expense' ? '/expense' : '/income'
      await axios.post(process.env.REACT_APP_BACKEND_LINK + endpoint, payload)
      swal('Success!', 'Entry submitted successfully!', 'success')
      setSingleEntry({ ...defaultRow })
    } catch (err) {
      swal('Error!', err.message || 'Something went wrong.', 'error')
    }
  }

  const handleSubmitMultiple = async () => {
    for (let i = 0; i < rows.length; i++) {
      const r = rows[i]
      if (!r.reason || !r.amount || !r.date) {
        swal('Error!', `Fill all required fields in row ${i + 1}.`, 'error')
        return
      }
      if (dialogCategory === 'income') {
        if (!r.client || !r.medium) {
          swal('Error!', `Fill client/medium in row ${i + 1}.`, 'error')
          return
        }
        if (r.medium === 'Online' && !r.transferMethod) {
          swal('Error!', `Select transfer method in row ${i + 1}.`, 'error')
          return
        }
      }
    }
    try {
      const endpoint = dialogCategory === 'expense' ? '/expense' : '/income'
      for (const r of rows) {
        const payload = dialogCategory === 'expense'
          ? { reason: r.reason, amount: r.amount, date: r.date, comment: r.comment }
          : {
              client: r.client,
              reason: r.reason,
              amount: r.amount,
              date: r.date,
              medium: r.medium,
              transferMethod: r.medium === 'Online' ? r.transferMethod : '',
              comment: r.comment
            }
        await axios.post(process.env.REACT_APP_BACKEND_LINK + endpoint, payload)
      }
      swal('Success!', 'All entries submitted successfully!', 'success')
      setRows([])
      setOpen(false)
    } catch (err) {
      swal('Error!', err.message || 'Something went wrong.', 'error')
    }
  }

  return (
    <Layout title="Expense Tracker">
      <Container maxWidth="md">
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              border: '1px solid #ddd',
              borderRadius: 2,
              p: 2,
              width: '100%',
              maxWidth: 600,
              height: { xs: 'auto', sm: 280 },
              backgroundColor: '#fafafa',
              boxShadow: 3
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth variant="standard">
                  <InputLabel>Category</InputLabel>
                  <Select value={category} onChange={handleCategoryChange}>
                    <MenuItem value="expense">Expense</MenuItem>
                    <MenuItem value="income">Income</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              {category === 'income' && (
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth variant="standard">
                    <InputLabel>Client</InputLabel>
                    <Select
                      value={singleEntry.client}
                      onChange={e => handleSingleEntryChange('client', e.target.value)}
                    >
                      {clients.map((c, i) => (
                        <MenuItem key={i} value={c.name}>{c.name}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              )}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth variant="standard">
                  <InputLabel>Reason</InputLabel>
                  <Select
                    value={singleEntry.reason}
                    onChange={e => handleSingleEntryChange('reason', e.target.value)}
                  >
                    {(category === 'income' ? reasons.incomeReasons : reasons.expenseReasons).map((r, i) => (
                      <MenuItem key={i} value={r}>{r}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  variant="standard"
                  label="Amount"
                  type="number"
                  fullWidth
                  value={singleEntry.amount}
                  onChange={e => handleSingleEntryChange('amount', e.target.value)}
                />
              </Grid>
              {category === 'income' && (
                <>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth variant="standard">
                      <InputLabel>Medium</InputLabel>
                      <Select
                        value={singleEntry.medium}
                        onChange={e => handleSingleEntryChange('medium', e.target.value)}
                      >
                        <MenuItem value="Cash">Cash</MenuItem>
                        <MenuItem value="Online">Online</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  {singleEntry.medium === 'Online' && (
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth variant="standard">
                        <InputLabel>Transfer Method</InputLabel>
                        <Select
                          value={singleEntry.transferMethod}
                          onChange={e => handleSingleEntryChange('transferMethod', e.target.value)}
                        >
                          <MenuItem value="UPI">UPI</MenuItem>
                          <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  )}
                </>
              )}
              <Grid item xs={12} md={6}>
                <TextField
                  variant="standard"
                  label="Comment"
                  fullWidth
                  value={singleEntry.comment}
                  onChange={e => handleSingleEntryChange('comment', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Date"
                    value={singleEntry.date}
                    onChange={newVal => handleSingleEntryChange('date', newVal)}
                    renderInput={params => <TextField {...params} fullWidth variant="standard" />}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>
            <Box textAlign="right" mt={2}>
              <Button
                variant="contained"
                onClick={handleSubmitSingle}
                disabled={!isSingleValid()}
              >
                Submit
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>

      <Box textAlign="center" mt={4}>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
        >
          Add Multiple Entries
        </Button>
      </Box>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="lg" fullWidth>
        <DialogTitle>Add Multiple Entries</DialogTitle>
        <DialogContent>
          <Box mb={2}>
            <FormControl fullWidth variant="standard">
              <InputLabel>Category</InputLabel>
              <Select
                value={dialogCategory}
                onChange={e => setDialogCategory(e.target.value)}
              >
                <MenuItem value="expense">Expense</MenuItem>
                <MenuItem value="income">Income</MenuItem>
              </Select>
            </FormControl>
          </Box>
          {rows.map((row, i) => (
            <Box key={i} border={1} borderRadius={2} p={2} mb={3}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={2}>
                  <FormControl fullWidth variant="standard">
                    <InputLabel>Reason</InputLabel>
                    <Select
                      value={row.reason}
                      onChange={e => handleRowChange(i, 'reason', e.target.value)}
                    >
                      {(dialogCategory === 'income' ? reasons.incomeReasons : reasons.expenseReasons).map((r, j) => (
                        <MenuItem key={j} value={r}>{r}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={2}>
                  <TextField
                    variant="standard"
                    label="Amount"
                    type="number"
                    fullWidth
                    value={row.amount}
                    onChange={e => handleRowChange(i, 'amount', e.target.value)}
                  />
                </Grid>
                {dialogCategory === 'income' && (
                  <>
                    <Grid item xs={12} sm={2}>
                      <FormControl fullWidth variant="standard">
                        <InputLabel>Medium</InputLabel>
                        <Select
                          value={row.medium}
                          onChange={e => handleRowChange(i, 'medium', e.target.value)}
                        >
                          <MenuItem value="Cash">Cash</MenuItem>
                          <MenuItem value="Online">Online</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    {row.medium === 'Online' && (
                      <Grid item xs={12} sm={2}>
                        <FormControl fullWidth variant="standard">
                          <InputLabel>Transfer Method</InputLabel>
                          <Select
                            value={row.transferMethod}
                            onChange={e => handleRowChange(i, 'transferMethod', e.target.value)}
                          >
                            <MenuItem value="UPI">UPI</MenuItem>
                            <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                    )}
                  </>
                )}
                <Grid item xs={12} sm={2}>
                  <TextField
                    variant="standard"
                    label="Comment"
                    fullWidth
                    value={row.comment}
                    onChange={e => handleRowChange(i, 'comment', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Date"
                      value={row.date}
                      onChange={nv => handleRowChange(i, 'date', nv)}
                      renderInput={params => <TextField {...params} fullWidth variant="standard" />}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12} sm={1} textAlign="center">
                  <IconButton onClick={() => handleRemoveRow(i)} color="error">
                    <RemoveCircleIcon />
                  </IconButton>
                </Grid>
              </Grid>
            </Box>
          ))}
          <Box textAlign="center">
            <IconButton onClick={handleAddRow} size="large">
              <AddIcon fontSize="large" />
            </IconButton>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleSubmitMultiple} variant="contained">
            Submit All
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  )
}

export default ExpenseTracker
