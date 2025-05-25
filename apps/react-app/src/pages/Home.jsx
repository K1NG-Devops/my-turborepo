import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import TracksuitPromo from '../components/TracksuitPromo';

//import Swiper and SwiperSlide from 'swiper/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/autoplay';
import { Autoplay } from 'swiper/modules';


// Import local images (adjust if using Vite or Webpack)
import winterTracksuit from '../assets/track_suit1.png';
import winterTracksuit2 from '../assets/track_suit2.png';

const kidsImage = "https://img.freepik.com/free-photo/realistic-scene-with-young-children-with-autism-playing_23-2151241999.jpg";

const Home = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
    });
  }, []);

  return (
    <>
      <div className="mt-16 p-6 bg-pink-50 min-h-screen space-y-16">
        {/* Hero */}
        <header className="text-center mb-8" data-aos="fade-down">
          <h1 className="text-4xl md:text-5xl font-bold text-pink-700">Welcome to Young Eagles Day Care</h1>
          <p className="mt-4 text-xl text-gray-700 max-w-3xl mx-auto">
            Where learning meets love. We nurture little minds with big dreams through play, care, and creativity.
          </p>
        </header>

        <div className="flex justify-center mb-10" data-aos="zoom-in">
          <img
            src={kidsImage}
            alt="Happy children playing"
            className="rounded-3xl shadow-xl w-[90%] md:w-[70%] md:h-[400px] sm:h-[400px] object-cover"
          />
        </div>

        {/* Why Choose Us */}
        <section className="text-center mb-12" data-aos="fade-up">
          <h2 className="text-3xl font-semibold text-purple-700">Why Choose Us?</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-4xl mx-auto">
            At Young Eagles, your child's happiness, safety, and development come first. Our professional staff fosters creativity, communication, and curiosity in a safe and playful environment.
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12" data-aos="fade-up">
          <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition">
            <h3 className="text-xl font-bold text-blue-600 mb-2">Play-Based Learning</h3>
            <p className="text-gray-600">Fun, engaging activities that support emotional and cognitive growth.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition">
            <h3 className="text-xl font-bold text-green-600 mb-2">Safe Environment</h3>
            <p className="text-gray-600">Secure and clean facilities that give you peace of mind.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition">
            <h3 className="text-xl font-bold text-pink-600 mb-2">Experienced Teachers</h3>
            <p className="text-gray-600">Loving educators who support each child’s unique journey.</p>
          </div>
        </div>

        {/* Society 5.0 */}
        <section className="shadow-lg rounded-lg bg-white p-8" data-aos="fade-up">
          <h2 className="text-3xl font-bold text-blue-900 text-center mb-4">Introducing Society 5.0</h2>
          <p className="text-lg text-gray-700 text-center max-w-4xl mx-auto">
            Society 5.0 is a human-centered society that balances economic advancement with solving social problems through deep integration of cyberspace and the physical world.
          </p>
        </section>

        {/* Online Learning */}
        <section className="bg-blue-50 p-8 rounded-xl shadow-md" data-aos="fade-up">
          <h2 className="text-3xl font-bold text-center text-blue-800 mb-4">Empowering Digital Natives</h2>
          <p className="text-center text-gray-700 mb-6 max-w-3xl mx-auto">
            Young Eagles introduces coding, robotics, and computer literacy to kids using fun tools like <strong>ScratchJr</strong>, <strong>Blockly</strong>, and hands-on STEM kits.
          </p>
          <div className="flex justify-center">
            <Link
              to="/dashboard"
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-500 transition"
            >
              Explore Student Dashboard
            </Link>
          </div>
        </section>

        {/* Aftercare */}
        <section className="bg-yellow-50 p-8 rounded-xl shadow-md" data-aos="fade-up">
          <h2 className="text-3xl font-bold text-center text-yellow-700 mb-4">Aftercare & Robotics</h2>
          <p className="text-center text-gray-700 mb-6 max-w-3xl mx-auto">
            For curious minds beyond preschool, our <strong>aftercare robotics program</strong> continues nurturing innovation through tech-based activities.
          </p>
          <div className="flex justify-center">
            <a
              href="https://roboworld.co.za"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-500 transition"
            >
              Visit RoboWorld
            </a>
          </div>
        </section>

        {/* Tracksuit Promo */}
        <section className="bg-white p-8 rounded-xl shadow-lg border" data-aos="fade-up">
          <TracksuitPromo />
        </section>

        {/* Gallery */}
        <section className="bg-pink-100 p-8 rounded-xl shadow-md">
          <h2 className="text-3xl font-bold text-center text-pink-800 mb-6">Gallery Moments</h2>

          <Swiper
            modules={[Autoplay]}
            spaceBetween={20}
            slidesPerView={1.5}
            centeredSlides={true}
            loop={true}
            autoplay={{ delay: 2000, reverseDirection: true }}
            dir="rtl"
            className="w-full max-w-6xl"
          >
            {["/gallery/img1.jpg", "/gallery/img2.jpg", "/gallery/img3.jpeg", "/gallery/img4.png"].map((src, index) => (
              <SwiperSlide key={index}>
                <img
                  src={src}
                  alt={`Gallery ${index + 1}`}
                  className="md:h-100 h-50 w-full object-cover rounded-xl"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </section>



        {/* Final CTA */}
        <div className="text-center" data-aos="zoom-in">
          <Link
            to="/login"
            className="inline-block px-8 py-3 bg-pink-600 text-white text-lg font-semibold rounded-full shadow-md hover:bg-pink-500 transition mb-4 md:mb-0"
          >
            Parent Login
          </Link>
          <Link
            to="/popupload"
            className="ml-2 inline-block px-8 py-3 bg-purple-600 text-white text-lg font-semibold rounded-full shadow-md hover:bg-purple-500 transition"
          >
            Upload POP
          </Link>
        </div>
      </div>
    </>
  );
};

export default Home;
