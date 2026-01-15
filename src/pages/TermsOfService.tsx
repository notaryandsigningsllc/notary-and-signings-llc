import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

const TermsOfService = () => {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-foreground">{t('legal.terms_of_service') || 'Terms of Service'}</h1>
            <p className="text-muted-foreground">{t('legal.last_updated') || 'Last updated'}: {new Date().toLocaleDateString()}</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Agreement to Terms</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                By engaging Notary and Signings LLC for notarial services, you agree to be bound by these Terms of Service 
                and all applicable New Jersey state laws and regulations governing notarial acts. These terms constitute 
                a legally binding agreement between you and Notary and Signings LLC.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Services Provided</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Notary and Signings LLC provides the following services in compliance with New Jersey law:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Traditional notarial acts (acknowledgments, jurats, verifications, etc.)</li>
                <li>General notary services within our service area</li>
                <li>Remote Online Notarization (RON) as authorized by New Jersey law</li>
                <li>Loan signing services for real estate transactions</li>
                <li>Document authentication and apostille assistance</li>
                <li>Tax preparation services</li>
                <li>Fingerprinting services</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Client Responsibilities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>As a client, you agree to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide valid, government-issued photo identification</li>
                <li>Appear in person (or via approved video technology for RON)</li>
                <li>Understand the contents of documents being notarized</li>
                <li>Sign documents willingly and without coercion</li>
                <li>Provide accurate information about your identity and the documents</li>
                <li>Pay all fees at the time of service</li>
                <li>Not request any illegal or improper notarial acts</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Identification Requirements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                In accordance with New Jersey notary law, acceptable forms of identification include:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Valid driver's license</li>
                <li>Current passport</li>
                <li>State-issued identification card</li>
                <li>Military identification</li>
                <li>Other government-issued photo identification deemed acceptable under NJ law</li>
              </ul>
              <p>
                Identification must be current, unexpired, and contain a photograph and signature. 
                We reserve the right to refuse service if adequate identification cannot be provided.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Fees and Payment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Our fees are established in accordance with New Jersey law and include:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Notarial acts: As permitted by New Jersey statute</li>
                <li>Mobile services: $75 per hour including travel time</li>
                <li>Remote Online Notarization: $35 per document</li>
                <li>Additional services: As quoted</li>
              </ul>
              <p>
                Payment is due at the time of service. We accept cash, check, major credit cards, Venmo, and Zelle. 
                A returned check fee of $35 will be charged for insufficient funds.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Scheduling and Cancellations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Appointment scheduling policies:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>All services are provided by appointment only</li>
                <li>Same-day appointments available with 2-4 hours notice (subject to availability)</li>
                <li>Cancellations must be made at least 2 hours in advance</li>
                <li>Late cancellations or no-shows may be subject to a cancellation fee</li>
                <li>We reserve the right to reschedule due to emergencies or unforeseen circumstances</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Refusal of Service</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>We reserve the right to refuse notarial services if:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Proper identification cannot be provided</li>
                <li>The document is incomplete or contains blank spaces</li>
                <li>The signer appears to be under duress or coercion</li>
                <li>The signer cannot communicate directly with the notary</li>
                <li>The notarial act would be illegal or improper</li>
                <li>The signer appears to lack mental capacity</li>
                <li>The document appears to be fraudulent</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Liability and Insurance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Notary and Signings LLC maintains professional liability insurance in the amount of $50,000 
                as required by New Jersey law. Our liability is limited to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Errors in the performance of notarial acts</li>
                <li>Damages directly resulting from our negligent actions</li>
                <li>The maximum coverage amount of our insurance policy</li>
              </ul>
              <p>
                We are not responsible for the content, legality, or effect of documents notarized. 
                Clients should consult with appropriate legal counsel regarding document contents and legal implications.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Privacy and Confidentiality</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                We maintain strict confidentiality regarding all client information and document contents, 
                except as required by law or court order. Our complete Privacy Policy governs the collection, 
                use, and protection of your personal information.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Dispute Resolution</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Any disputes arising from our services shall be resolved through:
              </p>
              <ol className="list-decimal pl-6 space-y-2">
                <li>Good faith negotiation between the parties</li>
                <li>Mediation if direct negotiation fails</li>
                <li>Binding arbitration under New Jersey law if mediation is unsuccessful</li>
              </ol>
              <p>
                These terms shall be governed by New Jersey law. Any legal proceedings shall be conducted 
                in the appropriate courts of New Jersey.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Modifications</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                We reserve the right to modify these Terms of Service at any time. Changes will be posted 
                on our website and will become effective immediately upon posting. Continued use of our 
                services after changes constitutes acceptance of the modified terms.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p><strong>Notary and Signings LLC</strong></p>
              <p>180 Talmadge Road, Unit 1380<br />Edison, NJ 08817</p>
              <p>Phone: (908) 514-8180</p>
              <p>Email: info@notaryandsignings.com</p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsOfService;