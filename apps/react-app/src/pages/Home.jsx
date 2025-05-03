import React from 'react';
import MyButton from '../components/MyButton';
import image from '../assets/society-5.0.png';


const Home = () => (
    
    <div className="mt-16 shadow-lg rounded-lg w-full p-6">
      <header className='flex justify-center mb-6 text-5xl font-bold text-blue-900 transition duration-500 ease-in-out'>
        <h1>Introducing Society 5.0</h1>
      </header>
      <img src={image} alt="Society 5.0" loading='lazy' className="w-[60%] mx-auto rounded-lg shadow-md mb-6" />
      <p className="text-lg text-gray-700 mb-4">
        Society 5.0 is a human-centered society that balances economic advancement with the resolution of social problems by a system that highly integrates cyberspace and physical space.
        It is a vision for the future where technology and society work together to create a better world for all.
        <br />
        <br />
        In Society 5.0, we aim to create a society where everyone can enjoy a high quality of life, regardless of their age or background.
        This includes the use of advanced technologies such as AI, IoT, and big data to improve healthcare, education, and transportation.
        <br />
        </p>
      <h1 className="text-2xl font-bold text-center text-blue-900">Young Eagles Day Care Revolutionizing Education</h1>
      <p className="mt-6 text-center text-gray-600 text-lg max-w-4xl mx-auto">
        We provide a nurturing and safe environment for children to grow, learn, and thrive.
      </p>
      <div className="mt-8 flex justify-center">
      <MyButton />
        <h1></h1>
        </div>
    </div>
  )

export default Home