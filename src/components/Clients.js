import React, { useEffect, useState } from 'react'
import Layout from './Layout'
import axios from 'axios'
import CardLayout from './Utils/CardLayout'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import AccordianComponent from './Utils/AccordianComponent'
const Clients = () => {
  const [clients, setClients] = useState([])
  const [category, setCategory] = React.useState('all')
  useEffect(() => {
    axios.get( process.env.REACT_APP_BACKEND_LINK +`/client`).then((res) => {
      const persons = res.data
      setClients(persons)
    })
  }, [])

  const handleChange = (event) => {
    setCategory(event.target.value)
  }
  return (
    <Layout title='Clients List'>
      <AccordianComponent heading='Client List'>
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
              <MenuItem value={'all'}>All</MenuItem>
              <MenuItem value={'fan'}>Fan</MenuItem>
              <MenuItem value={'submersible'}>Submersible</MenuItem>
            </Select>
          </FormControl>
        </div>
        <Grid container spacing={4}>
          {clients.map((client, i) =>
            category === client.category ? (
              <Grid key={'cli' + i} item xs={12} sm={6} md={4} lg={3}>
                <CardLayout
                  className='clientCard'
                  name={client.name}
                  balance={client.balance}
                  phone={client.phone}
                />
              </Grid>
            ) : (
              category === 'all' && (
                <Grid key={'cli2' + i} item xs={12} sm={6} md={4} lg={3}>
                  <CardLayout
                    className='clientCard'
                    name={client.name}
                    balance={client.balance}
                    phone={client.phone}
                  />
                </Grid>
              )
            )
          )}
        </Grid>
      </AccordianComponent>
    </Layout>
  )
}

export default Clients
