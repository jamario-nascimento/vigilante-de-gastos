import * as Dialog from '@radix-ui/react-dialog';
import { ReactNode } from 'react';

export function Modal({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className="px-4 py-2 bg-primary text-white rounded-xl">Abrir</button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 w-[90%] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-xl">
          <Dialog.Title className="text-xl font-semibold mb-4">{title}</Dialog.Title>
          {children}
          <Dialog.Close className="absolute top-2 right-2">✕</Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}