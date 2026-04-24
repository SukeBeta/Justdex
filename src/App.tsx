import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Detail from './pages/Detail'
import TeamBuilder from './pages/TeamBuilder'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="pokemon/:idOrName" element={<Detail />} />
        <Route path="team" element={<TeamBuilder />} />
      </Route>
    </Routes>
  )
}
