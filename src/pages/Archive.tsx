import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import SearchBar from '@/components/SearchBar';
import { Archive as ArchiveIcon, Calendar, FileText, Download, Eye, Filter } from 'lucide-react';

interface NewsletterIssue {
  id: string;
  year: number;
  month: string;
  title: string;
  description: string;
  pdfUrl: string;
  publishedDate: string;
  departmentCount: number;
  featured?: boolean;
}

const Archive = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState<string>('all');

  // Mock data for newsletter archive
  const newsletterIssues: NewsletterIssue[] = [
    {
      id: '2024-12',
      year: 2024,
      month: 'December',
      title: 'Year-End Excellence Review',
      description: 'Annual achievements, project showcases, and winter semester highlights from all departments.',
      pdfUrl: '/newsletter.pdf',
      publishedDate: '2024-12-15',
      departmentCount: 16,
      featured: true
    },
    {
      id: '2024-11',
      year: 2024,
      month: 'November',
      title: 'Innovation & Research',
      description: 'Research projects, technical symposiums, and interdepartmental collaborations.',
      pdfUrl: '/archive/2024-11.pdf',
      publishedDate: '2024-11-15',
      departmentCount: 15
    },
    {
      id: '2024-10',
      year: 2024,
      month: 'October',
      title: 'Festive Celebrations',
      description: 'Cultural events, technical festivals, and departmental competitions.',
      pdfUrl: '/archive/2024-10.pdf',
      publishedDate: '2024-10-15',
      departmentCount: 16
    },
    {
      id: '2024-09',
      year: 2024,
      month: 'September',
      title: 'New Academic Session',
      description: 'Fresh beginnings, new admissions, and semester kick-off activities.',
      pdfUrl: '/archive/2024-09.pdf',
      publishedDate: '2024-09-15',
      departmentCount: 16
    }
  ];

  // Filter issues based on search and year
  const getFilteredIssues = () => {
    let filtered = newsletterIssues;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(issue => 
        issue.title.toLowerCase().includes(query) ||
        issue.description.toLowerCase().includes(query) ||
        issue.month.toLowerCase().includes(query)
      );
    }
    
    if (selectedYear !== 'all') {
      filtered = filtered.filter(issue => issue.year.toString() === selectedYear);
    }
    
    return filtered;
  };

  const filteredIssues = getFilteredIssues();
  const availableYears = [...new Set(newsletterIssues.map(issue => issue.year))].sort((a, b) => b - a);

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <section className="bg-secondary border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-primary text-primary-foreground rounded-full p-4">
                <ArchiveIcon className="h-8 w-8" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Newsletter Archive
            </h1>
            <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
              Browse through our complete collection of monthly newsletters. 
              Each issue captures the achievements, innovations, and spirit of our institution.
            </p>
            
            <div className="flex items-center justify-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-primary" />
                <span className="font-medium">{newsletterIssues.length} Issues Available</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-primary" />
                <span className="font-medium">Monthly Archives</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="lg:col-span-2">
                <SearchBar 
                  onSearch={setSearchQuery}
                  placeholder="Search by title, description, or month..."
                  value={searchQuery}
                />
              </div>
              <div>
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  >
                    <option value="all">All Years</option>
                    {availableYears.map((year) => (
                      <option key={year} value={year.toString()}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Year Filter Buttons */}
            <div className="flex flex-wrap gap-2 mb-8">
              <Button
                variant={selectedYear === 'all' ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedYear('all')}
              >
                All Years
              </Button>
              {availableYears.map((year) => (
                <Button
                  key={year}
                  variant={selectedYear === year.toString() ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedYear(year.toString())}
                >
                  {year}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Issues Grid */}
      <section className="pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <p className="text-muted-foreground">
              Showing {filteredIssues.length} of {newsletterIssues.length} issues
              {searchQuery && ` for "${searchQuery}"`}
              {selectedYear !== 'all' && ` from ${selectedYear}`}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredIssues.map((issue) => (
              <Card key={issue.id} className="academic-card hover:shadow-elegant transition-all duration-smooth group">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant="outline">
                          {issue.month} {issue.year}
                        </Badge>
                        {issue.featured && (
                          <Badge className="bg-primary text-primary-foreground">
                            Current
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        {issue.title}
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                    {issue.description}
                  </p>
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Published:</span>
                      <span className="font-medium text-foreground">
                        {new Date(issue.publishedDate).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Departments:</span>
                      <span className="font-medium text-foreground">{issue.departmentCount}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button 
                      asChild 
                      variant="outline" 
                      size="sm"
                      className="flex-1 group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                    >
                      <Link to={`/archive/${issue.id}`}>
                        <Eye className="h-3 w-3 mr-1" />
                        <span>Read</span>
                      </Link>
                    </Button>
                    <Button 
                      asChild 
                      variant="outline" 
                      size="sm"
                    >
                      <a href={issue.pdfUrl} download>
                        <Download className="h-3 w-3" />
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredIssues.length === 0 && (
            <div className="text-center py-16">
              <ArchiveIcon className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No issues found</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                No newsletter issues match your current search criteria. Try adjusting your search terms or selecting a different year.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4">
                <Button 
                  variant="outline" 
                  onClick={() => setSearchQuery('')}
                >
                  Clear Search
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedYear('all')}
                >
                  Show All Years
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Archive;