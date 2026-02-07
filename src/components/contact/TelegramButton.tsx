"use client";

import Button from "@/components/ui/Button";

interface TelegramButtonProps {
  url: string;
  onClick?: () => void;
}

export default function TelegramButton({ url, onClick }: TelegramButtonProps) {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" onClick={onClick}>
      <Button
        variant="secondary"
        className="w-full border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
      >
        Telegram
      </Button>
    </a>
  );
}
