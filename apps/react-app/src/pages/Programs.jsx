import React from "react";
import MyRegisterButton from "../components/MyRegisterButton";
import MyButton from "../components/MyButton";
import codeAPillar from "../assets/codeAPillar.png";
import legoBlocks from "../assets/legoBlocks.png";
// import kidsSmiling from "../assets/kidsSmiling.png"; // <- Add this new image

const Programs = () => {
  return (
    <div className="p-6 bg-yellow-100 text-gray-900 font-sans">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-pink-600 mt-20 mb-4">
          🌟 SmarTplay, Big Smiles: Our Fun Learning Programs
        </h1>
        <p className="text-lg max-w-3xl mx-auto bg-white p-4 rounded-lg shadow-md">
        Welcome to <strong>Young Eagles</strong> – where learning is a joyful adventure!
        Our preschool programs, designed for children aged 2 to 5, spark curiosity, nurture creativity, <br /> and inspire a love for learning. <br /><br />
        At <strong>Young Eagles</strong>, we believe in joyful beginnings through play-based learning, imaginative exploration, and early exposure to exciting subjects like robotics and coding.
        </p>
        {/* <img
          src={kidsSmiling}
          alt="Happy children"
          className="w-full max-w-xl mx-auto mt-6 rounded-lg shadow-lg"
        /> */}
      </header>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-center mb-8">
          🧠 Smart Play, Big Smiles: Our Fun Learning Programs
        </h2>

        <div className="space-y-14">

          {/* Mini Coders */}
          <div className="w-full px-4 md:px-8 lg:px-16 xl:px-32 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-30 text-center md:text-left">
              <img
                src={codeAPillar}
                alt="Code-a-pillar"
                className="md:w-105 md:h-90 h-70 rounded-lg shadow"
              />
              <div className="flex flex-col items-center bg-white rounded-lg p-4 md:items-start text-center md:text-left">
                <h3 className="text-xl font-bold mb-2 text-cyan-600">
                  🤖 Mini Coders & Robo Buddies (Ages 3–5)
                </h3>
                <p className="mb-3">
                  Children meet friendly robots like Bee-Bot and Code-a-pillar!<br />
                  Through hands-on games and tablet play, kids learn how to give
                  simple commands, <br />sequence movements, and problem-solve.
                </p>
                <ul className="list-disc list-inside mt-2 mb-5">
                  <li><strong>Age:</strong> 3–5 years</li>
                  <li><strong>Skills:</strong> Early logic, sequencing, motor skills</li>
                  <li><strong>Why it’s fun:</strong> Kids love making robots move and dance!</li>
                </ul>
                <MyRegisterButton />
              </div>
            </div>
          </div>



          {/* Little Builders */}
          <div className="w-full px-4 md:px-8 lg:px-16 xl:px-32 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row-reverse items-center gap-30 text-center md:text-left">
              <img
                src={legoBlocks}
                alt="Lego Blocks"
                className="md:w-105 md:h-95 h-70 rounded-lg shadow md:mb-0"
              />
              <div className="flex flex-col items-center md:items-start text-center md:text-left bg-white rounded-lg p-4">
                <h3 className="text-xl font-bold mb-2 text-indigo-900">
                  🏗️ Little Builders & Tinkerers (Ages 2–5)
                </h3>
                <p className="mb-3">
                  With colorful blocks, gears, and shapes, children build towers,<br />
                  bridges, and even pretend machines.
                </p>
                <ul className="list-disc list-inside mt-2 mb-5">
                  <li><strong>Age:</strong> 2–5 years</li>
                  <li><strong>Skills:</strong> Spatial awareness, creativity</li>
                  <li><strong>Why it’s fun:</strong> Every block becomes an adventure!</li>
                </ul>
                <MyRegisterButton />
              </div>
            </div>
          </div>


          {/* Creative Cubs */}
          <div className="text-center bg-cyan-500 text-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-bold mb-2">
              🎨 Creative Cubs Art Studio (Ages 2–5)
            </h3>
            <p>
              From finger painting to recycled crafts, little artists explore textures,
              colors, and materials while expressing themselves freely.
            </p>
            <ul className="list-disc list-inside ml-4 mt-2 text-left inline-block text-left">
              <li><strong>Skills:</strong> Creativity, sensory exploration</li>
              <li><strong>Why it’s fun:</strong> Imagination runs wild with no rules!</li>
            </ul>
          </div>

          {/* Imagination Station */}
          <div className="text-center bg-red-500 p-6 rounded-lg shadow text-white">
            <h3 className="text-xl font-bold mb-2 text-white">
              📚 Imagination Station (Ages 2–5)
            </h3>
            <p>
              Storytime becomes showtime! With puppets, dress-up play, and group
              games, kids build language skills and explore feelings in a fun way.
            </p>
            <ul className="list-disc list-inside ml-4 mt-2 text-left inline-block text-left">
              <li><strong>Skills:</strong> Language, empathy, social skills</li>
              <li><strong>Why it’s fun:</strong> Kids become the heroes of their own stories.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="text-center bg-indigo-400 p-6 rounded-lg shadow mt-12 text-white">
        <h2 className="text-2xl font-semibold mb-4 ">🌈 Our Environment</h2>
        <p className="max-w-3xl mx-auto text-slate-800 text-white">
          Our center is a colorful, inclusive, and loving space where every child is celebrated.
          We proudly reflect our African heritage in toys, books, and role models—making sure
          children see brown-skinned faces and diverse stories that they relate to.
        </p>
      </section>
    </div>
  );
};

export default Programs;
