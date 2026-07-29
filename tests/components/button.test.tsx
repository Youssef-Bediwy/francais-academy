import { describe, expect, it, vi } from 'vitest';
import { render, screen, userEvent } from '@tests/render';
import { Button } from '@/components/ui/button';

describe('Button', () => {
  it('declenche le clic', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Valider</Button>);
    await userEvent.click(screen.getByRole('button', { name: 'Valider' }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('bloque le clic pendant le chargement et annonce l etat', async () => {
    const onClick = vi.fn();
    render(
      <Button loading onClick={onClick}>
        Envoi
      </Button>,
    );
    const button = screen.getByRole('button', { name: /Envoi/ });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
    await userEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('applique la variante demandee', () => {
    render(<Button variant="danger">Supprimer</Button>);
    expect(screen.getByRole('button', { name: 'Supprimer' }).className).toContain('bg-berry-500');
  });
});
