import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import SearchBar from '@/components/SearchBar';
import { departments, getDepartmentsByCategory, searchDepartments } from '@/data/departments';
import { Users, BookOpen, ExternalLink, Filter } from 'lucide-react';

const Departments = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Filter departments based on search and category
  const getFilteredDepartments = () => {
    let filtered = searchDepartments(searchQuery);
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(dept => dept.category === selectedCategory);
    }
    
    return filtered;
  };

  const filteredDepartments = getFilteredDepartments();
  
  const categories = [
    { id: 'all', name: 'All Departments', count: departments.length },
    { id: 'engineering', name: 'Engineering', count: getDepartmentsByCategory('engineering').length },
    { id: 'technology', name: 'Technology', count: getDepartmentsByCategory('technology').length },
    { id: 'science', name: 'Science', count: getDepartmentsByCategory('science').length },
    { id: 'administrative', name: 'Administrative', count: getDepartmentsByCategory('administrative').length },
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'engineering':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'technology':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'science':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'administrative':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <section className="bg-secondary border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-primary text-primary-foreground rounded-full p-4">
                <Users className="h-8 w-8" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Departments
            </h1>
            <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
              Explore all 16 departments of Government Polytechnic Ahmedabad. 
              Each department contributes unique content to our monthly newsletter.
            </p>
            
            <div className="flex items-center justify-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-primary" />
                <span className="font-medium">{departments.length} Total Departments</span>
              </div>
              <div className="flex items-center space-x-2">
                <BookOpen className="h-4 w-4 text-primary" />
                <span className="font-medium">Monthly Features</span>
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
                  placeholder="Search departments by name, code, or description..."
                  value={searchQuery}
                />
              </div>
              <div>
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  >
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name} ({category.count})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Category Filter Buttons */}
            <div className="flex flex-wrap gap-2 mb-8">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="flex items-center space-x-1"
                >
                  <span>{category.name}</span>
                  <Badge variant="secondary" className="ml-1">
                    {category.count}
                  </Badge>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Departments Grid */}
      <section className="pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <p className="text-muted-foreground">
              Showing {filteredDepartments.length} of {departments.length} departments
              {searchQuery && ` for "${searchQuery}"`}
              {selectedCategory !== 'all' && ` in ${categories.find(c => c.id === selectedCategory)?.name}`}
            </p>
          </div>

          <div className="department-grid">
            {filteredDepartments.map((department) => (
              <Card key={department.id} className="academic-card hover:shadow-elegant transition-all duration-smooth group">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        {department.name}
                      </CardTitle>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge variant="outline">
                          {department.shortName}
                        </Badge>
                        <Badge className={getCategoryColor(department.category)}>
                          {department.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                    {department.description}
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Department Code:</span>
                      <span className="font-medium text-foreground">{department.shortName}</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Category:</span>
                      <span className="font-medium text-foreground capitalize">{department.category}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
                    <span className="text-sm text-muted-foreground">
                      Latest content available
                    </span>
                    <Button 
                      asChild 
                      variant="outline" 
                      size="sm"
                      className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                    >
                      <Link to={`/departments/${department.slug}`}>
                        <span>View Content</span>
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredDepartments.length === 0 && (
            <div className="text-center py-16">
              <Users className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No departments found</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                No departments match your current search criteria. Try adjusting your search terms or selecting a different category.
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
                  onClick={() => setSelectedCategory('all')}
                >
                  Show All Categories
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Departments;