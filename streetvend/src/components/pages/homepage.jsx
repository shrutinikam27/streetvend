import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FaUtensils,
  FaMapMarkerAlt,
  FaBalanceScale,
  FaUsers,
  FaTruck,
  FaClipboardList,
  FaRupeeSign,
  FaMap,
  FaShoppingCart,
  FaChartLine,
  FaUser,
  FaBuilding,
  FaStar,
  FaStarHalfAlt,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaArrowRight
} from 'react-icons/fa';
import DeliveryTrackingCard from './DeliveryTrackingCard';

const HomePage = () => {
  const [activeTab, setActiveTab] = useState('vendor');
  const [isVisible, setIsVisible] = useState(false);
  const [showDeliveryTracking, setShowDeliveryTracking] = useState(false);

  useEffect(() => {
    setIsVisible(true);

    const handleScroll = () => {
      const elements = document.querySelectorAll('.scroll-animate');
      elements.forEach(el => {
        const elementTop = el.getBoundingClientRect().top;
        if (elementTop < window.innerHeight - 100) {
          el.classList.add('animate-in');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white overflow-hidden">
      {/* Navigation */}
      <header className="bg-white/95 backdrop-blur-sm shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-400 to-orange-600 flex items-center justify-center shadow-lg">
                <FaUtensils className="text-white text-xl" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">Vendorverse</span>
            </div>
            <div className="hidden md:flex gap-8">
              {['Features', 'How It Works', 'Dashboard', 'Testimonials'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                  className="font-medium text-gray-700 hover:text-orange-500 transition-all duration-300 relative group py-2"
                >
                  {item}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-400 to-orange-600 transition-all duration-300 group-hover:w-full"></span>
                </a>
              ))}
            </div>
            <div className="flex gap-3">
              <button className="px-6 py-2.5 border-2 border-orange-500 text-orange-500 rounded-lg hover:bg-orange-500 hover:text-white transition-all duration-300 transform hover:scale-105 font-medium">
                Login
              </button>
              <button className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-medium">
                Sign Up
              </button>
            </div>
          </nav>
        </div>
      </header>

      <section className="relative py-20 md:py-28 overflow-hidden bg-[#fffdf8]">
        {/* Background blobs */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-orange-500 rounded-full filter blur-3xl opacity-15 animate-pulse z-0"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-green-500 rounded-full filter blur-3xl opacity-15 animate-pulse z-0"></div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Force side-by-side on medium screens and above */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-12 lg:gap-20">

            {/* TEXT LEFT */}
            <div className="w-full md:w-1/2">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Empowering India's{' '}
                <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                  Street Food Vendors
                </span>
              </h1>
              <p className="text-gray-600 text-lg lg:text-xl mb-8 max-w-2xl leading-relaxed">
                Vendorverse connects street food vendors with verified suppliers for seamless raw material sourcing.
                Save time, reduce costs, and focus on creating delicious street food!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link to="/find-suppliers">
                  <button className="px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl font-medium text-lg">
                    Find Suppliers
                  </button>
                </Link>
                <Link to="/become-supplier">
                  <button className="px-8 py-4 border-2 border-orange-500 text-orange-500 rounded-lg hover:bg-orange-500 hover:text-white transition-all duration-300 transform hover:scale-105 font-medium text-lg">
                    Become a Supplier
                  </button>
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                <StatItem value="1,250+" label="Vendors Connected" />
                <StatItem value="420+" label="Verified Suppliers" />
                <StatItem value="₹85L+" label="Monthly Orders" />
              </div>
            </div>

            {/* IMAGE RIGHT */}
            <div className="w-full md:w-1/2 flex justify-center relative">
              <div className="relative max-w-lg w-full">
                <img
                  src="https://media.istockphoto.com/id/1329213718/photo/vada-pav.jpg?s=612x612&w=0&k=20&c=Yy3pm53KrPAnZXL9weCJDzXjxa2My34oVFx7RBCPmZ8="
                  alt="Street Food"
                  className="rounded-2xl w-full h-auto shadow-2xl border border-orange-100"
                />
               
                {/* Badge Top Left */}
                <div
                  className="absolute -top-6 -left-6 bg-gradient-to-r from-orange-500 to-orange-600 p-4 rounded-full shadow-xl cursor-pointer border-2 border-red-600 bg-red-200 bg-opacity-30"
                  onClick={() => setShowDeliveryTracking(true)}
                >
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white animate-pulse">
                    <FaTruck className="text-xl" />
                  </div>
                </div>

                {/* Bottom Label */}
                <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-xl shadow-xl border border-orange-100 transform rotate-3 hover:rotate-0 transition-all duration-300">
                  <div className="text-sm text-gray-500">Mumbai Vendor</div>
                  <div className="font-bold text-orange-500 text-lg">Saved ₹12,500/month</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section - Exactly 3 Features Per Row */}
      <section id="features" className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-4">
          <SectionTitle
            title="Key Features"
            subtitle="Everything street food vendors need to source quality ingredients efficiently"
          />

          {/* Exactly 3 features per row in desktop, responsive on mobile */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            <FeatureCard
              icon={<FaMapMarkerAlt className="text-3xl text-orange-500" />}
              title="Find Verified Suppliers"
              description="Search for trusted suppliers near you with ratings and reviews from other vendors."
            />
            <FeatureCard
              icon={<FaBalanceScale className="text-3xl text-orange-500" />}
              title="Compare Prices"
              description="Easily compare prices across multiple suppliers for the same product in real-time."
            />
            <FeatureCard
              icon={<FaUsers className="text-3xl text-orange-500" />}
              title="Group Orders"
              description="Join forces with other vendors to place bulk orders and unlock exclusive discounts."
            />
            <FeatureCard
              icon={<FaTruck className="text-3xl text-orange-500" />}
              title="Real-time Delivery Tracking"
              description="Track your orders with live updates and accurate estimated arrival times."
            />
            <FeatureCard
              icon={<FaClipboardList className="text-3xl text-orange-500" />}
              title="Inventory Management"
              description="Keep track of stock levels and get automated reorder alerts before you run out."
            />
            <FeatureCard
              icon={<FaRupeeSign className="text-3xl text-orange-500" />}
              title="Flexible Payments"
              description="Multiple payment options including COD, UPI, and flexible credit terms."
            />
          </div>
        </div>
      </section>
      {showDeliveryTracking && <DeliveryTrackingCard onClose={() => setShowDeliveryTracking(false)} />}

      {/* How It Works - Horizontal Steps with Arrows */}
      <section id="how-it-works" className="py-20 md:py-28 bg-gradient-to-br from-orange-50 via-white to-orange-50">
        <div className="container mx-auto px-4">
          <SectionTitle
            title="How It Works"
            subtitle="Simple steps to transform your raw material sourcing experience"
          />

          {/* Horizontal steps with arrows on desktop, vertical on mobile */}
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
              <StepCard
                number="1"
                title="Create Profile"
                description="Sign up as a vendor or supplier with your business details and get verified quickly."
              />
              <div className="text-orange-500 text-4xl animate-pulse hidden lg:block">
                <FaArrowRight />
              </div>
              <div className="text-orange-500 text-4xl animate-pulse transform rotate-90 lg:hidden">
                <FaArrowRight />
              </div>

              <StepCard
                number="2"
                title="Search & Connect"
                description="Find suppliers nearby or manage your product catalog with easy-to-use tools."
              />
              <div className="text-orange-500 text-4xl animate-pulse hidden lg:block">
                <FaArrowRight />
              </div>
              <div className="text-orange-500 text-4xl animate-pulse transform rotate-90 lg:hidden">
                <FaArrowRight />
              </div>

              <StepCard
                number="3"
                title="Place Orders"
                description="Place individual or group orders with instant notifications and confirmations."
              />
              <div className="text-orange-500 text-4xl animate-pulse hidden lg:block">
                <FaArrowRight />
              </div>
              <div className="text-orange-500 text-4xl animate-pulse transform rotate-90 lg:hidden">
                <FaArrowRight />
              </div>

              <StepCard
                number="4"
                title="Track & Receive"
                description="Track deliveries in real-time and receive fresh, quality ingredients on time."
              />
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Section - Clear Tabs and Visual Preview */}
      <section id="dashboard" className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-4">
          <SectionTitle
            title="Interactive Dashboard"
            subtitle="Experience our powerful vendor and supplier management dashboards"
          />

          {/* Tab Interface */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex bg-gradient-to-r from-orange-100 to-orange-50 p-2 rounded-2xl shadow-lg border border-orange-200">

              <button
                className={`px-8 py-4 rounded-xl transition-all duration-300 font-medium ${activeTab === 'vendor'
                  ? 'bg-white text-orange-500 shadow-lg transform scale-105'
                  : 'text-gray-600 hover:text-orange-500 hover:bg-white/50'
                  }`}
                onClick={() => {
                  setActiveTab("vendor");
                }}
              >
                Vendor Dashboard
              </button>

              <button
                className={`px-8 py-4 rounded-xl transition-all duration-300 font-medium ${activeTab === 'supplier'
                  ? 'bg-white text-orange-500 shadow-lg transform scale-105'
                  : 'text-gray-600 hover:text-orange-500 hover:bg-white/50'
                  }`}
                onClick={() => setActiveTab('supplier')}
              >
                Supplier Dashboard
              </button>
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="bg-gradient-to-br from-orange-50 to-white rounded-3xl p-8 shadow-xl border border-orange-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              {activeTab === 'vendor' ? (
                <>
  <DashboardCard
    icon={<FaMapMarkerAlt className="text-orange-500 text-xl" />}
    title="Nearby Suppliers"
    description="Interactive map showing verified suppliers in your area with distance and ratings."
  />
  <DashboardCard
    icon={<FaShoppingCart className="text-orange-500 text-xl" />}
    title="Order Management"
    description="View current, past, and upcoming orders with detailed status tracking."
  />
  <DashboardCard
    icon={<FaChartLine className="text-orange-500 text-xl" />}
    title="Price Comparison"
    description="Compare prices for ingredients across suppliers with historical trends."
  />
  <DashboardCard
    icon={<FaTruck className="text-orange-500 text-xl" />}
    title="Delivery Tracking"
    description="Real-time tracking of your orders with live location updates."
  />

  {/* Visual Dashboard Preview Area */}
  <div className="bg-gradient-to-r from-orange-100 via-orange-50 to-orange-100 border-2 border-dashed border-orange-300 rounded-2xl w-full min-h-96 p-6">
    <div className="text-center">
      <div className="flex justify-center items-center min-h-64">
        <img
          src="public/images/dash.png"
          alt="Vendor Dashboard Preview"
          className="rounded-xl shadow-md max-h-64 w-auto object-contain"
        />
      </div>
      <h3 className="text-2xl font-bold text-gray-800 mt-4 mb-2">Interactive Dashboard Preview</h3>
      <p className="text-gray-600 font-medium">Experience the full power of our {activeTab} dashboard</p>
    </div>
  </div>
</>

                
              ) : (
                <>
                  <DashboardCard
                    icon={<FaShoppingCart className="text-orange-500 text-xl" />}
                    title="Order Management"
                    description="View and manage all incoming orders with automated processing tools."
                  />
                  <DashboardCard
                    icon={<FaClipboardList className="text-orange-500 text-xl" />}
                    title="Inventory Management"
                    description="Track your stock levels in real-time with automated reorder alerts."
                  />
                  <DashboardCard
                    icon={<FaChartLine className="text-orange-500 text-xl" />}
                    title="Sales Analytics"
                    description="Detailed analytics on sales performance with profit margin insights."
                  />
                  <DashboardCard
                    icon={<FaUsers className="text-orange-500 text-xl" />}
                    title="Vendor Management"
                    description="Manage relationships with vendors and track their order history."
                  />
                   {/* Visual Dashboard Preview Area */}
           <div className="bg-gradient-to-r from-orange-100 via-orange-50 to-orange-100 border-2 border-dashed border-orange-300 rounded-2xl w-full min-h-96 flex items-center justify-center p-6">
  <div className="text-center">
    <img
      src="/images/sup.png"
      alt="Vendor Dashboard Preview"
      className="mx-auto rounded-xl shadow-md max-h-64 w-auto object-contain"
    />
    <h3 className="text-2xl font-bold text-gray-800 mt-4 mb-2">Interactive Dashboard Preview</h3>
    <p className="text-gray-600 font-medium">Experience the full power of our {activeTab} dashboard</p>
  </div>
</div>
                </>
              )}
            </div>

           


          </div>
        </div>
      </section >

      {/* Testimonials */}
      < section id="testimonials" className="py-20 md:py-28 bg-gradient-to-r from-gray-900 to-gray-800 text-white relative overflow-hidden" >
        <div className="absolute inset-0 bg-gradient-to-r from-orange-900/20 to-orange-800/20"></div>
        <div className="relative z-10 container mx-auto px-4">
          <SectionTitle
            title="Success Stories"
            subtitle="Hear from vendors and suppliers who transformed their business with Vendorverse"
            light
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <Testimonial
              name="Rajesh Kumar"
              role="Pani Puri Vendor, Delhi"
              rating={5}
              text="Vendorverse has completely changed how I source ingredients. I used to spend 3 hours every morning visiting markets. Now I place orders at night and get everything delivered fresh by 6 AM. The group order feature helped me save 20% on potatoes and onions!"
              icon={<FaUser />}
              color="bg-orange-100"
              iconColor="text-orange-500"
            />

            <Testimonial
              name="Priya Agro Products"
              role="Verified Supplier, Mumbai"
              rating={4.5}
              text="As a supplier, Vendorverse has given us access to hundreds of loyal customers we could never reach before. The platform handles order management and payments, so we can focus on quality and delivery."
              icon={<FaBuilding />}
              color="bg-green-100"
              iconColor="text-green-500"
            />
          </div>
        </div>
      </section >

      {/* CTA Section */}
      < section className="py-20 md:py-28 bg-gradient-to-r from-orange-500 via-orange-600 to-orange-500 text-white relative overflow-hidden" >
        <div className="absolute inset-0 opacity-30">
          <div className="w-full h-full bg-white bg-opacity-5" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        <div className="relative z-10 container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Transform Your Sourcing?</h2>
          <p className="text-orange-100 max-w-3xl mx-auto mb-12 text-xl leading-relaxed">
            Join thousands of vendors and suppliers who are saving time and money with Vendorverse
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <button className="px-10 py-4 bg-white text-orange-500 rounded-lg hover:bg-gray-100 transition-all duration-300 font-medium text-lg transform hover:scale-105 shadow-xl">
              Sign Up as Vendor
            </button>
            <button className="px-10 py-4 border-2 border-white text-white rounded-lg hover:bg-white hover:text-orange-500 transition-all duration-300 font-medium text-lg transform hover:scale-105">
              Register as Supplier
            </button>
          </div>
        </div>
      </section >

      {/* Footer - Horizontal 4-Column Layout */}
      < footer className="bg-gray-900 text-gray-300 pt-20 pb-8" >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {/* Company Info */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-400 to-orange-600 flex items-center justify-center shadow-lg">
                  <FaUtensils className="text-white text-xl" />
                </div>
                <span className="text-2xl font-bold text-white">Vendorverse</span>
              </div>
              <p className="mb-6 max-w-sm leading-relaxed">
                Empowering India's street food vendors with efficient sourcing solutions since 2023.
              </p>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-gray-300 hover:bg-gradient-to-r hover:from-orange-500 hover:to-orange-600 hover:text-white transition-all duration-300 transform hover:scale-110"
                >
                  <FaFacebookF />
                </a>
                <a
                  href="#"
                  className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-gray-300 hover:bg-gradient-to-r hover:from-orange-500 hover:to-orange-600 hover:text-white transition-all duration-300 transform hover:scale-110"
                >
                  <FaTwitter />
                </a>
                <a
                  href="#"
                  className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-gray-300 hover:bg-gradient-to-r hover:from-orange-500 hover:to-orange-600 hover:text-white transition-all duration-300 transform hover:scale-110"
                >
                  <FaInstagram />
                </a>
                <a
                  href="#"
                  className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-gray-300 hover:bg-gradient-to-r hover:from-orange-500 hover:to-orange-600 hover:text-white transition-all duration-300 transform hover:scale-110"
                >
                  <FaLinkedinIn />
                </a>
              </div>
            </div>

            <FooterColumn
              title="For Vendors"
              items={['Find Suppliers', 'Place Orders', 'Group Buying', 'Delivery Tracking', 'Vendor Resources']}
            />

            <FooterColumn
              title="For Suppliers"
              items={['Register as Supplier', 'Manage Products', 'Order Management', 'Payment Solutions', 'Supplier Resources']}
            />

            <FooterColumn
              title="Company"
              items={['About Us', 'Careers', 'Contact Us', 'FAQs', 'Privacy Policy']}
            />
          </div>

          <div className="pt-8 border-t border-gray-800 text-center">
            <p className="text-gray-400">&copy; 2023 Vendorverse. All rights reserved. Designed with ❤️ for India's street food vendors.</p>
          </div>
        </div>
      </footer >
    </div >
  );
};

// Reusable Components
const StatItem = ({ value, label }) => (
  <div className="text-center group">
    <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
      {value}
    </div>
    <div className="text-gray-600 font-medium">{label}</div>
  </div>
);

const SectionTitle = ({ title, subtitle, light }) => (
  <div className="text-center mb-16">
    <h2 className={`text-4xl md:text-5xl font-bold mb-6 relative inline-block ${light ? 'text-white' : 'text-gray-800'}`}>
      {title}
      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full"></div>
    </h2>
    <p className={`max-w-3xl mx-auto text-xl leading-relaxed ${light ? 'text-orange-100' : 'text-gray-600'}`}>
      {subtitle}
    </p>
  </div>
);

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group border border-gray-100">
    <div className="w-20 h-20 rounded-full bg-gradient-to-r from-orange-50 to-orange-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
      {icon}
    </div>
    <h3 className="text-xl font-semibold mb-4 text-gray-800">{title}</h3>
    <p className="text-gray-600 leading-relaxed">{description}</p>
  </div>
);

const StepCard = ({ number, title, description }) => (
  <div className="bg-white rounded-2xl p-8 text-center max-w-xs mx-auto shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 group border border-gray-100">
    <div className="w-24 h-24 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white flex items-center justify-center mx-auto mb-6 text-3xl font-bold shadow-lg group-hover:shadow-xl transition-all duration-300">
      {number}
    </div>
    <h3 className="text-xl font-semibold mb-3 text-gray-800">{title}</h3>
    <p className="text-gray-600 leading-relaxed">{description}</p>
  </div>
);

const DashboardCard = ({ icon, title, description }) => (
  <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group border border-gray-100">
    <h3 className="text-lg font-semibold mb-3 flex items-center text-gray-800">
      <span className="mr-3 group-hover:scale-110 transition-transform duration-300">{icon}</span>
      {title}
    </h3>
    <p className="text-gray-600 leading-relaxed">{description}</p>
  </div>
);

const Testimonial = ({ name, role, rating, text, icon, color, iconColor }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  return (
    <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
      <div className="flex items-center mb-6">
        <div className={`w-16 h-16 rounded-full ${color} flex items-center justify-center ${iconColor} mr-4 shadow-lg`}>
          {icon}
        </div>
        <div>
          <h4 className="font-semibold text-lg text-gray-800">{name}</h4>
          <p className="text-gray-600">{role}</p>
          <div className="flex items-center text-yellow-400 mt-2">
            {[...Array(fullStars)].map((_, i) => (
              <FaStar key={`full-${i}`} className="text-yellow-400 w-4 h-4" />
            ))}
            {hasHalfStar && <FaStarHalfAlt className="text-yellow-400 w-4 h-4" />}
            <span className="text-gray-500 ml-2 font-medium">{rating.toFixed(1)}</span>
          </div>
        </div>
      </div>
      <p className="text-gray-700 leading-relaxed text-lg">"{text}"</p>
    </div>
  );
};

const FooterColumn = ({ title, items }) => (
  <div>
    <h3 className="text-white text-lg font-semibold mb-6">{title}</h3>
    <ul className="space-y-3">
      {items.map((item, index) => (
        <li key={index}>
          <a href="#" className="text-gray-300 hover:text-orange-400 transition-colors duration-300 hover:translate-x-1 inline-block">
            {item}
          </a>
        </li>
      ))}
    </ul>
  </div>
);

export default HomePage;
