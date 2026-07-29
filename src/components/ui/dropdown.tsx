'use client';

import * as DropdownPrimitive from '@radix-ui/react-dropdown-menu';
import { cn } from '@/utils/cn';

export interface DropdownItem {
  key: string;
  label: React.ReactNode;
  onSelect?: () => void;
  href?: string;
  destructive?: boolean;
  disabled?: boolean;
}

export interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  label?: string;
  align?: 'start' | 'center' | 'end';
  className?: string;
}

export function Dropdown({ trigger, items, label, align = 'end', className }: DropdownProps) {
  return (
    <DropdownPrimitive.Root>
      <DropdownPrimitive.Trigger asChild aria-label={label}>
        {trigger}
      </DropdownPrimitive.Trigger>
      <DropdownPrimitive.Portal>
        <DropdownPrimitive.Content
          align={align}
          sideOffset={8}
          className={cn(
            'z-50 min-w-48 animate-scale-in rounded-xl border border-border bg-surface p-1.5 shadow-lift',
            className,
          )}
        >
          {items.map((item) =>
            item.href ? (
              <DropdownPrimitive.Item key={item.key} asChild disabled={item.disabled}>
                <a
                  href={item.href}
                  className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm outline-none data-[highlighted]:bg-surface-muted"
                >
                  {item.label}
                </a>
              </DropdownPrimitive.Item>
            ) : (
              <DropdownPrimitive.Item
                key={item.key}
                disabled={item.disabled}
                onSelect={item.onSelect}
                className={cn(
                  'flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm outline-none data-[highlighted]:bg-surface-muted',
                  item.destructive && 'text-berry-600',
                )}
              >
                {item.label}
              </DropdownPrimitive.Item>
            ),
          )}
        </DropdownPrimitive.Content>
      </DropdownPrimitive.Portal>
    </DropdownPrimitive.Root>
  );
}
