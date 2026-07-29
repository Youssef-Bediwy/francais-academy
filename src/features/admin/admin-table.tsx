'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/dialog';
import { apiFetch } from '@/hooks/use-api';
import { useToast } from '@/hooks/use-toast';
import { useI18n } from '@/components/providers/i18n-provider';
import { cn } from '@/utils/cn';

export interface AdminColumn<T> {
  key: string;
  header: string;
  render: (row: T) => React.ReactNode;
  className?: string;
}

export interface AdminTableProps<T extends { id: string }> {
  rows: T[];
  columns: AdminColumn<T>[];
  resource: string;
  emptyLabel: string;
}

/** Tableau d'administration generique avec suppression confirmee. */
export function AdminTable<T extends { id: string }>({
  rows,
  columns,
  resource,
  emptyLabel,
}: AdminTableProps<T>) {
  const { t } = useI18n();
  const toast = useToast();
  const router = useRouter();
  const [target, setTarget] = useState<string | null>(null);

  const remove = async () => {
    if (!target) return;
    try {
      await apiFetch(`/api/${resource}/${target}`, { method: 'DELETE' });
      toast.success(t('admin.deleted'));
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t('errors.generic'));
    }
  };

  if (rows.length === 0) {
    return <p className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-foreground-muted">{emptyLabel}</p>;
  }

  return (
    <>
      <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
        <table className="w-full text-sm">
          <caption className="sr-only">{resource}</caption>
          <thead className="bg-surface-muted text-start">
            <tr>
              {columns.map((column) => (
                <th key={column.key} scope="col" className={cn('px-4 py-3 text-start font-semibold', column.className)}>
                  {column.header}
                </th>
              ))}
              <th scope="col" className="px-4 py-3 text-end font-semibold">
                {t('admin.actions')}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-t border-border">
                {columns.map((column) => (
                  <td key={column.key} className={cn('px-4 py-3', column.className)}>
                    {column.render(row)}
                  </td>
                ))}
                <td className="px-4 py-3 text-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    aria-label={t('admin.delete')}
                    onClick={() => setTarget(row.id)}
                  >
                    <Trash2 className="h-4 w-4 text-berry-600" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        open={target !== null}
        onOpenChange={(open) => setTarget(open ? target : null)}
        title={t('admin.confirmDeleteTitle')}
        description={t('admin.confirmDeleteDescription')}
        confirmLabel={t('admin.delete')}
        destructive
        onConfirm={remove}
      />
    </>
  );
}
