import React from "react";
import './css/Home.css';

function About() {
  return (
    <div className="about-page bg-d" style={{ minHeight: '100vh' }}>
      {/* Hero Section */}
      <section className="cbc text-white py-5"  data-aos="fade-up">
        <div className="container ">
          <div className="row align-items-center min-vh-50">
            <div className="col-lg-6" data-aos="fade-right" data-aos-delay="200">
              <h1 className="display-3 fw-bold mb-4">About AgriTrade</h1>
              <p className="lead mb-4">
                <strong>Empowering Farmers. Connecting Communities. Building the Future of Agriculture.</strong>
              </p>
              <p className="fs-5 mb-4">
                We're revolutionizing agricultural commerce by creating direct connections between farmers and buyers, eliminating middlemen and ensuring fair prices for everyone.
              </p>
              <div className="d-flex gap-3 mb-4">
                <div className="text-center">
                  <h3 className="fw-bold mb-1">10K+</h3>
                  <small>Farmers</small>
                </div>
                <div className="text-center">
                  <h3 className="fw-bold mb-1">5K+</h3>
                  <small>Buyers</small>
                </div>
                <div className="text-center">
                  <h3 className="fw-bold mb-1">50K+</h3>
                  <small>Transactions</small>
                </div>
              </div>
                <a href="/role-selection" className="btn btn-light btn-lg px-4">Join Our Community</a>
            </div>
            <div className="col-lg-6 text-center" data-aos="fade-left" data-aos-delay="300">
              <img src="/agri-logo.png" alt="AgriTrade" className="img-fluid" style={{maxWidth: '300px'}} />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-5" data-aos="fade-up">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 mb-4" data-aos="zoom-in" data-aos-delay="200">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="rounded-circle bg-success d-inline-flex align-items-center justify-content-center mb-3" style={{width: '80px', height: '80px'}}>
                    <i className="fas fa-bullseye text-white fs-2"></i>
                  </div>
                  <h4 className="fw-bold mb-3">Our Mission</h4>
                  <p className="text-muted">
                    To create a transparent, fair, and direct marketplace that empowers farmers with better prices and connects buyers with fresh, quality produce.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-4 mb-4" data-aos="zoom-in" data-aos-delay="300">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="rounded-circle bg-primary d-inline-flex align-items-center justify-content-center mb-3" style={{width: '80px', height: '80px'}}>
                    <i className="fas fa-eye text-white fs-2"></i>
                  </div>
                  <h4 className="fw-bold mb-3">Our Vision</h4>
                  <p className="text-muted">
                    To become the leading agricultural marketplace that bridges rural producers and urban consumers, promoting sustainable farming and local economies.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-4 mb-4" data-aos="zoom-in" data-aos-delay="400">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="rounded-circle bg-warning d-inline-flex align-items-center justify-content-center mb-3" style={{width: '80px', height: '80px'}}>
                    <i className="fas fa-heart text-white fs-2"></i>
                  </div>
                  <h4 className="fw-bold mb-3">Our Values</h4>
                  <ul className="list-unstyled text-muted">
                    <li className="mb-2"><i className="fas fa-check text-success me-2"></i>Fairness & Transparency</li>
                    <li className="mb-2"><i className="fas fa-check text-success me-2"></i>Farmer Empowerment</li>
                    <li className="mb-2"><i className="fas fa-check text-success me-2"></i>Sustainability</li>
                    <li className="mb-2"><i className="fas fa-check text-success me-2"></i>Community Building</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-light py-5" data-aos="fade-up">
        <div className="container">
          <div className="row text-center">
            <div className="col-12 mb-5" data-aos="fade-down" data-aos-delay="200">
              <h2 className="fw-bold">Our Impact in Numbers</h2>
              <p className="lead text-muted">Making a real difference in agricultural commerce</p>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-3 col-md-6 mb-4" data-aos="flip-up" data-aos-delay="300">
              <div className="card border-0 h-100">
                <div className="card-body text-center">
                  <div className="rounded-circle bg-success d-inline-flex align-items-center justify-content-center mb-3" style={{width: '70px', height: '70px'}}>
                    <i className="fas fa-users text-white fs-3"></i>
                  </div>
                  <h3 className="fw-bold text-success">10,000+</h3>
                  <p className="text-muted mb-0">Registered Farmers</p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 mb-4" data-aos="flip-up" data-aos-delay="400">
              <div className="card border-0 h-100">
                <div className="card-body text-center">
                  <div className="rounded-circle bg-primary d-inline-flex align-items-center justify-content-center mb-3" style={{width: '70px', height: '70px'}}>
                    <i className="fas fa-store text-white fs-3"></i>
                  </div>
                  <h3 className="fw-bold text-primary">5,000+</h3>
                  <p className="text-muted mb-0">Active Buyers</p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 mb-4" data-aos="flip-up" data-aos-delay="500">
              <div className="card border-0 h-100">
                <div className="card-body text-center">
                  <div className="rounded-circle bg-warning d-inline-flex align-items-center justify-content-center mb-3" style={{width: '70px', height: '70px'}}>
                    <i className="fas fa-handshake text-white fs-3"></i>
                  </div>
                  <h3 className="fw-bold text-warning">50,000+</h3>
                  <p className="text-muted mb-0">Successful Transactions</p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 mb-4" data-aos="flip-up" data-aos-delay="600">
              <div className="card border-0 h-100">
                <div className="card-body text-center">
                  <div className="rounded-circle bg-info d-inline-flex align-items-center justify-content-center mb-3" style={{width: '70px', height: '70px'}}>
                    <i className="fas fa-rupee-sign text-white fs-3"></i>
                  </div>
                  <h3 className="fw-bold text-info">₹100Cr+</h3>
                  <p className="text-muted mb-0">Revenue Generated</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-5" data-aos="fade-up">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4" data-aos="fade-right" data-aos-delay="200">
              <h2 className="fw-bold mb-4">Our Story</h2>
              <p className="text-muted mb-4">
                AgriTrade was born from a simple yet powerful idea: to make it easier for farmers to reach buyers directly, without unnecessary barriers and middlemen taking unfair cuts.
              </p>
              <p className="text-muted mb-4">
                Founded by a passionate team of agricultural experts and technology professionals, we witnessed firsthand the challenges farmers face in getting fair prices for their produce. Traditional supply chains often meant farmers received only a fraction of what consumers paid.
              </p>
              <p className="text-muted mb-4">
                Today, we're proud to have created a platform that has helped thousands of farmers increase their income while providing buyers with access to fresh, quality produce at competitive prices. Our journey is just beginning, and we're committed to revolutionizing agricultural commerce across the country.
              </p>
              <div className="row">
                <div className="col-6">
                  <h5 className="fw-bold text-success">2020</h5>
                  <p className="small text-muted">Founded</p>
                </div>
                <div className="col-6">
                  <h5 className="fw-bold text-success">15K+</h5>
                  <p className="small text-muted">Happy Users</p>
                </div>
              </div>
            </div>
            <div className="col-lg-6" data-aos="fade-left" data-aos-delay="300">
              <div className="row">
                <div className="col-6 mb-3">
                  <img src="/wheat.jpeg" alt="Wheat farming" className="img-fluid rounded shadow" />
                </div>
                <div className="col-6 mb-3">
                  <img src="/corn.jpeg" alt="Corn farming" className="img-fluid rounded shadow" />
                </div>
                <div className="col-6">
                  <img src="/paddy.jpeg" alt="Paddy farming" className="img-fluid rounded shadow" />
                </div>
                <div className="col-6">
                  <img src="/oats.jpeg" alt="Oats farming" className="img-fluid rounded shadow" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <div className="container my-5" data-aos="fade-up">
        <div className="row">
          <div className="col-12 text-center mb-5" data-aos="fade-down" data-aos-delay="200">
            <h2 className="fw-bold">Meet Our Team</h2>
            <p className="lead">The passionate individuals behind AgriTrade</p>
          </div>
        </div>
        <div className="row justify-content-center">
          {/* Admin 1 - Main Admin */}
          <div className="col-lg-4 col-md-6 mb-4" data-aos="fade-up" data-aos-delay="300">
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body text-center p-4">
                <div className="rounded-circle bg-success d-inline-flex align-items-center justify-content-center mb-3" style={{width: '80px', height: '80px'}}>
                  <span className="text-white fw-bold fs-3">TG</span>
                </div>
                <h5 className="card-title fw-bold">Utkarsh Gupta</h5>
                <p className="text-success fw-semibold mb-2">Founder & Main Admin</p>
                <p className="card-text text-muted">
                  Founder and visionary behind AgriTrade. Leading the platform's overall strategy and drives the mission of connecting farmers directly to buyers.
                </p>
              </div>
            </div>
          </div>

          {/* Admin 2 - Product Admin */}
          <div className="col-lg-4 col-md-6 mb-4" data-aos="fade-up" data-aos-delay="400">
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body text-center p-4">
                <div className="rounded-circle bg-primary d-inline-flex align-items-center justify-content-center mb-3" style={{width: '80px', height: '80px'}}>
                  <span className="text-white fw-bold fs-3">UG</span>
                </div>
                <h5 className="card-title fw-bold">Tanmay Gupta</h5>
                <p className="text-primary fw-semibold mb-2">Product Admin</p>
                <p className="card-text text-muted">
                  Manages product listings, quality standards, and ensures all agricultural products meet platform requirements and farmer expectations.
                </p>
              </div>
            </div>
          </div>

          {/* Admin 3 - Order Admin */}
          <div className="col-lg-4 col-md-6 mb-4" data-aos="fade-up" data-aos-delay="500">
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body text-center p-4">
                <div className="rounded-circle bg-warning d-inline-flex align-items-center justify-content-center mb-3" style={{width: '80px', height: '80px'}}>
                  <span className="text-white fw-bold fs-3">AS</span>
                </div>
                <h5 className="card-title fw-bold">Arpita Srivastava</h5>
                <p className="text-warning fw-semibold mb-2">Order Admin</p>
                <p className="card-text text-muted">
                  Oversees order processing, delivery coordination, and ensures smooth transactions between farmers and buyers.
                </p>
              </div>
            </div>
          </div>

          {/* Admin 4 - Finance Admin */}
          <div className="col-lg-4 col-md-6 mb-4" data-aos="fade-up" data-aos-delay="600">
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body text-center p-4">
                <div className="rounded-circle bg-info d-inline-flex align-items-center justify-content-center mb-3" style={{width: '80px', height: '80px'}}>
                  <span className="text-white fw-bold fs-3">PC</span>
                </div>
                <h5 className="card-title fw-bold">Prince Singh</h5>
                <p className="text-info fw-semibold mb-2">Finance Admin</p>
                <p className="card-text text-muted">
                  Manages financial operations, payment processing, and ensures secure and timely transactions for all platform users.
                </p>
              </div>
            </div>
          </div>

          {/* Admin 5 - Farmer Admin */}
          <div className=" bg-d col-lg-4 col-md-6 mb-4" data-aos="fade-up" data-aos-delay="700">
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body text-center p-4">
                <div className="rounded-circle bg-secondary d-inline-flex align-items-center justify-content-center mb-3" style={{width: '80px', height: '80px'}}>
                  <span className="text-white fw-bold fs-3">AC</span>
                </div>
                <h5 className="card-title fw-bold">Ansh Chaudhary</h5>
                <p className="text-secondary fw-semibold mb-2">Farmer Admin</p>
                <p className="card-text text-muted">
                  Dedicated to farmer support, onboarding, and ensuring farmers get the best experience and value from the platform.
                </p>
              </div>
            </div>
          </div>

          {/* Admin 6 - Supervision Admin */}
          <div className="col-lg-4 col-md-6 mb-4" data-aos="fade-up" data-aos-delay="800">
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body text-center p-4">
                <div className="rounded-circle bg-dark d-inline-flex align-items-center justify-content-center mb-3" style={{width: '80px', height: '80px'}}>
                  <span className="text-white fw-bold fs-3">LK</span>
                </div>
                <h5 className="card-title fw-bold">Lavkush kumar</h5>
                <p className="text-dark fw-semibold mb-2">Merchant</p>
                <p className="card-text text-muted">
                  Supervises overall platform operations, quality control, and ensures all administrative functions work in harmony.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <section className="cbc text-white py-5" data-aos="zoom-in">
        <div className="container">
          <div className="row text-center">
            <div className="col-12" data-aos="fade-up" data-aos-delay="200">
              <h2 className="fw-bold mb-3">Ready to Join Our Community?</h2>
              <p className="lead mb-4">
                Whether you're a farmer looking to sell your produce or a buyer seeking fresh agricultural products, 
                AgriTrade is the perfect platform for you.
              </p>
              <div className="d-flex gap-3 justify-content-center flex-wrap">
                <a href="/role-selection" className="btn btn-light btn-lg px-4">
                  <i className="fas fa-user-plus me-2"></i>
                  Get Started Today
                </a>
                <a href="/contact" className="btn btn-outline-light btn-lg px-4">
                  <i className="fas fa-envelope me-2"></i>
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
