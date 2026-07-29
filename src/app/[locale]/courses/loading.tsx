import { Skeleton, SkeletonGrid } from '@/components/ui/skeleton';

export default function CoursesLoading() {
  return (
    <div className="container-page py-12">
      <Skeleton className="mb-3 h-4 w-28" />
      <Skeleton className="mb-8 h-9 w-72" />
      <Skeleton className="mb-8 h-28 w-full rounded-2xl" />
      <SkeletonGrid count={6} />
    </div>
  );
}
