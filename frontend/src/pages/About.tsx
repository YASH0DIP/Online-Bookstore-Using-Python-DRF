import React from "react";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="bg-white px-4 py-10 sm:px-3 lg:px-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-bold text-blue-700 text-center mb-10">
          📚 About BookStore
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Left Image */}
          <img
            src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f"
            alt="Bookshelf"
            className="w-full h-auto rounded-lg shadow-lg object-cover"
          />

          {/* Right Text */}
          <div className="space-y-6 text-gray-700">
            <p className="text-lg">
              Welcome to <span className="font-semibold text-blue-600">BookStore</span>, your one-stop destination
              for a wide range of books, from timeless classics to modern
              bestsellers.
            </p>

            <p className="text-lg">
              Our mission is to make reading more accessible and enjoyable for
              everyone. We’re passionate about books and believe that the right
              book can change your life.
            </p>

            <p className="text-lg">
              Whether you're a student, a professional, or a casual reader, we
              have something for you. Browse, explore, and find your next
              favorite book today!
            </p>

            <div className="mt-4">
              <Link
                to="/"
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition duration-300"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
