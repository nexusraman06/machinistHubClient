import React from 'react'
import { Route, Switch, HashRouter } from "react-router-dom";
import Dashboard from '../Dashboard'
import Clients from '../Clients'
import InputForm from '../InputForm'

const user = () => {
  return (
    <HashRouter>
      <div>
        <Switch>
          <Route path="/dashboard">
            <Dashboard />
          </Route>
          <Route path="/sites">
            <Clients />
          </Route>
          <Route path="/createSite">
            <InputForm />
          </Route>
        </Switch>
    </div>
  </HashRouter>
  )
}

export default user