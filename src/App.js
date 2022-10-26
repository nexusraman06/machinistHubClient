import './App.css'
import InputForm from './components/InputForm'
import Navbar from './components/Navbar'
import { Route, Routes } from 'react-router-dom'
import Dashboard from './components/Dashboard'
import Clients from './components/Clients'

function App() {
  return (
    <div>
      <Navbar></Navbar>
      <Routes>
        <Route path='/' element={<Dashboard />} />
        <Route path='/create' element={<InputForm />} />
        <Route path='/clients' element={<Clients />} />
      </Routes>
    </div>
  )
}

export default App
