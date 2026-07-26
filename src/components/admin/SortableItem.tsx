'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Paper, IconButton } from '@mui/material';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

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
    <div ref={setNodeRef} style={style}>
      <Paper
        elevation={isDragging ? 4 : 1}
        sx={{ p: 2, mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}
      >
        <IconButton
          {...attributes}
          {...listeners}
          sx={{ cursor: 'grab' }}
          aria-label="Drag to reorder"
        >
          <DragIndicatorIcon />
        </IconButton>
        <div style={{ flex: 1 }}>
          {children}
        </div>
      </Paper>
    </div>
  );
}
