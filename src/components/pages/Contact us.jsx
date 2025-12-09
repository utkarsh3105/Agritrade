// app/src/components/pages/ContactUs.jsx
import React, { useState } from 'react';
import './css/Home.css';

function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    alert('Thank you for your message! We will get back to you soon.');
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
  };

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <section className="cbc text-white py-5" data-aos="fade-up">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6" data-aos="fade-right" data-aos-delay="200">
              <h1 className="display-4 fw-bold mb-3">Get in Touch</h1>
              <p className="lead mb-4">
                We'd love to hear from you. Send us a message and we'll respond as soon as possible.
              </p>
              <div className="d-flex gap-3">
                <a href="https://facebook.com/agritrade" target="_blank" rel="noopener noreferrer" 
                   className="btn btn-outline-light btn-lg rounded-circle p-3" style={{width: '60px', height: '60px'}}>
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="https://instagram.com/agritrade" target="_blank" rel="noopener noreferrer" 
                   className="btn btn-outline-light btn-lg rounded-circle p-3" style={{width: '60px', height: '60px'}}>
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="https://linkedin.com/company/agritrade" target="_blank" rel="noopener noreferrer" 
                   className="btn btn-outline-light btn-lg rounded-circle p-3" style={{width: '60px', height: '60px'}}>
                  <i className="fab fa-linkedin-in"></i>
                </a>
                <a href="https://twitter.com/agritrade" target="_blank" rel="noopener noreferrer" 
                   className="btn btn-outline-light btn-lg rounded-circle p-3" style={{width: '60px', height: '60px'}}>
                  <i className="fab fa-twitter"></i>
                </a>
              </div>
            </div>
            <div className="col-lg-6 text-center" data-aos="fade-left" data-aos-delay="300">
              <img src="/agri-logo.png" alt="AgriTrade" className="img-fluid" style={{maxWidth: '200px'}} />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form and Info Section */}
      <section className="py-5" data-aos="fade-up">
        <div className="container">
          <div className="row">
            {/* Contact Form */}
            <div className="col-lg-8 mb-5" data-aos="fade-right" data-aos-delay="200">
              <div className="card shadow-lg border-0 h-100">
                <div className="card-body p-5">
                  <h3 className="fw-bold mb-4 text-success">Send us a Message</h3>
                  <form onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label htmlFor="name" className="form-label fw-semibold">Full Name *</label>
                        <input 
                          type="text" 
                          className="form-control form-control-lg" 
                          id="name" 
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required 
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label htmlFor="email" className="form-label fw-semibold">Email Address *</label>
                        <input 
                          type="email" 
                          className="form-control form-control-lg" 
                          id="email" 
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required 
                          placeholder="Enter your email"
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label htmlFor="phone" className="form-label fw-semibold">Phone Number</label>
                        <input 
                          type="tel" 
                          className="form-control form-control-lg" 
                          id="phone" 
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="Enter your phone number"
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label htmlFor="subject" className="form-label fw-semibold">Subject</label>
                        <select 
                          className="form-select form-select-lg" 
                          id="subject" 
                          name="subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                        >
                          <option value="">Select a subject</option>
                          <option value="general">General Inquiry</option>
                          <option value="farmer">Farmer Support</option>
                          <option value="buyer">Buyer Support</option>
                          <option value="technical">Technical Issue</option>
                          <option value="partnership">Partnership</option>
                          <option value="feedback">Feedback</option>
                        </select>
                      </div>
                    </div>
                    <div className="mb-4">
                      <label htmlFor="message" className="form-label fw-semibold">Message *</label>
                      <textarea 
                        className="form-control form-control-lg" 
                        id="message" 
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows="5" 
                        required
                        placeholder="Tell us how we can help you..."
                      />
                    </div>
                    <button type="submit" className="btn btn-success btn-lg px-5">
                      <i className="fas fa-paper-plane me-2"></i>
                      Send Message
                    </button>
                  </form>
                </div>
              </div>
            </div>

            {/* Contact Information */}

            <div className="col-lg-4" data-aos="fade-left" data-aos-delay="300">
              <div className="card shadow-lg border-0 h-100">
                <div className="card-body p-4">
                  <h3 className="fw-bold mb-4 text-success">Contact Information</h3>
                  
                  <div className="mb-4" data-aos="zoom-in" data-aos-delay="400">
                    <div className="d-flex align-items-center mb-3">
                      <div className="rounded-circle bg-success d-flex align-items-center justify-content-center me-3" 
                           style={{width: '50px', height: '50px'}}>
                        <i className="fas fa-map-marker-alt text-white"></i>
                      </div>
                      <div>
                        <h6 className="fw-bold mb-1">Address</h6>
                        <p className="text-muted mb-0">123 Agriculture Street<br />Farm District, City 123456</p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4" data-aos="zoom-in" data-aos-delay="500">
                    <div className="d-flex align-items-center mb-3">
                      <div className="rounded-circle bg-primary d-flex align-items-center justify-content-center me-3" 
                           style={{width: '50px', height: '50px'}}>
                        <i className="fas fa-phone text-white"></i>
                      </div>
                      <div>
                        <h6 className="fw-bold mb-1">Phone</h6>
                        <p className="text-muted mb-0">+91 9876543210<br />+91 9876543211</p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4" data-aos="zoom-in" data-aos-delay="600">
                    <div className="d-flex align-items-center mb-3">
                      <div className="rounded-circle bg-info d-flex align-items-center justify-content-center me-3" 
                           style={{width: '50px', height: '50px'}}>
                        <i className="fas fa-envelope text-white"></i>
                      </div>
                      <div>
                        <h6 className="fw-bold mb-1">Email</h6>
                        <p className="text-muted mb-0">contact@agritrade.com<br />support@agritrade.com</p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4" data-aos="zoom-in" data-aos-delay="700">
                    <div className="d-flex align-items-center mb-3">
                      <div className="rounded-circle bg-warning d-flex align-items-center justify-content-center me-3" 
                           style={{width: '50px', height: '50px'}}>
                        <i className="fas fa-clock text-white"></i>
                      </div>
                      <div>
                        <h6 className="fw-bold mb-1">Business Hours</h6>
                        <p className="text-muted mb-0">Mon - Fri: 9:00 AM - 6:00 PM<br />Sat: 9:00 AM - 2:00 PM</p>
                      </div>
                    </div>
                  </div>

                  <hr />
                  
                  <h6 className="fw-bold mb-3">Follow Us</h6>
                  <div className="d-flex gap-2">
                    <a href="https://facebook.com/agritrade" target="_blank" rel="noopener noreferrer" 
                       className="btn btn-outline-primary btn-sm">
                      <i className="fab fa-facebook-f"></i>
                    </a>
                    <a href="https://instagram.com/agritrade" target="_blank" rel="noopener noreferrer" 
                       className="btn btn-outline-danger btn-sm">
                      <i className="fab fa-instagram"></i>
                    </a>
                    <a href="https://linkedin.com/company/agritrade" target="_blank" rel="noopener noreferrer" 
                       className="btn btn-outline-info btn-sm">
                      <i className="fab fa-linkedin-in"></i>
                    </a>
                    <a href="https://twitter.com/agritrade" target="_blank" rel="noopener noreferrer" 
                       className="btn btn-outline-dark btn-sm">
                      <i className="fab fa-twitter"></i>
                    </a>
                    <a href="https://youtube.com/@agritrade" target="_blank" rel="noopener noreferrer" 
                       className="btn btn-outline-danger btn-sm">
                      <i className="fab fa-youtube"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-d py-5" data-aos="fade-up">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center mb-5" data-aos="fade-down" data-aos-delay="200">
              <h2 className="fw-bold">Frequently Asked Questions</h2>
              <p className="lead text-muted">Quick answers to common questions</p>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-6  mb-4" data-aos="fade-up" data-aos-delay="300">
              <div className="card border-0 h-100">
                <div className="card-body cbc">
                  <h5 className="fw-bold text-white">How do I register as a farmer?</h5>
                  <p className="text-white">Simply click on "Sign Up" and select "Farmer" to start your registration process. You'll need to provide some basic information and verify your farming credentials.</p>
                </div>
              </div>
            </div>
            <div className="col-lg-6 mb-4" data-aos="fade-up" data-aos-delay="400">
              <div className="card border-0 h-100">
                <div className="card-body cbc">
                  <h5 className="fw-bold text-white">How do payments work?</h5>
                  <p className="text-white">We offer secure payment processing with multiple payment options. Farmers receive payments directly after successful order completion and delivery confirmation.</p>
                </div>
              </div>
            </div>
            <div className="col-lg-6 mb-4" data-aos="fade-up" data-aos-delay="500">
              <div className="card border-0 h-100">
                <div className="card-body cbc">
                  <h5 className="fw-bold text-white">What products can I sell?</h5>
                  <p className="text-white">You can sell various agricultural products including grains, vegetables, fruits, seeds, and other farm produce. All products must meet our quality standards.</p>
                </div>
              </div>
            </div>
            <div className="col-lg-6 mb-4" data-aos="fade-up" data-aos-delay="600">
              <div className="card border-0 h-100">
                <div className="card-body cbc">
                  <h5 className="fw-bold text-white">Is there customer support?</h5>
                  <p className="text-white">Yes! We provide 24/7 customer support through phone, email, and chat. Our team is always ready to help both farmers and buyers.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ContactUs;