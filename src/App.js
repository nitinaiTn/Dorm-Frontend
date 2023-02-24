import React, { createContext, useState } from 'react'
// routes
import Router from './routes';
// theme
import ThemeProvider from './theme';
// components
import ScrollToTop from './components/scroll-to-top';
import { StyledChart } from './components/chart';

// ----------------------------------------------------------------------

export const UserContext = createContext()

export default function App() {
  const [userData, setUserData] = useState(null)
  
  return (
    <ThemeProvider>
      <ScrollToTop />
      <StyledChart />
      <UserContext.Provider value={{ userData, setUserData }}>
        <Router />
      </UserContext.Provider>
    </ThemeProvider>
  );
}
