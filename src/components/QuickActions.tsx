import { Link } from 'react-router-dom';
import { Plus, Search, Bell, Star, MessageSquare, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const QuickActions = () => {
  const actions = [
    {
      icon: Plus,
      label: 'Submit Content',
      description: 'Share your achievements',
      href: '/submit',
      color: 'text-green-600 bg-green-50 hover:bg-green-100 dark:bg-green-950 dark:hover:bg-green-900'
    },
    {
      icon: Search,
      label: 'Search Archives',
      description: 'Find past newsletters',
      href: '/archive',
      color: 'text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950 dark:hover:bg-blue-900'
    },
    {
      icon: Bell,
      label: 'Latest News',
      description: 'Club announcements',
      href: '/',
      color: 'text-orange-600 bg-orange-50 hover:bg-orange-100 dark:bg-orange-950 dark:hover:bg-orange-900'
    },
    {
      icon: Star,
      label: 'Hall of Fame',
      description: 'Top contributors',
      href: '/students',
      color: 'text-purple-600 bg-purple-50 hover:bg-purple-100 dark:bg-purple-950 dark:hover:bg-purple-900'
    }
  ];

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action, index) => (
            <Button
              key={index}
              asChild
              variant="ghost"
              className={`h-auto p-4 flex flex-col items-center gap-2 ${action.color}`}
            >
              <Link to={action.href}>
                <action.icon className="h-6 w-6" />
                <div className="text-center">
                  <div className="font-medium text-xs">{action.label}</div>
                  <div className="text-xs opacity-75">{action.description}</div>
                </div>
              </Link>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;