import type { RichContentElement } from '../../backend';

interface RichContentRendererProps {
  content: RichContentElement[];
}

export default function RichContentRenderer({ content }: RichContentRendererProps) {
  return (
    <div className="space-y-4">
      {content.map((element, index) => {
        if (element.__kind__ === 'text') {
          const htmlContent = element.text.content;
          
          // Check if content contains HTML tags (formatted) or is plain text
          const isFormatted = /<[^>]+>/.test(htmlContent);
          
          if (isFormatted) {
            // Render formatted HTML content
            return (
              <div 
                key={index}
                className="prose prose-sm max-w-none dark:prose-invert leading-relaxed"
                dangerouslySetInnerHTML={{ __html: htmlContent }}
              />
            );
          } else {
            // Render plain text (legacy posts)
            return (
              <div 
                key={index}
                className="text-foreground leading-relaxed whitespace-pre-wrap"
              >
                {htmlContent}
              </div>
            );
          }
        }
        
        if (element.__kind__ === 'image') {
          const imageUrl = element.image.blob.getDirectURL();
          return (
            <figure key={index} className="my-6">
              <img
                src={imageUrl}
                alt={element.image.description || 'Blog image'}
                className="w-full rounded-lg shadow-md object-cover max-h-[600px]"
                loading="lazy"
              />
              {element.image.description && (
                <figcaption className="text-sm text-muted-foreground text-center mt-2">
                  {element.image.description}
                </figcaption>
              )}
            </figure>
          );
        }

        if (element.__kind__ === 'video') {
          const videoUrl = element.video.blob.getDirectURL();
          return (
            <figure key={index} className="my-6">
              <video
                src={videoUrl}
                controls
                className="w-full rounded-lg shadow-md max-h-[600px]"
              >
                Your browser does not support the video tag.
              </video>
              {element.video.description && (
                <figcaption className="text-sm text-muted-foreground text-center mt-2">
                  {element.video.description}
                </figcaption>
              )}
            </figure>
          );
        }

        return null;
      })}
    </div>
  );
}
