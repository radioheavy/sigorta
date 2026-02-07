"use client";

import Button from "@/components/ui/Button";

interface WhatsAppButtonProps {
  url: string;
  onClick?: () => void;
}

export default function WhatsAppButton({ url, onClick }: WhatsAppButtonProps) {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" onClick={onClick}>
      <Button
        variant="secondary"
        className="w-full border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
      >
        WhatsApp
      </Button>
    </a>
  );
}
