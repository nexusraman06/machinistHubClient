import React, { useState } from 'react';
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  DialogActions,
  Container
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import AddIcon from '@mui/icons-material/Add';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import swal from 'sweetalert';
import dayjs from 'dayjs';
import axios from 'axios';
import Layout from '../Layout';

const DailyLogs = () => {
  const API_ROOT = process.env.REACT_APP_BACKEND_LINK;
  // Single-form state, default date to today
  const [singleLog, setSingleLog] = useState({
    date: dayjs(),
    relatedTo: '',
    comment: '',
  });

  // Multi-row state, default date to today
  const defaultRow = { date: dayjs(), relatedTo: '', comment: '' };
  const [multiRows, setMultiRows] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleSingleChange = (field, value) =>
    setSingleLog(prev => ({ ...prev, [field]: value }));

  const isSingleValid = () =>
    singleLog.date && singleLog.relatedTo.trim().length > 0;

  const handleSingleSubmit = async () => {
    if (!isSingleValid()) {
      swal('Error!', 'Please fill Date and Related To.', 'error');
      return;
    }
    try {
      await axios.post(`${API_ROOT}/log`, {
        date: singleLog.date.toDate(),
        relatedTo: singleLog.relatedTo,
        comment: singleLog.comment
      });
      swal('Success!', 'Log submitted!', 'success');
      setSingleLog({ date: dayjs(), relatedTo: '', comment: '' });
    } catch (err) {
      swal('Error!', err.response?.data?.message || err.message, 'error');
    }
  };

  const handleAddRow = () => {
    setMultiRows(rows => [...rows, { ...defaultRow }]);
  };

  const handleRemoveRow = idx =>
    setMultiRows(rows => rows.filter((_, i) => i !== idx));

  const handleRowChange = (idx, field, value) => {
    setMultiRows(rows => {
      const next = [...rows];
      next[idx][field] = value;
      return next;
    });
  };

  const handleMultiSubmit = async () => {
    for (let i = 0; i < multiRows.length; i++) {
      const { date, relatedTo } = multiRows[i];
      if (!date || !relatedTo.trim()) {
        swal('Error!', `Row ${i + 1}: fill Date and Related To.`, 'error');
        return;
      }
    }
    try {
      const payload = multiRows.map(r => ({
        date: r.date.toDate(),
        relatedTo: r.relatedTo,
        comment: r.comment
      }));
      await axios.post(`${API_ROOT}/log/multiple`, payload);
      swal('Success!', 'Logs submitted!', 'success');
      setMultiRows([]);
      setDialogOpen(false);
    } catch (err) {
      swal('Error!', err.response?.data?.message || err.message, 'error');
    }
  };

  return (
    <Layout title='Logs'>
      {/* SINGLE ENTRY */}
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
              height: { xs: 'auto', sm: 250 },
              backgroundColor: '#fafafa',
              boxShadow: 3,
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Date"
                    value={singleLog.date}
                    onChange={newVal => handleSingleChange('date', newVal)}
                    renderInput={params => (
                      <TextField {...params} fullWidth variant="standard" />
                    )}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="standard"
                  label="Related To"
                  fullWidth
                  value={singleLog.relatedTo}
                  onChange={e => handleSingleChange('relatedTo', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="standard"
                  label="Comment"
                  fullWidth
                  value={singleLog.comment}
                  onChange={e => handleSingleChange('comment', e.target.value)}
                />
              </Grid>
            </Grid>
            <Box textAlign="right" mt={2}>
              <Button
                variant="contained"
                onClick={handleSingleSubmit}
                disabled={!isSingleValid()}
              >
                Submit
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>

      {/* MULTI-ENTRY BUTTON */}
      <Box textAlign="center" mt={4}>
        <Button
          variant="outlined"
          onClick={() => {
            setDialogOpen(true);
            if (multiRows.length === 0) setMultiRows([{ ...defaultRow }]);
          }}
          startIcon={<AddIcon />}
        >
          Add Multiple Entries
        </Button>
      </Box>

      {/* MULTI-ENTRY DIALOG */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Add Multiple Daily Logs</DialogTitle>
        <DialogContent dividers>
          {multiRows.length === 0 && (
            <Typography color="textSecondary" mt={1} mb={2}>
              Use the "Add Row" button to begin entering multiple logs.
            </Typography>
          )}
          {multiRows.map((row, idx) => (
            <Box key={idx} border={1} borderRadius={2} p={2} mb={3}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={3}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Date"
                      value={row.date}
                      onChange={newVal => handleRowChange(idx, 'date', newVal)}
                      renderInput={params => (
                        <TextField {...params} fullWidth variant="standard" />
                      )}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    variant="standard"
                    label="Related To"
                    fullWidth
                    value={row.relatedTo}
                    onChange={e =>
                      handleRowChange(idx, 'relatedTo', e.target.value)
                    }
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    variant="standard"
                    label="Comment"
                    fullWidth
                    value={row.comment}
                    onChange={e => handleRowChange(idx, 'comment', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} md={1}>
                  <IconButton
                    onClick={() => handleRemoveRow(idx)}
                    color="error"
                    size="large"
                  >
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
          <Button onClick={() => setDialogOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleMultiSubmit} variant="contained">
            Submit All
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default DailyLogs;
