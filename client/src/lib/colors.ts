// CodeCrew color schema constants

export const colors = {
  // Main colors
  background: '#0D1117',
  surface: '#161B22',
  primaryAccent: '#3B82F6',
  secondaryAccent: '#8B5CF6',
  textPrimary: '#F1F5F9',
  textSecondary: '#94A3B8',
  success: '#10B981',
  warning: '#F59E0B',
  
  // Additional colors
  danger: '#EF4444',  // For errors and destructive actions
  border: '#30363D',  // For borders and dividers
  hover: {
    primaryAccent: '#2563EB', // Darker blue for hover states
    secondaryAccent: '#7C3AED', // Darker violet for hover states
    surface: '#1E2530', // Slightly lighter than surface for hover
  },
  focus: {
    outline: 'rgba(59, 130, 246, 0.5)', // Semi-transparent primary for focus rings
  },
  shadow: {
    light: 'rgba(0, 0, 0, 0.1)',
    medium: 'rgba(0, 0, 0, 0.2)',
    dark: 'rgba(0, 0, 0, 0.3)',
  }
};

// For use in Tailwind classes
export const tailwindColors = {
  background: 'bg-[#0D1117]',
  surface: 'bg-[#161B22]',
  primaryAccent: 'bg-[#3B82F6]',
  secondaryAccent: 'bg-[#8B5CF6]',
  textPrimary: 'text-[#F1F5F9]',
  textSecondary: 'text-[#94A3B8]',
  success: 'bg-[#10B981]',
  warning: 'bg-[#F59E0B]',
  danger: 'bg-[#EF4444]',
  border: 'border-[#30363D]',
  
  // Hover variants
  hoverPrimaryAccent: 'hover:bg-[#2563EB]',
  hoverSecondaryAccent: 'hover:bg-[#7C3AED]',
  hoverSurface: 'hover:bg-[#1E2530]',
  
  // Text colors
  textPrimaryAccent: 'text-[#3B82F6]',
  textSecondaryAccent: 'text-[#8B5CF6]',
  textSuccess: 'text-[#10B981]',
  textWarning: 'text-[#F59E0B]',
  textDanger: 'text-[#EF4444]',
};