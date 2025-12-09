import React from "react";
import "./css/Home.css";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Home() {
  const { isAuthenticated, logout } = useAuth();

  // Function to scroll to products section
  const scrollToProducts = () => {
    const productsSection = document.getElementById('products-section');
    if (productsSection) {
      productsSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <React.Fragment>
      <div className="container-fluid">
        <div className="col-md-12">
      {/* Logout Button - Only show when authenticated */}
      {isAuthenticated() && (
        
        <div className="container-fluid bg-light py-2">
          <div className="row">
            <div className="col-12 text-end">
              <button 
                onClick={logout} 
                className="btn btn-outline-danger btn-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HERO + CAROUSEL OVERLAY SECTION */}
      
      <section className="hero-carousel-section position-relative">
        <div id="carouselExampleCaptions" className="carousel slide">
          <div className="carousel-indicators">
            <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to={0} className="active" aria-current="true" aria-label="Slide 1" />
            <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to={1} aria-label="Slide 2" />
            <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to={2} aria-label="Slide 3" />
          </div>
          <div className="carousel-inner">
            <div className="carousel-item active">
              <video 
                src="/video/carousel video.mp4" 
                className="d-block w-100 s-h-w optimized-video" 
                autoPlay 
                loop 
                muted 
                playsInline 
                disablePictureInPicture
                preload="auto"
                style={{
                  willChange: 'transform',
                  backfaceVisibility: 'hidden'
                }}
              />
            
            </div>
            <div className="carousel-item">
              <img 
                src="/slider2.jpeg" 
                className="d-block w-100 s-h-w optimized-image" 
                alt="Agricultural Slide 2"
                loading="eager"
                decoding="sync"
              />
            </div>
            <div className="carousel-item">
              <img 
                src="/slider3.jpeg" 
                className="d-block w-100 s-h-w optimized-image" 
                alt="Agricultural Slide 3"
                loading="eager"
                decoding="sync"
              />
            </div>
          </div>
          <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true" />
            <span className="visually-hidden">Previous</span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true" />
            <span className="visually-hidden">Next</span>
          </button>
        </div>
        {/* Overlayed Hero Content */}
        <div className="hero-overlay-content position-absolute top-50 start-50 translate-middle text-center w-100">
          <h1 className="display-4 fw-bold text-white text-shadow">Empowering Farmers. Connecting Directly to Buyers.</h1>
          <p className="lead mt-3 mb-4 text-white text-shadow">
            Sell your produce directly to clients. No middlemen. Better prices. Trusted platform.
          </p>
          <Link to="/login" className="btn btn-success  btn-lg mx-2">Get Started</Link>
          <button onClick={scrollToProducts} className="btn btn-outline-light btn-lg mx-2">Browse Products</button>
        </div>
      </section>


                <div className=" row bg-d">
      <section className="container my-5" data-aos="fade-up">
        <h2 className="text-center mb-4" data-aos="fade-down" data-aos-delay="200">How It Works</h2>
          <div className="row text-center">
            <div className="col-md-3 mb-4" data-aos="fade-up" data-aos-delay="300">
              <img src="/icons/icons8-farmer-100.png" alt="Register" width="60" />
            <h5>Register</h5>
            <p>Farmers sign up and list their produce.</p>
          </div>
          <div className="col-md-3 mb-4" data-aos="fade-up" data-aos-delay="400">
              <img src="/icons/icons8-browse-100.png" alt="Browse" width="60" />
            <h5>Browse</h5>
            <p>Buyers browse and select products.</p>
          </div>
          <div className="col-md-3 mb-4" data-aos="fade-up" data-aos-delay="500">
              <img src="/icons/icons8-payment-100.png" alt="Payment" width="60" />
            <h5>Direct Payment</h5>
            <p>Secure, direct payments to farmers.</p>
          </div>
          <div className="col-md-3 mb-4" data-aos="fade-up" data-aos-delay="600">
              <img src="/icons/icons8-delivery-100.png" alt="Delivery" width="60" />
            <h5>Delivery</h5>
            <p>Fresh produce delivered to your door.</p>
          </div>
        </div>
      </section>
      </div>
      {/* TRUST & SAFETY SECTION */}
      <div className="bg-d row">
      <section className="container-fluid my-5" data-aos="fade-up">
        <h2 className="text-center mb-4" data-aos="fade-down" data-aos-delay="200">Trust & Safety</h2>
        <div className="row text-center">
          <div className="col-md-4 mb-4" data-aos="zoom-in" data-aos-delay="300">
            <img src="/iconhome1.png" width="80" height="80" alt="Trusted" />
            <h5 className="mt-2">Trusted Platform</h5>
            <p>10,000+ farmers and buyers trust us.</p>
          </div>
          <div className="col-md-4 mb-4" data-aos="zoom-in" data-aos-delay="400">
            <img src="/icon_second_home.png" width="80" height="80" alt="Secure" />
            <h5 className="mt-2">Safe & Secure</h5>
            <p>Verified sellers and secure payments.</p>
          </div>
          <div className="col-md-4 mb-4" data-aos="zoom-in" data-aos-delay="500">
            <img src="/icon_third_home.png" width="80" height="80" alt="Support" />
            <h5 className="mt-2">Quick Assistance</h5>
            <p>24/7 support for all users.</p>
          </div>
        </div>
      </section>
      </div>
      {/* products */}
      <div className="bg-d row">
      <div id="products-section" className="row mt-5" data-aos="fade-up">
        <div className="col-md-10" >
        <h2 className="section-title mb-4" style={{paddingLeft:'50px'}} data-aos="fade-right" data-aos-delay="200">Top Products</h2>
        </div>
        <div className="col-md-2">
          <button type="button" className="btn btn-success" data-aos="fade-left" data-aos-delay="300">View All</button>
        </div>
      </div>
      <div className="row mt-5 landing-hero">
        <div className="col-md-12">
          <div className="row mt-5">
            {/* card 1 */}
            <div className="col-md-3 j-c-s" data-aos="flip-left" data-aos-delay="400">
              <div className="card" style={{width: '18rem'}}>
                <img src="/wheat.jpeg" className="card-img-top" height={"220px"} alt="Wheat" />
                <div className="card-body">
                  <h5 className="card-title">Wheat</h5>
                  <p className="card-text" style={{fontSize: '1.1rem', color: '#222'}}>High-quality wheat grains, rich in fiber and essential nutrients.</p>
                  <Link to="#" className="btn btn-primary">Add to cart</Link>
                </div>
              </div>
            </div>
            {/* card 2 */}
            <div className="col-md-3 j-c-s" data-aos="flip-left" data-aos-delay="500">
              <div className="card" style={{width: '18rem'}}>
                <img src="/paddy.jpeg" className="card-img-top" alt="Paddy" />
                <div className="card-body">
                  <h5 className="card-title">Paddy</h5>
                  <p className="card-text" style={{fontSize: '1.1rem', color: '#222'}}>Freshly harvested paddy suitable for rice mills.</p>
                  <Link to="#" className="btn btn-primary">Add to cart</Link>
                </div>
              </div>
            </div>
            {/* card 3 */}
            <div className="col-md-3 j-c-s" data-aos="flip-left" data-aos-delay="600">
              <div className="card" style={{width: '18rem'}}>
                <img src="/corn.jpeg" className="card-img-top" alt="Maize (Corn)" />
                <div className="card-body">
                  <h5 className="card-title">Maize (Corn)</h5>
                  <p className="card-text" style={{fontSize: '1.1rem', color: '#222'}}>Premium-quality yellow maize ideal for animal feed, food processing, and grain trading.</p>
                  <Link to="#" className="btn btn-primary">Add to cart</Link>
                </div>
              </div>
            </div>
            {/* card 4 */}
            <div className="col-md-3 j-c-s" data-aos="flip-left" data-aos-delay="700">
              <div className="card" style={{height: '100%', width: '18rem'}}>
                <img src="/oats.jpeg" className="card-img-top" height={"220px"} alt="Oats" />
                <div className="card-body">
                  <h5 className="card-title">Oats</h5>
                  <p className="card-text" style={{fontSize: '1.1rem', color: '#222'}}>Clean and high-quality oats, ideal for breakfast cereals and health food markets.</p>
                  <Link to="#" className="btn btn-primary">Add to cart</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
      {/* CATEGORY SECTION */}
      <div className="bg-d row ">
      <section className="container-fluid my-5" data-aos="fade-up">
        <div className="row mt-5">
          <div className="col-12">
            <h2 className="section-title mb-4" style={{paddingLeft:'50px'}} data-aos="fade-down" data-aos-delay="200">Category</h2>
          </div>
        </div>
        {/* category 1 */}
        <div className="row mt-5" data-aos="fade-up" data-aos-delay="300">
          <div className="col-md-12">
            <div className="row">
              <div className="col-md-3 j-c-s" data-aos="fade-right" data-aos-delay="400">
                <div className="card" style={{width: '18rem'}}>
                  <img src="/seeds.jpeg" className="card-img-top" alt="..." />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">Seeds</h5>
                <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card’s content.</p>
                <Link to="#" className="btn btn-primary mt-auto">Add to cart</Link>
              </div>
            </div>
          </div>
          {/* Cereal Seeds column */}
          <div className="col-md-3 mb-4" data-aos="fade-up" data-aos-delay="500">
            <h4>Cereal Seeds</h4>
            <Link to="#" className="link underline-animate ">Wheat Seeds</Link><br />
            <Link to="#" className="link underline-animate ">Rice Seeds</Link><br />
            <Link to="#" className="link underline-animate ">Maize/Corn Seeds </Link><br />
            <Link to="#" className="link underline-animate ">Barley Seeds</Link><br />
            <Link to="#" className="link underline-animate ">Sorghum Seeds</Link><br />
          </div>
          {/* Pulses (Dal) Seeds column */}
          <div className="col-md-3 mb-4" data-aos="fade-up" data-aos-delay="600">
            <h4>Pulses (Dal) Seeds</h4>
            <Link to="#" className="link underline-animate ">Moong (Green Gram) Seeds</Link><br />
            <Link to="#" className="link underline-animate ">Urad (Black Gram) Seeds</Link><br />
            <Link to="#" className="link underline-animate ">Masoor (Lentil) Seeds </Link><br />
            <Link to="#" className="link underline-animate ">Arhar/Tur (Pigeon Pea) Seeds</Link><br />
            <Link to="#" className="link underline-animate ">Chana (Gram) Seeds</Link><br />
          </div>
          {/* Oilseed Seeds column */}
          <div className="col-md-3 mb-4" data-aos="fade-up" data-aos-delay="700">
            <h4>Oilseed Seeds</h4>
            <Link to="#" className="link underline-animate ">Mustard Seeds </Link><br />
            <Link to="#" className="link underline-animate ">Groundnut Seeds</Link><br />
            <Link to="#" className="link underline-animate ">Soybean Seeds </Link><br />
            <Link to="#" className="link underline-animate ">Sunflower Seeds</Link><br />
            <Link to="#" className="link underline-animate ">Sesame (Til) Seeds</Link><br />
          </div>
        </div>
      </div>
    </div>
        {/* category 2 */}
        <div className="row mt-5" data-aos="fade-up" data-aos-delay="800">
          <div className="col-md-12">
            <div className="row">
              <div className="col-md-3 j-c-s" data-aos="fade-right" data-aos-delay="900">
                <div className="card" style={{width: '18rem'}}>
                  <img src="/fertiliser.jpeg" className="card-img-top" alt="..." />
                  <div className="card-body">
                    <h5 className="card-title">Fertiliser</h5>
                    <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card’s content.</p>
                    <Link to="#" className="btn btn-primary">Add to cart</Link>
                  </div>
                </div>
              </div>
              <div className="col-md-3 " data-aos="fade-up" data-aos-delay="500">
                <h4> Organic Fertilisers</h4>
                <Link to="#" className="link underline-animate">Vermicompost</Link><br />
                <Link to="#" className="link underline-animate">Cow Dung Manure</Link><br />
                <Link to="#" className="link underline-animate">Neem Cake</Link><br />
                <Link to="#" className="link underline-animate">Bone Meal</Link><br />
                <Link to="#" className="link underline-animate">Compost Mixture</Link><br />
              </div>
              <div className="col-md-3 " data-aos="fade-up" data-aos-delay="600">
                <h4>Chemical Fertilisers</h4>
                <Link to="#" className="link underline-animate">Urea</Link><br />
                <Link to="#" className="link underline-animate">Di-Ammonium Phosphate (DAP)</Link><br />
                <Link to="#" className="link underline-animate">Single Super Phosphate (SSP)</Link><br />
                <Link to="#" className="link underline-animate">Muriate of Potash (MOP)</Link><br />
                <Link to="#" className="link underline-animate">Ammonium Sulphate</Link><br />
              </div>
              <div className="col-md-3 " data-aos="fade-up" data-aos-delay="700">
                <h4>Micronutrient Fertilisers</h4>
                <Link to="#" className="link underline-animate">Zinc Sulphate</Link><br />
                <Link to="#" className="link underline-animate">Boron Fertiliser</Link><br />
                <Link to="#" className="link underline-animate">Copper Sulphate</Link><br />
                <Link to="#" className="link underline-animate">Iron Chelates</Link><br />
                <Link to="#" className="link underline-animate">Magnesium Fertiliser</Link><br />
              </div>
            </div>
          </div>
        </div>
        {/* category 3*/}
        <div className="row mt-5" data-aos="fade-up" data-aos-delay="600">
          <div className="col-md-12">
            <div className="row">
              <div className="col-md-3 j-c-s" data-aos="fade-right" data-aos-delay="700">
                <div className="card" style={{width: '18rem'}}>
                  <img src="/grains.jpeg" className="card-img-top" alt="..." />
                  <div className="card-body">
                    <h5 className="card-title">Grains</h5>
                    <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card’s content.</p>
                    <Link to="#" className="btn btn-primary">Add to cart</Link>
                  </div>
                </div>
              </div>
              <div className="col-md-3 " data-aos="fade-up" data-aos-delay="800">
                <h4> Whole Grains</h4>
                <Link to="#" className="link underline-animate">Wheat</Link><br />
                <Link to="#" className="link underline-animate">Barley</Link><br />
                <Link to="#" className="link underline-animate">Millet (Bajra)</Link><br />
                <Link to="#" className="link underline-animate">Sorghum (Jowar)</Link><br />
                <Link to="#" className="link underline-animate">Oats</Link><br />
              </div>
              <div className="col-md-3 " data-aos="fade-up" data-aos-delay="900">
                <h4> Rice Varieties</h4>
                <Link to="#" className="link underline-animate">Basmati Rice</Link><br />
                <Link to="#" className="link underline-animate">Non-Basmati Rice</Link><br />
                <Link to="#" className="link underline-animate">Brown Rice</Link><br />
                <Link to="#" className="link underline-animate">Parboiled Rice</Link><br />
                <Link to="#" className="link underline-animate">Sticky Rice</Link><br />
              </div>
              <div className="col-md-3 " data-aos="fade-up" data-aos-delay="1000">
                <h4> Other Cereal Grains</h4>
                <Link to="#" className="link underline-animate">Maize / Corn</Link><br />
                <Link to="#" className="link underline-animate">Ragi (Finger Millet)</Link><br />
                <Link to="#" className="link underline-animate">Buckwheat</Link><br />
                <Link to="#" className="link underline-animate">Foxtail Millet</Link><br />
                <Link to="#" className="link underline-animate">Kodo Millet</Link><br />
              </div>
            </div>
          </div>
        </div>
      </section>
      </div>
      {/* BENEFITS SECTION */}
      <div className="bg-d row">
        <div className="col-md-12">
      <section className="container my-5" data-aos="fade-up">
        <h2 className="text-center mb-4" data-aos="fade-down" data-aos-delay="200">Why Choose Us?</h2>
        <div className="row text-center ">
          <div className="col-md-6 mb-4" data-aos="slide-right" data-aos-delay="300">
            <div className="p-4 border rounded cbc text-white h-100">
              <h4>For Farmers</h4>
              <ul className="list-unstyled mt-3">
                <li>✔ Better prices, no commission</li>
                <li>✔ Easy listing process</li>
                <li>✔ Secure, instant payments</li>
                <li>✔ Reach more buyers directly</li>
              </ul>
            </div>
          </div>
          <div className="col-md-6 mb-4" data-aos="slide-left" data-aos-delay="400">
            <div className="p-4 border rounded cbc text-white h-100">
              <h4>For Buyers</h4>
              <ul className="list-unstyled mt-3">
                <li>✔ Fresh, quality produce</li>
                <li>✔ Transparent sourcing</li>
                <li>✔ Support local farmers</li>
                <li>✔ Competitive prices</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      </div>
      </div>
      </div></div>
    </React.Fragment>
  );
}

export default Home;
