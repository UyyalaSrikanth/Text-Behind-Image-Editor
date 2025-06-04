export default function About() {
  return (
    <div className="min-h-screen bg-black py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            About Us
          </h1>
          <p className="text-gray-400 text-lg">
            Making text-to-image generation accessible to everyone
          </p>
        </div>

        <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800">
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">Our Mission</h2>
              <p className="text-gray-400 leading-relaxed">
                We're dedicated to making text-to-image generation accessible and intuitive for everyone. 
                Our platform combines powerful AI technology with a user-friendly interface to help you 
                create stunning images from text descriptions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">What We Offer</h2>
              <ul className="space-y-4 text-gray-400">
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  Easy-to-use interface for quick image generation
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  Advanced customization options for precise control
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  High-quality output with professional results
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  Regular updates and improvements
                </li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
} 