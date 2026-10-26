
import { useState } from 'react';
import './App.css';
import { Footer } from './components/Layouts/Footer';
import { Header } from './components/Layouts/Header';
import { AllRoutes } from './routes/AllRoutes';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    Boolean(sessionStorage.getItem('token'))
  );

  return (
    <div className="my-5">
      <Header
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
      />
      <div className='my-5'>
        <AllRoutes
          isAuthenticated={isAuthenticated}
          setIsAuthenticated={setIsAuthenticated}
        />
      </div>
      {/* <Footer /> */}
    </div>
  );
}

export default App;
