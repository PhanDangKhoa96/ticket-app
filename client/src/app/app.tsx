import { Route, Routes } from 'react-router-dom';
import Homepage from './pages/Homepage';

const App = () => {
  return (
    <Routes>
      {/* Home */}
      <Route path="/" element={<Homepage />} />

      {/* Dynamic ticket pages */}
      {/* <Route path={`/ticket/:id`} element={<TicketDetail />} /> */}
    </Routes>
  );
};

export default App;
