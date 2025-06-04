export default function Contact() {
  return (
    <div className="min-h-[calc(100vh-600px)] bg-black py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Contact Us
          </h1>
          <p className="text-gray-400 text-lg">
            Get in touch with us for any questions or support
          </p>
        </div>

        <div className="bg-gray-900 rounded-2xl p-6 md:p-8 border border-gray-100">
          <div className="space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">Email Us</h2>
              <p className="text-gray-400 leading-relaxed">
                For any inquiries, please contact us at{' '}
                <a href="mailto:usrikanthuyyala@gmail.com" className="text-blue-400 hover:text-blue-300">
                  usrikanthuyyala@gmail.com
                </a>
              </p>
              <p className="text-gray-400 mt-4">
                We typically respond within 24 hours.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
} 