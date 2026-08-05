import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import ExploreBusinesses from './pages/ExploreBusinesses';
import BusinessDetail from './pages/BusinessDetail';
import News from './pages/News';
import Blogs from './pages/Blogs';
import BlogDetail from './pages/BlogDetail';
import CreateBlog from './pages/CreateBlog';
import UserProfile from './pages/UserProfile';
import Notifications from './pages/Notifications';
import PostIdea from './pages/PostIdea';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import RegisterBusiness from './pages/auth/RegisterBusiness';
import PendingVerification from './pages/auth/PendingVerification';
import About from './pages/About';
import Contact from './pages/Contact';
import AccessDenied from './pages/AccessDenied';
import AdminLayout from './features/admin/layouts/AdminLayout';
import AdminOverview from './features/admin/pages/AdminOverview';
import AdminUsers from './features/admin/pages/AdminUsers';
import AdminBusinesses from './features/admin/pages/AdminBusinesses';
import AdminArticles from './features/admin/pages/AdminArticles';
import AdminEditBusiness from './features/admin/pages/AdminEditBusiness';
import AdminEditArticle from './features/admin/pages/AdminEditArticle';

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
    <>
      <Toaster position="top-right" />
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="businesses" element={<ExploreBusinesses />} />
            <Route path="businesses/:slug" element={<BusinessDetail />} />
            <Route path="startups" element={<LegacyRedirect to="/businesses" />} />
            <Route path="news" element={<News />} />
            <Route path="blogs" element={<Blogs />} />
            <Route path="blogs/:slug" element={<BlogDetail />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="register/business" element={<RegisterBusiness />} />
            <Route path="pending-verification" element={<PendingVerification />} />
            <Route path="raise-capital" element={<PostIdea />} />
            <Route path="post-idea" element={<LegacyRedirect to="/raise-capital" />} />
            <Route path="user/:id" element={<UserProfile />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="admin" element={<AdminLayout />}>
              <Route index element={<LegacyRedirect to="/admin/overview" />} />
              <Route path="dashboard" element={<LegacyRedirect to="/admin/overview" />} />
              <Route path="overview" element={<AdminOverview />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="businesses" element={<AdminBusinesses />} />
              <Route path="businesses/:id/edit" element={<AdminEditBusiness />} />
              <Route path="articles" element={<AdminArticles />} />
              <Route path="articles/:id/edit" element={<AdminEditArticle />} />
            </Route>
            <Route path="403" element={<AccessDenied />} />
          </Route>
          <Route path="/create-blog" element={<CreateBlog />} />
          <Route path="/edit-blog/:id" element={<CreateBlog />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
