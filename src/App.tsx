import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Realtime from './pages/Realtime';
import BatchAnalysis from './pages/BatchAnalysis';
import Summary from './pages/Summary';

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-[#110232] text-white">
        <Sidebar />
        <main className="flex-1 p-8 overflow-auto">
          <Routes>
            <Route path="/" element={<Realtime />} />
            <Route path="/batch" element={<BatchAnalysis />} />
            <Route path="/summary" element={<Summary />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;