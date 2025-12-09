import React from "react";
import styles from './Header.module.css';


function Footer() {
  return (
    
    <footer className={styles.foot} style={{  color: '#fff', fontFamily: 'inherit', fontSize: '1rem', marginTop: 40 }}>
      <div className="container ">
        <div className="row align-items-start gy-5">
          {/* Logo and Description */}
          <div className="col-12 col-md-3 mb-4 mb-md-0 d-flex flex-column align-items-md-start align-items-center">
            <img src="/agri-logo.png" alt="AgriLink & AgriTrade" style={{ width: 80, marginBottom: 16 }} />
            <h5 className="fw-bold mt-2 mb-2" style={{ color: '#fff', letterSpacing: 1 }}>AGRILINK & AGRITRADE</h5>
            <p style={{ color: '#b0b0b0', fontSize: '0.95rem', maxWidth: 220 }}>
              Connecting farmers and merchants directly for a better agri-marketplace.
            </p>
          </div>

          {/* Navigation */}
          <div className="col-6 col-md-2 mb-4 mb-md-0">
            <h6 className="fw-bold mb-3" style={{ color: '#fff' }}>Navigation</h6>
            <ul className="list-unstyled">
              <li><a href="/" className="underline-animate" style={{ color: '#b0b0b0' }}>Home</a></li>
              <li><a href="/about" className="underline-animate" style={{ color: '#b0b0b0' }}>About Us</a></li>
              <li><a href="/contact" className="underline-animate" style={{ color: '#b0b0b0' }}>Contact Us</a></li>
              <li><a href="#" className="underline-animate" style={{ color: '#b0b0b0' }}>Commodities</a></li>
              <li><a href="/role-selection" className="underline-animate" style={{ color: '#b0b0b0' }}>Signup</a></li>
              <li><a href="/login" className="underline-animate" style={{ color: '#b0b0b0' }}>Login</a></li>
            </ul>
          </div>

          {/* Dashboards */}
          <div className="col-6 col-md-2 mb-4 mb-md-0">
            <h6 className="fw-bold mb-3" style={{ color: '#fff' }}>Dashboards</h6>
            <ul className="list-unstyled">
              <li><a href="#" className="underline-animate" style={{ color: '#b0b0b0' }}>Farmer Dashboard</a></li>
              <li><a href="#" className="underline-animate" style={{ color: '#b0b0b0' }}>Merchant Dashboard</a></li>
              <li><a href="#" className="underline-animate" style={{ color: '#b0b0b0' }}>Admin Dashboard</a></li>
            </ul>
          </div>

          {/* Company */}
          <div className="col-6 col-md-2 mb-4 mb-md-0">
            <h6 className="fw-bold mb-3" style={{ color: '#fff' }}>Company</h6>
            <ul className="list-unstyled">
              <li><a href="#" className="underline-animate" style={{ color: '#b0b0b0' }}>Terms & Conditions</a></li>
              <li><a href="#" className="underline-animate" style={{ color: '#b0b0b0' }}>Privacy Policy</a></li>
            </ul>
          </div>

          {/* Social & Newsletter */}
          <div className="col-12 col-md-3 d-flex flex-column align-items-md-end align-items-center">
            <div className="d-flex align-items-center mb-3">
              <h6 className="fw-bold mb-0 me-3" style={{ color: '#ffffffff' }}>Get in touch</h6>
              <a href="#" className="me-2" title="Instagram" style={{ color: '#fffefeff', fontSize: 22 }}>
                <i className="bi bi-instagram"></i>
              </a>
              <a href="#" className="me-2" title="Facebook" style={{ color: '#fffefeff', fontSize: 22 }}>
                <i className="bi bi-facebook"></i>
              </a>
              <a href="#" title="LinkedIn" style={{ color: '#fffbfbff', fontSize: 22 }}>
                <i className="bi bi-linkedin"></i>
              </a>
            </div>
            <form className="d-flex w-100" style={{ maxWidth: 320 }}>
              <input type="email" className="form-control me-2" placeholder="Enter email address" style={{ borderRadius: 24, background: '#ffffffff', color: '#fff', border: 'none' }} />
              <button className="btn" type="submit" style={{ background: '#027527ff', color: '#fff', borderRadius: 24, padding: '0 24px', fontWeight: 600 }}>Subscribe</button>
            </form>
          </div>
        </div>
        <hr style={{ borderColor: '#0eff16ff',  }} />
        <div className="text-center" style={{ color: '#b0b0b0',padding:'20px', fontSize: '0.95rem' }}>
          &copy; {new Date().getFullYear()} AGRILINK & AGRITRADE. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
