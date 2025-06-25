import Calendar from './components/Calendar';
import './index.css';

function App() {
  return (
    <>
      <header className="app-header">
        <h1 className="app-logo">🗓️ Calendrix</h1>
      </header>
      <div className="main-layout">
        <Calendar />
      </div>
    </>
  );
}

export default App;
