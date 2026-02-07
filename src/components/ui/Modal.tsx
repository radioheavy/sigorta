"use client";

import { useEffect, useRef } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export default function Modal({ open, onClose, title, children }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className="fixed inset-0 m-auto border-4 border-black bg-white p-0 backdrop:bg-black/80 max-w-lg w-full"
    >
      <div className="p-6">
        {title && (
          <div className="border-b-4 border-black pb-4 mb-4">
            <h2 className="text-lg font-bold uppercase tracking-wider">
              {title}
            </h2>
          </div>
        )}
        {children}
      </div>
    </dialog>
  );
}
