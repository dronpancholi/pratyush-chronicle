import { useState, useEffect } from 'react';
import { Bookmark, BookmarkCheck, Trash2, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

interface BookmarkItem {
  id: string;
  title: string;
  url: string;
  type: 'newsletter' | 'submission' | 'external';
  addedAt: string;
}

const BookmarkManager = () => {
  const { user } = useAuth();
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);

  useEffect(() => {
    if (user) {
      loadBookmarks();
    }
  }, [user]);

  const loadBookmarks = () => {
    const saved = localStorage.getItem(`bookmarks_${user?.id}`);
    if (saved) {
      setBookmarks(JSON.parse(saved));
    }
  };

  const saveBookmarks = (newBookmarks: BookmarkItem[]) => {
    localStorage.setItem(`bookmarks_${user?.id}`, JSON.stringify(newBookmarks));
    setBookmarks(newBookmarks);
  };

  const addBookmark = (item: Omit<BookmarkItem, 'id' | 'addedAt'>) => {
    const newBookmark: BookmarkItem = {
      ...item,
      id: Date.now().toString(),
      addedAt: new Date().toISOString()
    };
    
    const newBookmarks = [...bookmarks, newBookmark];
    saveBookmarks(newBookmarks);
    
    toast({
      title: "Bookmark added",
      description: "Item saved to your bookmarks",
    });
  };

  const removeBookmark = (id: string) => {
    const newBookmarks = bookmarks.filter(b => b.id !== id);
    saveBookmarks(newBookmarks);
    
    toast({
      title: "Bookmark removed",
      description: "Item removed from bookmarks",
    });
  };

  const isBookmarked = (url: string) => {
    return bookmarks.some(b => b.url === url);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'newsletter': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'submission': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'external': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bookmark className="h-5 w-5" />
          Bookmarks
        </CardTitle>
      </CardHeader>
      <CardContent>
        {bookmarks.length === 0 ? (
          <div className="text-center py-8">
            <Bookmark className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">No bookmarks yet</p>
            <p className="text-sm text-muted-foreground">
              Use the bookmark button on newsletters and submissions to save them here
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {bookmarks.map((bookmark) => (
              <div key={bookmark.id} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium truncate">{bookmark.title}</h4>
                    <Badge className={getTypeColor(bookmark.type)}>
                      {bookmark.type}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Added {new Date(bookmark.addedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(bookmark.url, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeBookmark(bookmark.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export { BookmarkManager, type BookmarkItem };
export default BookmarkManager;