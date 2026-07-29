import { describe, expect, it } from 'vitest';
import { render, screen } from '@tests/render';
import { ProgressBar } from '@/components/ui/progress-bar';

describe('ProgressBar', () => {
  it('expose les attributs ARIA', () => {
    render(<ProgressBar value={42} label="Progression du cours" showValue />);
    const bar = screen.getByRole('progressbar', { name: 'Progression du cours' });
    expect(bar).toHaveAttribute('aria-valuenow', '42');
    expect(bar).toHaveAttribute('aria-valuemin', '0');
    expect(bar).toHaveAttribute('aria-valuemax', '100');
    expect(screen.getByText('42 %')).toBeInTheDocument();
  });

  it('borne les valeurs hors limites', () => {
    render(<ProgressBar value={180} label="Trop" />);
    expect(screen.getByRole('progressbar', { name: 'Trop' })).toHaveAttribute('aria-valuenow', '100');
  });
});
