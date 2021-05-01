import './App.css';
import { BrowserRouter, Switch } from 'react-router-dom';
import Routes from './routes/routes';

function App() {
  return (
    <div className="App">
        <BrowserRouter>    
            <Switch>
                <Routes />
            </Switch>
        </BrowserRouter>
    </div>
  );
}

export default App;
