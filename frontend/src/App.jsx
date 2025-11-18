import {Toaster} from 'sonner'
import {BrowserRouter, Routes, Route} from 'react-router'
import HomePage from './pages/HomePage'
import NotFound from './pages/NotFound'


function App() {
  

  return (
    <div>
      <Toaster richColors/>
     
      <BrowserRouter>
      <Routes>
        <Route path='/'
              element = {<HomePage/>}
        />
        <Route path='*'
              element = {<NotFound/>}
        />
      </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
