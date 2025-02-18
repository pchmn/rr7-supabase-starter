import { Link } from 'react-router';

export default function TermsAndConditions() {
  return (
    <div className='leading-relaxed text-foreground/70 max-w-3xl mx-auto px-4 py-8'>
      <h1 className='text-3xl font-bold text-foreground mb-6'>
        Terms and Conditions
      </h1>
      <p className='mb-6'>Last updated: 2024-01-16</p>

      <div className='space-y-6'>
        <p>
          Welcome to rr7-supabase-starter. By accessing or using our
          application, you agree to be bound by these terms and conditions.
        </p>

        <div>
          <h2 className='text-xl font-semibold text-foreground mb-2'>
            1. Definitions
          </h2>
          <p>
            <ul className='list-disc pl-6 mt-2 space-y-1'>
              <li>
                "rr7-supabase-starter," "we," "us," and "our" refer to
                rr7-supabase-starter and its operators
              </li>
              <li>
                "Service" refers to the rr7-supabase-starter application and
                website
              </li>
              <li>
                "User," "you," and "your" refer to any person accessing or using
                the Service
              </li>
              <li>
                "Content" includes articles, questions, answers, and other
                materials
              </li>
            </ul>
          </p>
        </div>

        <div>
          <h2 className='text-xl font-semibold text-foreground mb-2'>
            2. Account Registration and Security
          </h2>
          <p>
            <ul className='list-disc pl-6 mt-2 space-y-1'>
              <li>You may use the service anonymously or create an account</li>
              <li>You are responsible for maintaining your account security</li>
              <li>You must notify us of any unauthorized account access</li>
            </ul>
          </p>
        </div>

        <div>
          <h2 className='text-xl font-semibold text-foreground mb-2'>
            3. Acceptable Use
          </h2>
          <p>
            You agree not to:
            <ul className='list-disc pl-6 mt-2 space-y-1'>
              <li>Use the service for any illegal purpose</li>
              <li>Attempt to gain unauthorized access</li>
              <li>Interfere with the service's operation</li>
              <li>Create multiple accounts for abusive purposes</li>
              <li>Share answers or manipulate the scoring system</li>
            </ul>
          </p>
        </div>

        <div>
          <h2 className='text-xl font-semibold text-foreground mb-2'>
            4. Intellectual Property
          </h2>
          <p>
            <ul className='list-disc pl-6 mt-2 space-y-1'>
              <li>
                rr7-supabase-starter's content and features are protected by
                intellectual property laws
              </li>
              <li>Wikipedia content is subject to Wikipedia's license terms</li>
              <li>AI-generated questions are owned by rr7-supabase-starter</li>
              <li>Your answers and contributions remain your property</li>
            </ul>
          </p>
        </div>

        <div>
          <h2 className='text-xl font-semibold text-foreground mb-2'>
            5. Content and Wikipedia Articles
          </h2>
          <p>
            <ul className='list-disc pl-6 mt-2 space-y-1'>
              <li>
                All articles provided through our service are sourced directly
                from Wikipedia
              </li>
              <li>We do not create, edit, or modify the article content</li>
              <li>
                Wikipedia content is provided under Wikipedia's own license
                terms
              </li>
              <li>
                We are not responsible for the accuracy, completeness, or
                appropriateness of Wikipedia content
              </li>
              <li>
                Questions generated about articles are created using AI and are
                our responsibility
              </li>
            </ul>
          </p>
        </div>

        <div>
          <h2 className='text-xl font-semibold text-foreground mb-2'>
            6. User Content and Behavior
          </h2>
          <p>
            <ul className='list-disc pl-6 mt-2 space-y-1'>
              <li>You are responsible for your answers and contributions</li>
              <li>We may review and remove inappropriate content</li>
              <li>Do not share offensive or harmful content</li>
              <li>Respect other users' privacy and rights</li>
            </ul>
          </p>
        </div>

        <div>
          <h2 className='text-xl font-semibold text-foreground mb-2'>
            7. Service Modifications
          </h2>
          <p>
            We reserve the right to:
            <ul className='list-disc pl-6 mt-2 space-y-1'>
              <li>Modify or discontinue any part of the service</li>
              <li>Change features or functionality</li>
              <li>Update these terms with notice</li>
              <li>Adjust or remove content</li>
            </ul>
          </p>
        </div>

        <div>
          <h2 className='text-xl font-semibold text-foreground mb-2'>
            8. Limitation of Liability
          </h2>
          <p>
            <ul className='list-disc pl-6 mt-2 space-y-1'>
              <li>The service is provided "as is" without warranties</li>
              <li>We are not liable for any indirect damages</li>
              <li>Our maximum liability is limited to fees paid (if any)</li>
              <li>We do not guarantee accuracy of AI-generated content</li>
            </ul>
          </p>
        </div>

        <div>
          <h2 className='text-xl font-semibold text-foreground mb-2'>
            9. Termination
          </h2>
          <p>
            <ul className='list-disc pl-6 mt-2 space-y-1'>
              <li>You may terminate your account at any time</li>
              <li>We may suspend or terminate accounts for violations</li>
              <li>Termination may result in content deletion</li>
            </ul>
          </p>
        </div>

        <div>
          <h2 className='text-xl font-semibold text-foreground mb-2'>
            10. Privacy Policy
          </h2>
          <p>
            Our{' '}
            <Link to='/privacy-policy' className='text-primary'>
              Privacy Policy
            </Link>{' '}
            is part of these terms. Using rr7-supabase-starter means you also
            accept our privacy practices.
          </p>
        </div>

        <div>
          <h2 className='text-xl font-semibold text-foreground mb-2'>
            11. Contact
          </h2>
          <p>
            For questions about these terms, contact us at:
            <br />
            Email: rr7-supabase-starter.dev@gmail.com
          </p>
        </div>

        <p>
          By using rr7-supabase-starter, you agree to these terms. If you do not
          agree, please do not use the application.
        </p>
      </div>
    </div>
  );
}
