import { Routes, Route } from 'react-router-dom';
import Landing from './components/Landing';
import Calculator from './components/Calculator';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/calculator" element={<Calculator />} />
    </Routes>
  );
}

export default App;
