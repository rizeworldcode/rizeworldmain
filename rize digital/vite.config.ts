import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'
import XLSX from 'xlsx'

// Extract Excel Data
try {
  const filePath = path.join(__dirname, 'public', 'Stuffing Free Rize World (2).xlsx');
  if (fs.existsSync(filePath)) {
    const workbook = XLSX.readFile(filePath, { cellStyles: true });
    const result: any = {};
    
    workbook.SheetNames.forEach(sheetName => {
      const sheet = workbook.Sheets[sheetName];
      const range = XLSX.utils.decode_range(sheet['!ref'] || 'A1');
      
      const columnsData: any = {};
      
      for (let c = range.s.c; c <= range.e.c; c++) {
        // Find column header: first cell in this column that has a value (usually row 0)
        let header = '';
        let headerRowIdx = 0;
        for (let r = range.s.r; r <= Math.min(range.e.r, 5); r++) {
          const cellRef = XLSX.utils.encode_cell({ r, c });
          const cell = sheet[cellRef];
          if (cell && cell.v !== undefined && cell.v !== null) {
            const text = String(cell.v).trim();
            if (text) {
              header = text;
              headerRowIdx = r;
              break;
            }
          }
        }
        
        if (!header) continue;
        
        // Skip metric column headers like "S/Comp."
        if (header.toLowerCase().includes('comp.') || header.includes('/Comp')) continue;
        
        const primarySet = new Set<string>();
        const secondarySet = new Set<string>();
        const lsiSet = new Set<string>();
        
        // Check if the header cell itself is a keyword (has black/no color vs white)
        const headerCellRef = XLSX.utils.encode_cell({ r: headerRowIdx, c });
        const headerCell = sheet[headerCellRef];
        const headerRgb = headerCell?.s?.fgColor?.rgb || headerCell?.s?.bgColor?.rgb;
        if (!headerRgb || headerRgb.toUpperCase() === '000000') {
          primarySet.add(header);
        }
        
        for (let r = headerRowIdx + 1; r <= range.e.r; r++) {
          const cellRef = XLSX.utils.encode_cell({ r, c });
          const cell = sheet[cellRef];
          if (cell && cell.v !== undefined && cell.v !== null) {
            const text = String(cell.v).trim();
            if (!text) continue;
            
            // Skip metric rows (e.g., "1K–10K / Low", "10–100 / Low / 23–160")
            if (
              text.toLowerCase().includes('comp.') ||
              /^\d+/.test(text) || // starts with number
              /\d+\s*-\s*\d+/.test(text) || // range
              /\d+\s*–\s*\d+/.test(text) || // range with dash
              (text.includes('/') && /\d/.test(text)) // slash and a digit
            ) {
              continue;
            }
            
            const rgb = cell.s?.fgColor?.rgb || cell.s?.bgColor?.rgb;
            if (rgb) {
              const upperRgb = rgb.toUpperCase();
              if (upperRgb === '000000') {
                primarySet.add(text);
              } else if (upperRgb === '00FF00') {
                secondarySet.add(text);
              } else if (upperRgb === 'FF0000') {
                lsiSet.add(text);
              }
            }
          }
        }
        
        if (primarySet.size > 0 || secondarySet.size > 0 || lsiSet.size > 0) {
          columnsData[header] = {
            primary: Array.from(primarySet),
            secondary: Array.from(secondarySet),
            lsi: Array.from(lsiSet)
          };
        }
      }
      
      if (Object.keys(columnsData).length > 0) {
        result[sheetName] = columnsData;
      }
    });
    const outputPath = path.join(__dirname, 'src', 'data', 'cleaned_keywords.json');
    fs.writeFileSync(outputPath, JSON.stringify(result, null, 2), 'utf-8');
    console.log('Successfully wrote structured keywords to cleaned_keywords.json');
  } else {
    console.log('Excel file not found at:', filePath);
  }
} catch (error: any) {
  console.error('Error parsing Excel in vite.config.ts:', error.message);
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    host: true
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        notfound: path.resolve(__dirname, '404.html')
      },
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('three')) return 'three';
            if (id.includes('tsparticles') || id.includes('react-tsparticles')) return 'tsparticles';
            if (id.includes('framer-motion') || id.includes('gsap')) return 'animations';
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) return 'react-core';
            return 'vendor';
          }
        }
      }
    }
  }
})
