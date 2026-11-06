'use client'

import { LogOut } from 'lucide-react'
import type { Usuario } from '@/lib/api'
import { Avatar } from './ui'

export function UserCard({ usuario, onSalir }: { usuario: Usuario | undefined; onSalir: () => void }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-elevated/60 p-2.5">
      {usuario ? (
        <Avatar nombre={usuario.username} />
      ) : (
        <span className="size-9 animate-pulse rounded-lg bg-border" aria-hidden />
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{usuario?.username ?? 'Cargando…'}</p>
        <p className="truncate text-xs text-muted-foreground">{usuario?.email ?? ''}</p>
      </div>
      <button
        type="button"
        onClick={onSalir}
        className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-destructive/15 hover:text-destructive"
      >
        <LogOut className="size-3.5" aria-hidden />
        Salir de la cuenta
      </button>
    </div>
  )
}
