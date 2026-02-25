import { cn } from '@/lib/utils';

interface DividerProps {
  className?: string;
  showIcon?: boolean;
}

export function Divider({ className, showIcon = true }: DividerProps) {
  return (
    <div className={cn('relative my-0', className)}>
      <div className="border-t border-dashed border-bark/20" />
      {showIcon && (
        <div className="absolute inset-x-0 -top-3 flex justify-center">
          <div className="bg-parchment px-3">
            <svg
              viewBox="0 0 24 28"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6 text-gold"
            >
              <line x1="12" y1="8" x2="12" y2="26" />
              <rect x="4" y="2" width="16" height="10" rx="1" fill="currentColor" fillOpacity="0.15" />
              <line x1="4" y1="7" x2="20" y2="7" strokeWidth="0.8" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}
