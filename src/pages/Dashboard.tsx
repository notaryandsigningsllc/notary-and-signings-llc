import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold">{t('dashboard.welcome')}</h1>
            <p className="text-muted-foreground mt-2">
              {t('dashboard.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('dashboard.account_info')}</CardTitle>
                <CardDescription>{t('dashboard.account_description')}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{t('dashboard.email')}: {user?.email}</p>
                <p className="text-sm text-muted-foreground">
                  {t('dashboard.joined')}: {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('dashboard.appointments')}</CardTitle>
                <CardDescription>{t('dashboard.appointments_description')}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {t('dashboard.appointments_text')}
                </p>
                <Button variant="outline" className="w-full">
                  {t('dashboard.book_appointment')}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('dashboard.documents')}</CardTitle>
                <CardDescription>{t('dashboard.documents_description')}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {t('dashboard.documents_text')}
                </p>
                <Button variant="outline" className="w-full">
                  {t('dashboard.view_documents')}
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Button onClick={signOut} variant="outline">
              {t('auth.sign_out')}
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;