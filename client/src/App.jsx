import { Routes, Route } from "react-router";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Projects from "./pages/Projects.jsx";
import Education from "./pages/Education.jsx";
import Services from "./pages/Services.jsx";
import Contact from "./pages/Contact.jsx";
import Signup from "./user/Signup.jsx";
import Signin from "./lib/Signin.jsx";
import PrivateRoute from "./lib/PrivateRoute.jsx";
import ContactList from "./contact/ContactList.jsx";
import ContactForm from "./contact/ContactForm.jsx";
import ProjectForm from "./project/ProjectForm.jsx";
import QualificationForm from "./qualification/QualificationForm.jsx";

function App() {
  return (
    <>
      <Navbar />
      <main className="page-container">
        {/* Each Route shows its page when the URL matches its path */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/education" element={<Education />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />

          {/* Signed-in users (user or admin) can view messages */}
          <Route path="/contacts" element={<PrivateRoute><ContactList /></PrivateRoute>} />

          {/* Admin only: create / update forms */}
          <Route path="/contacts/edit/:contactId" element={<PrivateRoute adminOnly><ContactForm /></PrivateRoute>} />
          <Route path="/projects/new" element={<PrivateRoute adminOnly><ProjectForm /></PrivateRoute>} />
          <Route path="/projects/edit/:projectId" element={<PrivateRoute adminOnly><ProjectForm /></PrivateRoute>} />
          <Route path="/education/new" element={<PrivateRoute adminOnly><QualificationForm /></PrivateRoute>} />
          <Route path="/education/edit/:qualificationId" element={<PrivateRoute adminOnly><QualificationForm /></PrivateRoute>} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;
