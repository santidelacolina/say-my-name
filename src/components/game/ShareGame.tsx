import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { useGameStore } from '@/store/gameStore';
import { buildShareUrl } from '@/utils/shareCode';

/** Comparte el link/código de la partida para que otro celular cargue el mismo mazo. */
export function ShareGame() {
  const shareCode = useGameStore((s) => s.shareCode);
  const [status, setStatus] = useState<'idle' | 'copied' | 'shown'>('idle');

  if (!shareCode) return null;
  const url = buildShareUrl(shareCode);

  const share = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Say My Name', text: 'Unite a la partida 🎉', url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setStatus('copied');
    } catch {
      setStatus('shown');
    }
  };

  return (
    <div className="space-y-2 text-center">
      <Button variant="outline" size="sm" icon="📲" onClick={share}>
        {status === 'copied' ? '¡Link copiado!' : 'Compartir partida con otro celu'}
      </Button>
      {status === 'shown' && (
        <p className="break-all rounded-xl bg-ink-900/5 p-2 text-xs dark:bg-white/10">{shareCode}</p>
      )}
    </div>
  );
}
