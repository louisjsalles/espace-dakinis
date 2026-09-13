export default function Logo({ size = 40 }: { size?: number }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Logo Espace Dakinis"
    >
      {/* 1. Triangle Inversé (Rouge Sang) */}
      <polygon points="20,30 80,30 50,82" fill="#8B1A1A" />
      
      {/* 2. Cercle Central (Or) */}
      <circle cx="50" cy="47" r="15" fill="#D4AF37" />
      
      {/* 3. L'Épée (Lame tranchante pointue aux deux extrémités) */}
      <polygon points="50,12 53,35 50,65 47,35" fill="#F5F0E8" />
    </svg>
  );
}