export default function PrivacyPolicy() {
  return (
    <div className='leading-relaxed text-foreground/70 max-w-3xl mx-auto px-4 py-8'>
      <h1 className='text-3xl font-bold text-foreground mb-6'>
        Privacy Policy
      </h1>
      <p className='mb-6'>Last updated: 2024-01-16</p>

      <div className='space-y-6'>
        <p>
          At rr7-supabase-starter, we are committed to protecting your privacy.
          This policy explains how we collect, use, and protect your personal
          data.
        </p>

        <div>
          <h2 className='text-xl font-semibold text-foreground mb-2'>
            1. Information We Collect
          </h2>
          <p>
            We collect and process the following information:
            <ul className='list-disc pl-6 mt-2 space-y-1'>
              <li>
                Account information: email address and username when you
                register
              </li>
              <li>Authentication data when you sign in with Google</li>
              <li>Your reading history and quiz responses</li>
              <li>Usage data: how you interact with our application</li>
              <li>
                Technical information: IP address, browser type, device
                information
              </li>
              <li>
                For anonymous users, we collect limited data such as IP address
                and usage patterns
              </li>
            </ul>
            You can delete your account at any time, which will remove your
            personal information from our systems.
          </p>
        </div>

        <div>
          <h2 className='text-xl font-semibold text-foreground mb-2'>
            2. How We Use Your Information
          </h2>
          <p>
            We use your information to:
            <ul className='list-disc pl-6 mt-2 space-y-1'>
              <li>Provide and improve our services</li>
              <li>Personalize your learning experience</li>
              <li>Generate and evaluate quiz questions</li>
              <li>Track your progress and maintain your scores</li>
              <li>Ensure security of our services</li>
              <li>Communicate important updates about our service</li>
            </ul>
          </p>
        </div>

        <div>
          <h2 className='text-xl font-semibold text-foreground mb-2'>
            3. Third-Party Services and Content
          </h2>
          <p>
            We work with the following third-party services:
            <ul className='list-disc pl-6 mt-2 space-y-1'>
              <li>Google Authentication for user sign-in</li>
              <li>
                Wikipedia as our sole source of article content - we do not
                modify or create article content
              </li>
              <li>Supabase for data storage</li>
              <li>Cloud hosting providers for our infrastructure</li>
            </ul>
            Each third-party service processes your data according to their own
            privacy policies and our data processing agreements with them. While
            we carefully select articles from Wikipedia, we are not responsible
            for their content.
          </p>
        </div>

        <div>
          <h2 className='text-xl font-semibold text-foreground mb-2'>
            4. Use of AI and Question Generation
          </h2>
          <p>
            We use artificial intelligence (AI) and large language models (LLMs)
            to:
            <ul className='list-disc pl-6 mt-2 space-y-1'>
              <li>Generate educational questions from Wikipedia articles</li>
              <li>
                Create mathematical representations ("embeddings") of content
              </li>
              <li>Process and evaluate your answers</li>
              <li>Improve our question generation algorithms</li>
            </ul>
            AI-generated materials and embeddings are stored securely and cannot
            be used to reconstruct your personal information.
          </p>
        </div>

        <div>
          <h2 className='text-xl font-semibold text-foreground mb-2'>
            5. Cookies and Similar Technologies
          </h2>
          <p>
            We use essential cookies to:
            <ul className='list-disc pl-6 mt-2 space-y-1'>
              <li>Maintain your session</li>
              <li>Remember your preferences</li>
              <li>Ensure security</li>
            </ul>
            You can manage cookie preferences through your browser settings.
          </p>
        </div>

        <div>
          <h2 className='text-xl font-semibold text-foreground mb-2'>
            6. Your Data Rights
          </h2>
          <p>
            You can:
            <ul className='list-disc pl-6 mt-2 space-y-1'>
              <li>
                Delete your account and associated data through your account
                settings
              </li>
              <li>
                Request corrections of your account information by contacting us
              </li>
              <li>Request an export of your personal data</li>
            </ul>
          </p>
        </div>

        <div>
          <h2 className='text-xl font-semibold text-foreground mb-2'>
            6. Young Users
          </h2>
          <p>
            Our service is educational in nature and primarily sources content
            from Wikipedia. While we welcome users of all ages, if you are a
            young user, we encourage you to review these terms with a parent or
            guardian.
          </p>
        </div>

        <div>
          <h2 className='text-xl font-semibold text-foreground mb-2'>
            7. Contact Us
          </h2>
          <p>
            For privacy-related questions, contact us at:
            <br />
            Email: rr7-supabase-starter.dev@gmail.com
          </p>
        </div>

        <p>
          By using rr7-supabase-starter, you consent to this privacy policy. If
          you do not agree with this policy, please do not use our application.
        </p>
      </div>
    </div>
  );
}
