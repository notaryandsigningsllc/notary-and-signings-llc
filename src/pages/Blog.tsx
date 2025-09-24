import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, User, ArrowRight, Clock } from "lucide-react";

const Blog = () => {
  const blogPosts = [
    {
      title: "Understanding Remote Online Notarization (RON)",
      excerpt: "Learn about the benefits and process of remote online notarization and how it can save you time and money.",
      date: "2024-01-15",
      author: "Arlenny Abreu",
      category: "Notary Services",
      readTime: "5 min read"
    },
    {
      title: "Essential Documents for Your Loan Signing",
      excerpt: "A comprehensive guide to the documents you'll need for a smooth loan signing experience.",
      date: "2024-01-10",
      author: "Arlenny Abreu",
      category: "Loan Signing",
      readTime: "7 min read"
    },
    {
      title: "Tax Preparation Tips for Small Businesses",
      excerpt: "Key strategies and important deadlines for small business tax preparation in New Jersey.",
      date: "2024-01-05",
      author: "Arlenny Abreu",
      category: "Tax Services",
      readTime: "6 min read"
    },
    {
      title: "Mobile Notary vs. Traditional Notary: Which is Right for You?",
      excerpt: "Compare the benefits of mobile notary services versus traditional in-office notarization.",
      date: "2023-12-28",
      author: "Arlenny Abreu",
      category: "Notary Services",
      readTime: "4 min read"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-gradient-subtle pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6">
            <Badge variant="outline" className="bg-accent-muted text-accent-foreground border-accent">
              <User className="w-4 h-4 mr-2" />
              Blog & Resources
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              Notary & Tax <span className="bg-gradient-primary bg-clip-text text-transparent">Insights</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Stay informed with the latest tips, guides, and insights on notary services, 
              loan signing, and tax preparation from our certified professionals.
            </p>
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <Card key={index} className="transition-all duration-300 hover:shadow-elegant hover:-translate-y-1">
                <CardHeader className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{post.category}</Badge>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="w-4 h-4 mr-1" />
                      {post.readTime}
                    </div>
                  </div>
                  <CardTitle className="text-xl hover:text-primary transition-colors">
                    {post.title}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {post.excerpt}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(post.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full group">
                    Read More
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Coming Soon Message */}
          <div className="mt-16 text-center space-y-4">
            <h3 className="text-2xl font-semibold text-foreground">More Content Coming Soon</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We're working on bringing you more valuable insights and resources. 
              In the meantime, feel free to contact us with any questions about our services.
            </p>
            <Button variant="hero" size="lg" asChild>
              <a href="https://www.notaryandsignings.com/book-online" target="_blank" rel="noopener noreferrer">
                Schedule a Consultation
              </a>
            </Button>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Blog;