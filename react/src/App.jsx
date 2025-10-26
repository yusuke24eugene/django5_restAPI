import Navbar from './components/Navbar';
import List from './pages/List';
import Create from './pages/Create';
import Detail from './pages/Detail';
import Update from './pages/Update';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'

function App() {
  return (
    <Router>
      <Navbar />
      
      <Routes>
        <Route path="/" element={<List />} />
        <Route path="/create-person" element={<Create />} />
        <Route path="/persons/:id" element={<Detail />} />
        <Route path="/persons/:id/edit" element={<Update />} />
      </Routes>
    </Router>
  )
}

export default App
