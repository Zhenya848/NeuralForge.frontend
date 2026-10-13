import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "sonner"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/shared/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';

import AppLayout from './components/layout/AppLayout';
import Home from './pages/Home';
import Chat from './pages/Chat';
import Library from './pages/Library';
import Pricing from './pages/Pricing';
import SignIn from './pages/SignIn';
import Register from './pages/Register';
import Profile from './pages/Profile';

const AuthenticatedApp = () => {
  return (
    <Routes>
      <Route path="/signin" element={<SignIn />} />
      <Route path="/register" element={<Register />} />
      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/chat/:chatId" element={<Chat />} />
        <Route path="/library" element={<Library />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
      <Route path="*" element={<div />} />
    </Routes>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClientInstance}>
      <Router>
        <AuthenticatedApp />
      </Router>
      <Toaster />
      <Sonner position="top-center" theme="dark" />
    </QueryClientProvider>
  )
}

export default App