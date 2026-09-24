import type { ColorId } from './types';

export interface ColorDef {
  id: ColorId;
  hex: string;
  light: string;
  dark: string;
  name: string;
}

export const COLORS: ColorDef[] = [
  { id: 'red',    hex: '#EF4444', light: '#FCA5A5', dark: '#991B1B', name: 'Red' },
  { id: 'blue',   hex: '#3B82F6', light: '#93C5FD', dark: '#1E40AF', name: 'Blue' },
  { id: 'green',  hex: '#22C55E', light: '#86EFAC', dark: '#15803D', name: 'Green' },
  { id: 'yellow', hex: '#EAB308', light: '#FDE047', dark: '#A16207', name: 'Yellow' },
  { id: 'purple', hex: '#A855F7', light: '#D8B4FE', dark: '#6B21A8', name: 'Purple' },
  { id: 'orange', hex: '#F97316', light: '#FDBA74', dark: '#C2410C', name: 'Orange' },
  { id: 'pink',   hex: '#EC4899', light: '#F9A8D4', dark: '#BE185D', name: 'Pink' },
  { id: 'cyan',   hex: '#06B6D4', light: '#67E8F9', dark: '#0E7490', name: 'Cyan' },
  { id: 'lime',   hex: '#84CC16', light: '#BEF264', dark: '#4D7C0F', name: 'Lime' },
  { id: 'teal',   hex: '#14B8A6', light: '#5EEAD4', dark: '#0F766E', name: 'Teal' },
];

export function getColor(id: ColorId): ColorDef {
  return COLORS.find((c) => c.id === id) ?? COLORS[0];
}
