import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import UserAuth from './modules/user/pages/UserAuth'
import Dashboard from './modules/user/pages/Dashboard'
import PropertyBrowse from './modules/property/pages/PropertyBrowse'
import Home from './modules/Home'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/UserAuth" element={<UserAuth />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/properties" element={<PropertyBrowse />} />
    </Routes>
    </>
  )
}

export default App
