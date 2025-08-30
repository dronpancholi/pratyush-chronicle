import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { departments } from '@/data/departments';
import { Link } from 'react-router-dom';

const DepartmentsHorizontal = () => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'engineering':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'technology':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'administrative':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  return (
    <div className="py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">All Departments</h2>
          <p className="text-muted-foreground mb-6">
            {departments.length} departments working together for academic excellence
          </p>
        </div>
        
        {/* Horizontal scrollable departments */}
        <div className="relative">
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-secondary scrollbar-track-transparent">
            {departments.map((department) => (
              <Link 
                key={department.id}
                to={`/departments/${department.slug}`}
                className="flex-none w-64 group"
              >
                <Card className="h-full hover:shadow-elegant transition-all duration-smooth border-border/50 hover:border-primary/20">
                  <CardContent className="p-4 h-full flex flex-col">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors text-sm leading-tight mb-2">
                          {department.name}
                        </h3>
                        <div className="flex flex-wrap gap-1">
                          <Badge variant="outline" className="text-xs">
                            {department.shortName}
                          </Badge>
                          <Badge className={`text-xs ${getCategoryColor(department.category)}`}>
                            {department.category}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-muted-foreground text-xs leading-relaxed flex-1">
                      {department.description}
                    </p>
                    
                    <div className="mt-3 pt-3 border-t border-border">
                      <span className="text-xs text-primary group-hover:text-primary-hover transition-colors">
                        View Content →
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          
          {/* Scroll indicator */}
          <div className="text-center mt-4">
            <p className="text-xs text-muted-foreground">
              ← Scroll horizontally to see all departments →
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentsHorizontal;