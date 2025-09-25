import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

const CookiePolicy = () => {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-foreground">{t('legal.cookie_policy') || 'Cookie Policy'}</h1>
            <p className="text-muted-foreground">{t('legal.last_updated') || 'Last updated'}: {new Date().toLocaleDateString()}</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>What Are Cookies</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Cookies are small text files that are stored on your computer or mobile device when you visit our website. 
                They help us provide you with a better experience by remembering your preferences and enabling certain 
                website functionality.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>How We Use Cookies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Notary and Signings LLC uses cookies for the following purposes:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Essential Cookies:</strong> Required for basic website functionality and security</li>
                <li><strong>Preference Cookies:</strong> Remember your language selection and other preferences</li>
                <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our website to improve our services</li>
                <li><strong>Security Cookies:</strong> Protect against fraudulent activity and enhance website security</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Types of Cookies We Use</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold mb-2">Essential Cookies</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  These cookies are necessary for the website to function properly and cannot be disabled.
                </p>
                <ul className="list-disc pl-6 space-y-1 text-sm">
                  <li>Session management for appointment booking</li>
                  <li>Authentication for client portal access</li>
                  <li>Security tokens for form submissions</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Preference Cookies</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  These cookies remember your choices and preferences to provide a personalized experience.
                </p>
                <ul className="list-disc pl-6 space-y-1 text-sm">
                  <li>Language preference (English/Spanish)</li>
                  <li>Contact form information</li>
                  <li>Accessibility settings</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Analytics Cookies</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  These cookies help us understand how visitors interact with our website.
                </p>
                <ul className="list-disc pl-6 space-y-1 text-sm">
                  <li>Page views and popular content</li>
                  <li>User journey and navigation patterns</li>
                  <li>Service request patterns for business optimization</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Marketing Cookies</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  We do not currently use marketing or advertising cookies. Any future use will be clearly disclosed.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Third-Party Cookies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>We may use third-party services that set their own cookies:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Google Analytics:</strong> Website performance and user behavior analysis</li>
                <li><strong>Payment Processors:</strong> Secure payment processing for our services</li>
                <li><strong>RON Platforms:</strong> Remote online notarization video conferencing</li>
                <li><strong>Appointment Scheduling:</strong> Online booking system functionality</li>
              </ul>
              <p>
                These third parties have their own cookie policies, and we encourage you to review them.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cookie Duration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Cookies are set for different durations based on their purpose:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Session Cookies:</strong> Deleted when you close your browser</li>
                <li><strong>Persistent Cookies:</strong> Remain for a set period (typically 30 days to 2 years)</li>
                <li><strong>Preference Cookies:</strong> Stored until you change your preferences or clear your browser data</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Managing Your Cookie Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>You have several options for managing cookies:</p>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Browser Settings</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Most browsers allow you to control cookies through their settings:
                  </p>
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li>Block all cookies</li>
                    <li>Block third-party cookies only</li>
                    <li>Delete existing cookies</li>
                    <li>Receive notifications when cookies are set</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Browser-Specific Instructions</h4>
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li><strong>Chrome:</strong> Settings → Privacy and security → Cookies and other site data</li>
                    <li><strong>Firefox:</strong> Options → Privacy & Security → Cookies and Site Data</li>
                    <li><strong>Safari:</strong> Preferences → Privacy → Cookies and website data</li>
                    <li><strong>Edge:</strong> Settings → Cookies and site permissions → Cookies and stored data</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Impact of Disabling Cookies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                While you can disable cookies, please note that this may affect your experience on our website:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>You may need to re-enter information on each visit</li>
                <li>Some features may not work properly</li>
                <li>Appointment booking functionality may be limited</li>
                <li>Language preferences will not be saved</li>
                <li>Security features may be reduced</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Protection and Privacy</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Cookie data is handled in accordance with our Privacy Policy and applicable New Jersey and federal 
                data protection laws. We do not sell or share cookie information with third parties except as 
                necessary for website functionality or as required by law.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Updates to This Cookie Policy</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                We may update this Cookie Policy from time to time to reflect changes in our practices or applicable 
                regulations. We will notify you of any significant changes by posting the updated policy on our website 
                and updating the "Last updated" date.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>
                If you have questions about our use of cookies or this Cookie Policy, please contact us:
              </p>
              <div className="space-y-1">
                <p><strong>Notary and Signings LLC</strong></p>
                <p>180 Talmadge Road, Unit 1380<br />Edison, NJ 08817</p>
                <p>Phone: (908) 514-8180</p>
                <p>Email: info@notaryandsignings.com</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CookiePolicy;