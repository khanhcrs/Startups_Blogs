import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import ExploreBusinesses from './pages/ExploreBusinesses';
import BusinessDetail from './pages/BusinessDetail';
import FundingOpportunityDetail from './pages/FundingOpportunityDetail';
import News from './pages/News';
import Blogs from './pages/Blogs';
import Investors from './pages/Investors';
import PostIdea from './pages/PostIdea';
import InvestmentDisclaimer from './pages/InvestmentDisclaimer';

function LegacyRedirect({ to }: { to: string }) {
  const location = useLocation();

  return (
    <Navigate
      to={{
        pathname: to,
        search: location.search,
        hash: location.hash,
      }}
      replace
    />
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="businesses" element={<ExploreBusinesses />} />
          <Route path="businesses/:slug" element={<BusinessDetail />} />
          <Route path="funding-opportunities/:slug" element={<FundingOpportunityDetail />} />
          <Route path="startups" element={<LegacyRedirect to="/businesses" />} />
          <Route path="news" element={<News />} />
          <Route path="blogs" element={<Blogs />} />
          <Route path="investors" element={<Investors />} />
          <Route path="raise-capital" element={<PostIdea />} />
          <Route path="post-idea" element={<LegacyRedirect to="/raise-capital" />} />
          <Route path="investment-disclaimer" element={<InvestmentDisclaimer />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
