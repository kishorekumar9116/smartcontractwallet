import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { Dashboard } from './pages/Dashboard';
import { Send } from './pages/Send';
import { Receive } from './pages/Receive';
import { Swap } from './pages/Swap';
import { Multisig } from './pages/Multisig';
import { Security } from './pages/Security';
import { Settings } from './pages/Settings';

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/send" element={<Send />} />
        <Route path="/receive" element={<Receive />} />
        <Route path="/swap" element={<Swap />} />
        <Route path="/multisig" element={<Multisig />} />
        <Route path="/security" element={<Security />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
