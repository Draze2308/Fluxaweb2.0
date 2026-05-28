export type ThemeVariant = 'violet' | 'ocean' | 'sunset' | 'forest' | 'mono'

export interface Palette {
  background: string
  surface: string
  surfaceElevated: string
  surfaceSunken: string
  primary: string
  secondary: string
  accent: string
  text: string
  textSecondary: string
  textTertiary: string
  separator: string
  success: string
  warning: string
  error: string
  gold: string
}

const violet: Palette = {
  background: '#0B0717',
  surface: '#16102A',
  surfaceElevated: '#1F1838',
  surfaceSunken: '#070414',
  primary: '#8B5CF6',
  secondary: '#A78BFA',
  accent: '#34D399',
  text: '#F4F1FF',
  textSecondary: '#B4ABD4',
  textTertiary: '#7D7599',
  separator: '#2A2247',
  success: '#34D399',
  warning: '#F5B544',
  error: '#F87171',
  gold: '#F5C16C',
}

const ocean: Palette = { ...violet, primary: '#06B6D4', secondary: '#22D3EE', separator: '#0E3B49' }
const sunset: Palette = { ...violet, primary: '#F97316', secondary: '#FB923C', separator: '#492416' }
const forest: Palette = { ...violet, primary: '#10B981', secondary: '#34D399', separator: '#0E3B2C' }
const mono: Palette = { ...violet, primary: '#E5E7EB', secondary: '#CBD5E1', separator: '#2D2D33', accent: '#FFFFFF' }

export const palettes: Record<ThemeVariant, Palette> = { violet, ocean, sunset, forest, mono }

export const themeMeta: Record<ThemeVariant, { name: string; pro: boolean; gradient: [string, string] }> = {
  violet: { name: 'Violet', pro: false, gradient: ['#8B5CF6', '#A78BFA'] },
  ocean: { name: 'Ocean', pro: true, gradient: ['#06B6D4', '#22D3EE'] },
  sunset: { name: 'Sunset', pro: true, gradient: ['#F97316', '#FB923C'] },
  forest: { name: 'Forest', pro: true, gradient: ['#10B981', '#34D399'] },
  mono: { name: 'Mono', pro: true, gradient: ['#E5E7EB', '#9CA3AF'] },
}
