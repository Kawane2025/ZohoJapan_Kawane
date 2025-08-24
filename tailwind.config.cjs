module.exports = {
  content: ['./index.html','./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: { zoho: { red:'#EA4335', green:'#34A853', blue:'#4285F4', yellow:'#FBBC05', navy:'#1F3A68' } },
      boxShadow: { glow: '0 10px 25px rgba(31,58,104,0.18)' }
    }
  }, plugins: []
}