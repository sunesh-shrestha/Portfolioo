import { useState } from "react";
import { useNavigate } from "react-router";
import { create } from "../contact/api-contact.js";

function Contact() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  // Assignment 3: form fields match the Contact model in MongoDB
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    message: "",
  });

  function handleChange(event) {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  }

  // Sends the form to our own backend: POST /api/contacts
  function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage("");

    create(formData).then((data) => {
      setIsSubmitting(false);
      if (data && data.error) {
        setSubmitMessage("❌ Error: " + data.error);
      } else {
        setSubmitMessage("Success! Your message has been saved.");
        setFormData({ firstname: "", lastname: "", email: "", message: "" });
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    });
  }

  return (
    <section className="about-container" style={{ maxWidth: '900px', padding: '60px 20px' }}>
      
      {/* Page Heading */}
      <div style={{ marginBottom: '40px' }}>
        <h1 className="name-title" style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Contact Me</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', margin: 0 }}>
          Let's connect. Feel free to reach out via form submission or direct contact links.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '50px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        
        {/* Left Side: Contact Information Panel */}
        <div className="skill-card" style={{ flex: '1 1 250px', padding: '30px', margin: 0 }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '20px' }}>
            Contact Info
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-muted)' }}>
              <strong>Email:</strong> <br />
              <a href="mailto:suneshshrestha308@gmail.com" style={{ color: 'var(--primary-color)', textDecoration: 'none' }}>
                suneshshrestha308@gmail.com
              </a>
            </p>
            <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-muted)' }}>
              <strong>Phone:</strong> <br />
              <span style={{ color: 'var(--text-main)' }}>416-823-5690</span>
            </p>
            <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-muted)' }}>
              <strong>Location:</strong> <br />
              <span style={{ color: 'var(--text-main)' }}>Moncton, NB</span>
            </p>
          </div>
        </div>

        {/* Right Side: Form Block */}
        <form onSubmit={handleSubmit} style={{ flex: '2 1 450px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.9rem', fontWeight: '600' }}>
            First Name
            <input 
              name="firstname" 
              value={formData.firstname} 
              onChange={handleChange} 
              required 
              style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '1rem' }}
            />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.9rem', fontWeight: '600' }}>
            Last Name
            <input 
              name="lastname" 
              value={formData.lastname} 
              onChange={handleChange} 
              required 
              style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '1rem' }}
            />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.9rem', fontWeight: '600' }}>
            Email Address
            <input 
              name="email" 
              type="email" 
              value={formData.email} 
              onChange={handleChange} 
              required 
              style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '1rem' }}
            />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.9rem', fontWeight: '600' }}>
            Message
            <textarea 
              name="message" 
              rows="5" 
              value={formData.message} 
              onChange={handleChange} 
              required 
              style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '1rem', resize: 'vertical' }}
            />
          </label>

          {/* Inline alert box replacing messy window browser popups */}
          {submitMessage && (
            <div style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-main)', marginTop: '5px' }}>
              {submitMessage}
            </div>
          )}

          <button 
            type="submit" 
            className="resume-btn" 
            disabled={isSubmitting}
            style={{ 
              marginTop: '10px', 
              alignSelf: 'flex-start', 
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              opacity: isSubmitting ? 0.7 : 1,
              border: 'none'
            }}
          >
            {/* Toggles text reactively based on network states */}
            {isSubmitting ? "Sending..." : "Send Message"}
          </button>
        </form>

      </div>
    </section>
  );
}

export default Contact;
