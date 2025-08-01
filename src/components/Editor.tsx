import { useState, useEffect, useRef } from 'react';
import { Page } from '@/types';
import { Input } from '@/components/ui/input';
import { BlockEditor } from './BlockEditor';
import { cn } from '@/lib/utils';

interface EditorProps {
  page: Page;
  onUpdatePage: (pageId: string, updates: Partial<Page>) => void;
}

export const Editor = ({ page, onUpdatePage }: EditorProps) => {
  const [title, setTitle] = useState(page.title);
  const titleRef = useRef<HTMLInputElement>(null);

  // Update local state when page changes
  useEffect(() => {
    setTitle(page.title);
  }, [page.id, page.title]);

  // Auto-save title with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (title !== page.title) {
        onUpdatePage(page.id, { title });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [title, page.id, page.title, onUpdatePage]);

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // Focus on first block or create one
      const firstBlock = document.querySelector('[data-block-id]') as HTMLElement;
      if (firstBlock) {
        firstBlock.focus();
      }
    }
  };

  const handleUpdateBlocks = (blocks: Page['blocks']) => {
    onUpdatePage(page.id, { blocks });
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-black/30 backdrop-blur-sm">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-12 py-12">
          <div className="space-y-8">
            {/* Title */}
            <Input
              ref={titleRef}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={handleTitleKeyDown}
              placeholder="Untitled"
              className="text-5xl font-bold border-0 p-0 bg-transparent focus-visible:ring-0 placeholder:text-gray-500 text-white h-auto leading-tight"
            />

            {/* Block Editor */}
            <BlockEditor
              blocks={page.blocks || []}
              onUpdateBlocks={handleUpdateBlocks}
            />
          </div>
        </div>
      </div>
      
      {/* Status bar */}
      <div className="border-t border-green-500/20 px-12 py-4 bg-black/60 backdrop-blur-xl shadow-sm">
        <div className="flex items-center justify-between text-sm text-gray-400 max-w-5xl mx-auto">
          <div>
            Last updated: {new Date(page.updatedAt).toLocaleString()}
          </div>
          <div>
            {(page.blocks || []).length} blocks
          </div>
        </div>
      </div>
    </div>
  );
};