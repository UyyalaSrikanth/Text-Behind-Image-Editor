export default function Privacy() {
  return (
    <div className="min-h-screen bg-black py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Privacy Policy
          </h1>
          <p className="text-gray-400 text-lg">
            How we collect, use, and protect your information
          </p>
        </div>

        <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800">
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">Information We Collect</h2>
              <ul className="space-y-4 text-gray-400">
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  Text input you provide for image generation
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  Usage statistics to improve our service
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  Technical information about your device and browser
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">How We Use Your Information</h2>
              <ul className="space-y-4 text-gray-400">
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  To generate and process your images
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  To improve and optimize our service
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  To ensure the security of our platform
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">Data Security</h2>
              <p className="text-gray-400 leading-relaxed">
                We implement appropriate security measures to protect your information. 
                Your data is encrypted during transmission and storage. We regularly 
                review and update our security practices to maintain the highest 
                standards of protection.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">Your Rights</h2>
              <ul className="space-y-4 text-gray-400">
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  Access your personal information
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  Request deletion of your data
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  Opt-out of non-essential data collection
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">Contact Us</h2>
              <p className="text-gray-400 leading-relaxed">
                If you have any questions about our privacy practices, please contact us at{' '}
                <a href="mailto:usrikanthuyyala@gmail.com" className="text-blue-400 hover:text-blue-300">
                  usrikanthuyyala@gmail.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
} 