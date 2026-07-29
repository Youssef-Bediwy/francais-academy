'use client';

import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cn } from '@/utils/cn';

export interface TabItem {
  value: string;
  label: string;
  content: React.ReactNode;
}

export function Tabs({
  items,
  defaultValue,
  className,
}: {
  items: TabItem[];
  defaultValue?: string;
  className?: string;
}) {
  return (
    <TabsPrimitive.Root defaultValue={defaultValue ?? items[0]?.value} className={className}>
      <TabsPrimitive.List className="mb-5 flex gap-1 overflow-x-auto rounded-xl bg-surface-muted p-1">
        {items.map((item) => (
          <TabsPrimitive.Trigger
            key={item.value}
            value={item.value}
            className="whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium text-foreground-muted transition data-[state=active]:bg-surface data-[state=active]:text-foreground data-[state=active]:shadow-soft"
          >
            {item.label}
          </TabsPrimitive.Trigger>
        ))}
      </TabsPrimitive.List>
      {items.map((item) => (
        <TabsPrimitive.Content key={item.value} value={item.value} className="animate-fade-in">
          {item.content}
        </TabsPrimitive.Content>
      ))}
    </TabsPrimitive.Root>
  );
}
