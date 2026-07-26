'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortableItemProps {
  id: string;
  children: React.ReactNode;
}

export default function SortableItem({ id, children }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 'auto' as const,
  };

  return (
    <div ref={setNodeRef} style={style} className={isDragging ? 'dragging' : ''}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          className="drag-handle"
          {...attributes}
          {...listeners}
          aria-label="Drag to reorder"
          style={{ background: 'none', border: 'none', padding: '8px', cursor: 'grab' }}
        >
          ⠿
        </button>
        <div style={{ flex: 1 }}>
          {children}
        </div>
      </div>
    </div>
  );
}
