import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

const PrivacyPolicy = () => {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-foreground">{t('legal.privacy_policy') || 'Privacy Policy'}</h1>
            <p className="text-muted-foreground">{t('legal.last_updated') || 'Last updated'}: {new Date().toLocaleDateString()}</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Information We Collect</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                At Notary and Signings LLC, we collect information necessary to provide professional notary services in compliance with New Jersey state law:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Personal Identification:</strong> Name, address, phone number, email address, and government-issued photo ID information</li>
                <li><strong>Document Information:</strong> Types of documents being notarized (we do not retain copies unless required by law)</li>
                <li><strong>Transaction Records:</strong> Date, time, location, and type of notarial acts performed as required by NJ notary law</li>
                <li><strong>Payment Information:</strong> Billing address and payment method (credit card information is processed securely and not stored)</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>How We Use Your Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>We use your information solely for:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Performing notarial acts in accordance with New Jersey law</li>
                <li>Maintaining required notary records and journals</li>
                <li>Scheduling appointments and providing mobile services</li>
                <li>Processing payments for services</li>
                <li>Communicating about your notary appointment</li>
                <li>Complying with legal obligations and regulations</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Information Sharing and Disclosure</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                We maintain strict confidentiality and do not sell, rent, or share your personal information except:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>When required by law or court order</li>
                <li>To comply with New Jersey notary record-keeping requirements</li>
                <li>With your express written consent</li>
                <li>To prevent fraud or protect the safety of individuals</li>
                <li>With service providers who assist in our operations (under strict confidentiality agreements)</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Record Retention</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                In compliance with New Jersey notary law (N.J.S.A. 52:7-10 et seq.), we maintain:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Notary journals for a minimum of 7 years</li>
                <li>Records of notarial acts as required by state law</li>
                <li>Business records for tax and regulatory purposes</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                We implement appropriate security measures to protect your personal information:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Secure storage of physical records in locked, fireproof filing systems</li>
                <li>Encrypted digital communications and data storage</li>
                <li>Limited access to personal information on a need-to-know basis</li>
                <li>Regular security assessments and updates</li>
                <li>Secure disposal of records when retention period expires</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Rights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Request access to your personal information in our records</li>
                <li>Request correction of inaccurate information</li>
                <li>Request copies of notarial certificates and records (subject to applicable fees)</li>
                <li>File complaints with the New Jersey Department of Treasury if you believe we have violated notary laws</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Remote Online Notarization (RON)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                For Remote Online Notarization services, additional privacy considerations apply:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Video and audio recordings are made and stored as required by New Jersey RON regulations</li>
                <li>Identity verification is performed using approved third-party services</li>
                <li>All RON sessions are conducted through secure, encrypted platforms</li>
                <li>RON records are maintained for the period required by state law</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                If you have questions about this Privacy Policy or wish to exercise your rights, please contact us:
              </p>
              <div className="space-y-2">
                <p><strong>Notary and Signings LLC</strong></p>
                <p>180 Talmadge Road, Unit 1380<br />Edison, NJ 08817</p>
                <p>Phone: (908) 514-8180</p>
                <p>Email: info@notaryandsignings.com</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Changes to This Policy</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                We may update this Privacy Policy to reflect changes in our practices or applicable law. 
                We will notify you of any material changes by posting the updated policy on our website 
                and updating the "Last updated" date. Your continued use of our services after such 
                changes constitutes acceptance of the updated policy.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;