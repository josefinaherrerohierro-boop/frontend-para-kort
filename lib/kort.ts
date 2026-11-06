import type { Miembro, Rol, Servidor } from './api'

const PALETA = ['#FF6B5B', '#3FB68B', '#E8A33D', '#3D9BE8', '#D9667F', '#4FB3BF', '#C98B4B', '#7FA65A']

export function colorDesdeNombre(nombre: string): string {
  let hash = 0
  for (let i = 0; i < nombre.length; i++) hash = (hash * 31 + nombre.charCodeAt(i)) >>> 0
  return PALETA[hash % PALETA.length]
}

export function iniciales(nombre: string): string {
  const partes = nombre.trim().split(/\s+/).filter(Boolean)
  if (partes.length === 0) return '?'
  if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase()
  return (partes[0][0] + partes[1][0]).toUpperCase()
}

export type Permisos = {
  esDuenio: boolean
  esModerador: boolean
  puedeInvitar: boolean
  puedeEscribir: boolean
}

export function calcularPermisos(
  servidor: Servidor | undefined,
  miId: number | undefined,
  miembros: Miembro[] | undefined,
  roles: Rol[] | undefined,
): Permisos {
  const esDuenio = !!servidor && miId !== undefined && servidor.duenio_id === miId
  const yo = miembros?.find((m) => m.usuario_id === miId)
  const misRolIds = new Set(yo?.roles.map((r) => r.id) ?? [])
  const misRoles = (roles ?? []).filter((r) => misRolIds.has(r.id))
  return {
    esDuenio,
    esModerador: esDuenio || misRoles.some((r) => r.puede_moderar),
    puedeInvitar: esDuenio || misRoles.some((r) => r.puede_invitar),
    puedeEscribir: misRoles.some((r) => r.puede_escribir),
  }
}

const formatoHora = new Intl.DateTimeFormat('es-AR', { hour: '2-digit', minute: '2-digit' })
const formatoFecha = new Intl.DateTimeFormat('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' })

export function parseFecha(iso: string): Date {
  // Si la API devuelve fechas sin zona horaria, las tratamos como UTC.
  const tieneZona = /[zZ]|[+-]\d{2}:?\d{2}$/.test(iso)
  return new Date(tieneZona ? iso : `${iso}Z`)
}

export function horaMensaje(iso: string): string {
  const d = parseFecha(iso)
  const hoy = new Date()
  const mismoDia = d.toDateString() === hoy.toDateString()
  return mismoDia ? `hoy ${formatoHora.format(d)}` : `${formatoFecha.format(d)} ${formatoHora.format(d)}`
}

export function soloHora(iso: string): string {
  return formatoHora.format(parseFecha(iso))
}

export function destinoSeguro(next: string | null, porDefecto = '/app'): string {
  if (!next || !next.startsWith('/') || next.startsWith('//')) return porDefecto
  return next
}
