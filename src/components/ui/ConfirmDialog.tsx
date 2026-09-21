import type { ReactNode } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  children?: ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'danger';
  isLoading?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  children,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default',
  isLoading = false,
}: ConfirmDialogProps) {
  
  const isDanger = variant === 'danger';
  
  const footer = (
    <>
      <Button variant="outline" className="flex-1" onClick={onClose} disabled={isLoading}>
        {cancelText}
      </Button>
      <Button 
        className={`flex-1 shadow-lg ${isDanger ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/20' : 'shadow-teal-400/10'}`} 
        onClick={onConfirm}
        disabled={isLoading}
      >
        {isLoading ? 'Processing...' : confirmText}
      </Button>
    </>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} footer={footer}>
      {description && <p className="text-sm text-slate-300 mb-4">{description}</p>}
      {children}
    </Modal>
  );
}
