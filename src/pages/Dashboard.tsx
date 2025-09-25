import { useAuth } from '@/hooks/useAuth';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Dashboard = () => {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Welcome to Your Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Manage your appointments and services
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Info</CardTitle>
                <CardDescription>Your account details</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Email: {user?.email}</p>
                <p className="text-sm text-muted-foreground">
                  Joined: {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Appointments</CardTitle>
                <CardDescription>Book and manage appointments</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Schedule your notary services
                </p>
                <Button variant="outline" className="w-full">
                  Book Appointment
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Documents</CardTitle>
                <CardDescription>Manage your documents</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Upload and track documents
                </p>
                <Button variant="outline" className="w-full">
                  View Documents
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Button onClick={signOut} variant="outline">
              Sign Out
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;