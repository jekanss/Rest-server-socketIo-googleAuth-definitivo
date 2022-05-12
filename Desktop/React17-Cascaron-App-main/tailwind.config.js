module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  variants: { 
    animation: ['responsive', 'hover', 'group-hover'],
    animate: ['responsive', 'hover', 'group-hover'],    
    fontSize: ['responsive', 'hover', 'group-hover'],    
    transform: ['responsive', 'hover', 'group-hover'],    
    scale: ['responsive', 'hover', 'group-hover'] ,   
    margin: ['responsive', 'hover', 'group-hover'] ,   
    padding: ['responsive', 'hover', 'group-hover'],   
    visibility: ['responsive', 'hover', 'group-hover'],
    display:['responsive', 'hover', 'group-hover'],
    borderWidth: ['hover', 'focus', 'group-hover'],
    aspectRatio: ['responsive', 'hover', 'group-hover'],
    active: ['responsive', 'hover', 'group-hover']
  },
  plugins: [],
}