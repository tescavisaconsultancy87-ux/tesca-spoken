'use client';

import React, { useRef, useEffect } from 'react';
import { Bold, Italic, Heading2, Heading3, List, ListOrdered } from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  // Sync internal HTML with external value ONLY when they differ to avoid cursor reset
  useEffect(() => {
    if (editorRef.current) {
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value;
      }
    }
  }, [value]);

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const html = e.currentTarget.innerHTML;
    onChange(html);
  };

  const executeCommand = (command: string, arg: string = '') => {
    document.execCommand(command, false, arg);
    // Focus back on editor
    editorRef.current?.focus();
    // Trigger change
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10 transition-all">
      {/* Toolbar */}
      <div className="flex items-center gap-4 px-5 py-3 bg-[#F8FAFC] border-b border-gray-200 flex-wrap select-none">
        {/* Bold */}
        <button
          type="button"
          onClick={() => executeCommand('bold')}
          className="text-gray-700 hover:text-black font-bold text-lg px-1.5 py-0.5 rounded transition-colors cursor-pointer"
          title="Bold"
        >
          B
        </button>

        {/* Italic */}
        <button
          type="button"
          onClick={() => executeCommand('italic')}
          className="text-gray-700 hover:text-black italic font-serif text-lg px-1.5 py-0.5 rounded transition-colors cursor-pointer"
          title="Italic"
        >
          I
        </button>

        {/* H2 */}
        <button
          type="button"
          onClick={() => executeCommand('formatBlock', '<h2>')}
          className="text-gray-700 hover:text-black font-bold text-sm px-1.5 py-0.5 rounded transition-colors cursor-pointer"
          title="Heading 2"
        >
          H₂
        </button>

        {/* H3 */}
        <button
          type="button"
          onClick={() => executeCommand('formatBlock', '<h3>')}
          className="text-gray-700 hover:text-black font-bold text-sm px-1.5 py-0.5 rounded transition-colors cursor-pointer"
          title="Heading 3"
        >
          H₃
        </button>

        {/* Numbered List */}
        <button
          type="button"
          onClick={() => executeCommand('insertOrderedList')}
          className="text-gray-700 hover:text-black p-1 rounded transition-colors cursor-pointer"
          title="Ordered List"
        >
          <ListOrdered className="w-5 h-5 stroke-[2.2]" />
        </button>

        {/* Bullet List */}
        <button
          type="button"
          onClick={() => executeCommand('insertUnorderedList')}
          className="text-gray-700 hover:text-black p-1 rounded transition-colors cursor-pointer"
          title="Bullet List"
        >
          <List className="w-5 h-5 stroke-[2.2]" />
        </button>

        {/* Clear formatting */}
        <button
          type="button"
          onClick={() => executeCommand('removeFormat')}
          className="text-gray-700 hover:text-black px-1.5 py-0.5 rounded transition-colors font-medium text-lg flex items-baseline gap-0.5 cursor-pointer"
          title="Clear Formatting"
        >
          T<span className="text-xs font-normal text-gray-500">x</span>
        </button>
      </div>

      {/* Editable Area */}
      <div className="relative min-h-[220px]">
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          className="outline-none p-5 min-h-[220px] text-sm text-gray-700 focus:outline-none prose prose-sm max-w-none prose-p:my-1 prose-headings:my-2 prose-ul:list-disc prose-ol:list-decimal"
        />
        {(!value || value === '<br>' || value === '') && (
          <div className="absolute inset-0 pointer-events-none p-5 text-sm text-[#8A9EB5] italic select-none leading-relaxed">
            {placeholder}
          </div>
        )}
      </div>
    </div>
  );
}
