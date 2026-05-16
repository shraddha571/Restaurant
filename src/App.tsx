import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Menu from './pages/Menu';
import CustomHamper from './pages/CustomHamper';
import TrackOrder from './pages/TrackOrder';
import StaffDashboard from './pages/StaffDashboard';
import CustomCake from './pages/CustomCake';
import BookTable from './pages/BookTable';
import Checkout from './pages/Checkout';
import Receipt from './pages/Receipt';
import { MessageCircle } from 'lucide-react';

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/custom" element={<CustomHamper />} />
          <Route path="/custom-cake" element={<CustomCake />} />
          <Route path="/track" element={<TrackOrder />} />
          <Route path="/staff" element={<StaffDashboard />} />
          <Route path="/book-table" element={<BookTable />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/receipt/:orderId" element={<Receipt />} />
          <Route path="/profile" element={<div className="p-10 text-center font-headline font-bold text-3xl italic">Guest Profile coming soon...</div>} />
        </Routes>
      </Layout>
      
    </Router>
  );
}
