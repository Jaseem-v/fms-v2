'use client';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - FixMyStore',
  description: 'Privacy Policy for FixMyStore CRO services',
  robots: {
    index: false,
    follow: false,
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-green-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className=" rounded-2xl shadow-lg overflow-hidden">
          <div className=" text-black p-8 text-center">
            <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
            <p className="text-lg opacity-90">Your privacy is important to us</p>
          </div>

          <div className="p-8">
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 mb-8">
                This policy explains how we collect, use, and protect your information when you use our CRO services.
              </p>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-green-500">
                  Information We Collect
                </h2>
                
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Personal Information</h3>
                <p className="text-gray-700 mb-4">
                  When you use our CRO audit services, we may collect the following personal information:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700">
                  <li><strong>Contact Information:</strong> Name, email address, phone number</li>
                  <li><strong>Business Information:</strong> Company name, website URL, business address</li>
                  <li><strong>Service Data:</strong> Information about your Shopify store and conversion optimization needs</li>
                  <li><strong>Communication Records:</strong> Emails, support tickets, and other communications</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">Automatically Collected Information</h3>
                <p className="text-gray-700 mb-4">
                  We automatically collect certain information when you visit our website:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700">
                  <li><strong>Technical Data:</strong> IP address, browser type, operating system, device information</li>
                  <li><strong>Usage Data:</strong> Pages visited, time spent on pages, click patterns</li>
                  <li><strong>Analytics Data:</strong> Website performance metrics and user behavior</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-green-500">
                  How We Use Your Information
                </h2>
                <p className="text-gray-700 mb-4">
                  We use the collected information for the following purposes:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700">
                  <li><strong>Service Delivery:</strong> To provide CRO audit services and deliver reports</li>
                  <li><strong>Communication:</strong> To respond to inquiries and provide customer support</li>
                  <li><strong>Improvement:</strong> To enhance our services and website functionality</li>
                  <li><strong>Marketing:</strong> To send relevant updates and promotional materials (with consent)</li>
                  <li><strong>Legal Compliance:</strong> To comply with applicable laws and regulations</li>
                </ul>
                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                  <p className="text-green-800 font-medium">
                    <strong>Note:</strong> We will never sell your personal information to third parties. Your data is used solely to provide and improve our services.
                  </p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-green-500">
                  Information Sharing
                </h2>
                <p className="text-gray-700 mb-4">
                  We may share your information in the following circumstances:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700">
                  <li><strong>Service Providers:</strong> With trusted third-party service providers who assist in delivering our services</li>
                  <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
                  <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                  <li><strong>Consent:</strong> With your explicit consent for specific purposes</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-green-500">
                  Data Security
                </h2>
                <p className="text-gray-700 mb-4">
                  We implement appropriate technical and organizational measures to protect your personal information:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700">
                  <li>Encryption of data in transit and at rest</li>
                  <li>Regular security assessments and updates</li>
                  <li>Access controls and authentication measures</li>
                  <li>Employee training on data protection</li>
                  <li>Incident response procedures</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-green-500">
                  Cookies and Tracking
                </h2>
                <p className="text-gray-700 mb-4">
                  Our website uses cookies and similar tracking technologies to enhance your experience:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700">
                  <li><strong>Essential Cookies:</strong> Required for basic website functionality</li>
                  <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our site</li>
                  <li><strong>Marketing Cookies:</strong> Used for targeted advertising (with consent)</li>
                </ul>
                <p className="text-gray-700">
                  You can control cookie settings through your browser preferences. However, disabling certain cookies may affect website functionality.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-green-500">
                  Third-Party Services
                </h2>
                <p className="text-gray-700 mb-4">
                  We may use third-party services that collect information:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700">
                  <li><strong>Google Analytics:</strong> Website analytics and performance tracking</li>
                  <li><strong>Email Services:</strong> For communication and marketing emails</li>
                  <li><strong>Payment Processors:</strong> For processing payments (if applicable)</li>
                  <li><strong>Hosting Services:</strong> For website hosting and data storage</li>
                </ul>
                <p className="text-gray-700">
                  These services have their own privacy policies, and we encourage you to review them.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-green-500">
                  Your Rights
                </h2>
                <p className="text-gray-700 mb-4">
                  You have the following rights regarding your personal information:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700">
                  <li><strong>Access:</strong> Request a copy of your personal data</li>
                  <li><strong>Correction:</strong> Request correction of inaccurate information</li>
                  <li><strong>Deletion:</strong> Request deletion of your personal data</li>
                  <li><strong>Portability:</strong> Request transfer of your data to another service</li>
                  <li><strong>Objection:</strong> Object to processing of your data</li>
                  <li><strong>Withdrawal:</strong> Withdraw consent for marketing communications</li>
                </ul>
                <p className="text-gray-700">
                  To exercise these rights, please contact us using the information provided below.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-green-500">
                  Children's Privacy
                </h2>
                <p className="text-gray-700">
                  Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you believe we have collected information from a child under 13, please contact us immediately.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-green-500">
                  Changes to This Policy
                </h2>
                <p className="text-gray-700 mb-4">
                  We may update this Privacy Policy from time to time. We will notify you of any material changes by:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700">
                  <li>Posting the updated policy on our website</li>
                  <li>Sending email notifications to registered users</li>
                  <li>Updating the "Last Updated" date</li>
                </ul>
                <p className="text-gray-700">
                  We encourage you to review this policy periodically to stay informed about how we protect your information.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-green-500">
                  Contact Us
                </h2>
                <p className="text-gray-700 mb-4">
                  If you have any questions about this Privacy Policy or our data practices, please contact us:
                </p>
                <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-green-500">
                  <p className="font-semibold text-gray-900 mb-2">FixMyStore</p>
                  <p className="text-gray-700 mb-1">Workbook, HiLITE Business Park</p>
                  <p className="text-gray-700 mb-1">Kozhikode, Kerala, India</p>
                  <p className="text-gray-700 mb-1">Email: hello@fixmystore.com</p>
                  <p className="text-gray-700">Phone: +91 73560 62995</p>
                </div>
              </section>

              <div className="text-center text-gray-600 text-sm">
                <p><strong>Last Updated:</strong> January 2025</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 