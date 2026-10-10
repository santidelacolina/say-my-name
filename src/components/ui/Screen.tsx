import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface ScreenProps {
  children: ReactNode;
  className?: string;
  /** Centra el contenido verticalmente (pantallas cortas como Home). */
  center?: boolean;
}

/**
 * Contenedor de pantalla: respeta las zonas seguras del celular (notch,
 * barra de gestos) y aplica la animación de entrada.
 */
export function Screen({ children, className, center }: ScreenProps) {
  return (
    <main
      className={cn(
        'safe-top safe-bottom mx-auto flex w-full max-w-lg flex-1 flex-col px-4 animate-fade-up',
        center && 'justify-center',
        className,
      )}
    >
      {children}
    </main>
  );
}
