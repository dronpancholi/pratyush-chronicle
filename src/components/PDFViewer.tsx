import { useState } from 'react';
import { Download, ExternalLink, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface PDFViewerProps {
  src: string;
  title?: string;
  className?: string;
}

const PDFViewer = ({ src, title = "Newsletter PDF", className = "" }: PDFViewerProps) => {
  const [loadError, setLoadError] = useState(false);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = src;
    link.download = 'newsletter.pdf';
    link.click();
  };

  const handleOpenInNewTab = () => {
    window.open(src, '_blank');
  };

  return (
    <div className={`pdf-viewer ${className}`}>
      {/* PDF Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border-b border-border bg-secondary/50">
        <div>
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground">Current Issue - Monthly Newsletter</p>
        </div>
        <div className="flex items-center space-x-2 mt-3 sm:mt-0">
          <Button
            variant="outline"
            size="sm"
            onClick={handleOpenInNewTab}
            className="flex items-center space-x-2"
          >
            <ExternalLink className="h-4 w-4" />
            <span>Open in New Tab</span>
          </Button>
          <Button
            onClick={handleDownload}
            size="sm"
            className="flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Download</span>
          </Button>
        </div>
      </div>

      {/* PDF Viewer Note */}
      <Alert className="m-4 mb-0">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          If the PDF doesn't display properly, please use the "Open in New Tab" or "Download" buttons above.
          Some browsers may block inline PDF viewing for security reasons.
        </AlertDescription>
      </Alert>

      {/* PDF Embed */}
      <div className="relative w-full" style={{ minHeight: '600px' }}>
        {!loadError ? (
          <iframe
            src={src}
            className="w-full h-full border-0"
            style={{ minHeight: '600px' }}
            title={title}
            onError={() => setLoadError(true)}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <h4 className="text-lg font-semibold text-foreground mb-2">Unable to display PDF</h4>
            <p className="text-muted-foreground mb-6">
              Your browser cannot display this PDF inline. Please use the buttons above to view or download the file.
            </p>
            <div className="flex items-center space-x-3">
              <Button onClick={handleOpenInNewTab} variant="outline">
                <ExternalLink className="h-4 w-4 mr-2" />
                Open in New Tab
              </Button>
              <Button onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PDFViewer;