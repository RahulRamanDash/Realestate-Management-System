import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './modles/Home'
import PropertyBrowse from './modles/property/pages/PropertyBrowse'
import UserAuth from './modles/agent/pages/UserAuth'
import Dashboard from './modles/agent/pages/Dashboard'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/userAuth" element={<UserAuth />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/properties" element={<PropertyBrowse />} />
    </Routes>
    </>
  )
}

export default App
