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
        elevation={0}
        sx={{ 
          p: { xs: 2, md: 2.5 }, 
          mb: { xs: 2, md: 3 }, 
          display: 'flex', 
          alignItems: 'center', 
          gap: { xs: 1.5, md: 2 },
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'rgba(0,0,0,0.05)',
          boxShadow: isDragging ? '0 12px 24px rgba(0,0,0,0.1)' : '0 4px 12px rgba(0,0,0,0.03)',
          transition: 'all 0.2s ease',
          bgcolor: '#fff'
        }}
      >
        <IconButton
          {...attributes}
          {...listeners}
          sx={{ cursor: 'grab', color: 'text.disabled', '&:hover': { color: 'text.primary', bgcolor: 'rgba(0,0,0,0.04)' } }}
          aria-label="Drag to reorder"
          size="small"
        >
          <DragIndicatorIcon />
        </IconButton>
        <div style={{ flex: 1, overflow: 'hidden' }}>
          {children}
        </div>
      </Paper>
    </div>
  );
}
