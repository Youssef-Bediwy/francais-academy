import { Sidebar } from '@/components/layout/sidebar';
import { MobileNav } from '@/components/layout/mobile-nav';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container-page flex gap-8 py-10 pb-24 lg:pb-10">
      <Sidebar />
      <div className="min-w-0 flex-1">{children}</div>
      <MobileNav />
    </div>
  );
}
