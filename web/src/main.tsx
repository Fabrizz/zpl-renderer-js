import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from './components/theme-provider.tsx'
import App from './components/App.tsx'
import { Toaster } from "@/components/ui/sonner"
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider
      defaultTheme="dark"
      storageKey="vite-ui-theme"
    >
      <App />
      <Toaster
        richColors
        position='top-center'
      />
    </ThemeProvider>
  </StrictMode>,
)
