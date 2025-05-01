import { useState } from 'react'
import AgentAuth from './modles/agent/pages/AgentAuth'
import { Route, Routes } from 'react-router-dom'
import Home from './modles/Home'
import AgentDashboard from './modles/agent/pages/AgentDashboard'
import PropertyBrowse from './modles/property/pages/PropertyBrowse'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/agentAuth" element={<AgentAuth />} />
      <Route path="/agentHome" element={<AgentDashboard />} />
      <Route path="/properties" element={<PropertyBrowse />} />
    </Routes>
    </>
  )
}

export default App
