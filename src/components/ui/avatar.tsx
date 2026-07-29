import Image from 'next/image';
import { cn } from '@/utils/cn';
import { initials } from '@/utils/text';

const sizes = { sm: 'h-8 w-8 text-xs', md: 'h-10 w-10 text-sm', lg: 'h-14 w-14 text-base' } as const;

export interface AvatarProps {
  name: string;
  src?: string | null;
  size?: keyof typeof sizes;
  className?: string;
}

export function Avatar({ name, src, size = 'md', className }: AvatarProps) {
  return (
    <span
      className={cn(
        'relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-100 font-semibold text-brand-700',
        sizes[size],
        className,
      )}
    >
      {src ? (
        <Image src={src} alt={name} fill sizes="56px" className="object-cover" />
      ) : (
        <span aria-hidden="true">{initials(name)}</span>
      )}
      <span className="sr-only">{name}</span>
    </span>
  );
}
