import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Link as LinkIcon,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  LucideIcon
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

interface ToolbarButton {
  icon: LucideIcon;
  label: string;
  action: () => void;
  separator?: never;
}

interface ToolbarSeparator {
  separator: true;
  icon?: never;
  label?: never;
  action?: never;
}

type ToolbarItem = ToolbarButton | ToolbarSeparator;

export default function RichTextEditor({ value, onChange, placeholder, disabled }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleInput();
  };

  const insertHeading = (level: number) => {
    const selection = window.getSelection();
    if (!selection || !editorRef.current) return;

    const range = selection.getRangeAt(0);
    const selectedText = range.toString() || 'Heading';
    
    const heading = document.createElement(`h${level}`);
    heading.textContent = selectedText;
    heading.className = level === 1 ? 'text-3xl font-bold my-4' : 
                        level === 2 ? 'text-2xl font-bold my-3' : 
                        'text-xl font-semibold my-2';
    
    range.deleteContents();
    range.insertNode(heading);
    
    // Move cursor after heading
    const newRange = document.createRange();
    newRange.setStartAfter(heading);
    newRange.collapse(true);
    selection.removeAllRanges();
    selection.addRange(newRange);
    
    handleInput();
  };

  const insertLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      execCommand('createLink', url);
    }
  };

  const toolbarButtons: ToolbarItem[] = [
    { icon: Heading1, label: 'Heading 1', action: () => insertHeading(1) },
    { icon: Heading2, label: 'Heading 2', action: () => insertHeading(2) },
    { icon: Heading3, label: 'Heading 3', action: () => insertHeading(3) },
    { separator: true },
    { icon: Bold, label: 'Bold', action: () => execCommand('bold') },
    { icon: Italic, label: 'Italic', action: () => execCommand('italic') },
    { icon: Underline, label: 'Underline', action: () => execCommand('underline') },
    { separator: true },
    { icon: List, label: 'Bullet List', action: () => execCommand('insertUnorderedList') },
    { icon: ListOrdered, label: 'Numbered List', action: () => execCommand('insertOrderedList') },
    { separator: true },
    { icon: LinkIcon, label: 'Insert Link', action: insertLink },
    { icon: Quote, label: 'Quote', action: () => execCommand('formatBlock', 'blockquote') },
  ];

  return (
    <div className={`border rounded-lg overflow-hidden ${isFocused ? 'ring-2 ring-primary' : ''}`}>
      {/* Toolbar */}
      <div className="bg-muted/50 border-b p-2 flex flex-wrap gap-1">
        {toolbarButtons.map((item, index) => 
          item.separator ? (
            <Separator key={index} orientation="vertical" className="h-8 mx-1" />
          ) : (
            <Button
              key={index}
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={item.action}
              disabled={disabled}
              title={item.label}
            >
              <item.icon className="h-4 w-4" />
            </Button>
          )
        )}
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable={!disabled}
        onInput={handleInput}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="min-h-[200px] p-4 focus:outline-none prose prose-sm max-w-none dark:prose-invert"
        data-placeholder={placeholder}
      />
      
      <style>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: hsl(var(--muted-foreground));
          pointer-events: none;
        }
        [contenteditable] h1 {
          font-size: 1.875rem;
          font-weight: bold;
          margin: 1rem 0;
        }
        [contenteditable] h2 {
          font-size: 1.5rem;
          font-weight: bold;
          margin: 0.75rem 0;
        }
        [contenteditable] h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin: 0.5rem 0;
        }
        [contenteditable] blockquote {
          border-left: 4px solid hsl(var(--primary));
          padding-left: 1rem;
          margin: 1rem 0;
          font-style: italic;
          color: hsl(var(--muted-foreground));
        }
        [contenteditable] ul, [contenteditable] ol {
          margin: 0.5rem 0;
          padding-left: 2rem;
        }
        [contenteditable] a {
          color: hsl(var(--primary));
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}
