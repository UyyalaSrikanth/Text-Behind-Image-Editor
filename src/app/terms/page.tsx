export default function Terms() {
  return (
    <div className="min-h-screen bg-black py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Terms & Conditions
          </h1>
          <p className="text-gray-400 text-lg">
            Please read these terms carefully before using our service
          </p>
        </div>

        <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800">
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">Acceptance of Terms</h2>
              <p className="text-gray-400 leading-relaxed">
                By accessing and using Text Image Editor, you agree to be bound by these Terms and Conditions. 
                If you do not agree to these terms, please do not use our service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">Service Usage</h2>
              <ul className="space-y-4 text-gray-400">
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  You must be at least 13 years old to use this service
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  You are responsible for maintaining the security of your account
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  You agree not to use the service for any illegal purposes
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">Content Guidelines</h2>
              <p className="text-gray-400 leading-relaxed">
                You agree not to generate or upload any content that is illegal, harmful, threatening, 
                abusive, harassing, defamatory, or otherwise objectionable. We reserve the right to 
                remove any content that violates these guidelines.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">Intellectual Property</h2>
              <p className="text-gray-400 leading-relaxed">
                You retain all rights to your text input. However, the generated images may be subject 
                to usage restrictions. Please review our licensing terms for more information about 
                image usage rights.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">Limitation of Liability</h2>
              <p className="text-gray-400 leading-relaxed">
                Text Image Editor is provided "as is" without any warranties. We are not liable for 
                any damages arising from the use or inability to use our service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">Changes to Terms</h2>
              <p className="text-gray-400 leading-relaxed">
                We reserve the right to modify these terms at any time. We will notify users of any 
                significant changes. Continued use of the service after changes constitutes acceptance 
                of the new terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">Contact</h2>
              <p className="text-gray-400 leading-relaxed">
                If you have any questions about these terms, please contact us at{' '}
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