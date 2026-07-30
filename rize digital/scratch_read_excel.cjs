const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

try {
  const filePath = path.join(__dirname, 'public', 'Stuffing Free Rize World (2).xlsx');
  console.log('Reading file:', filePath);
  const workbook = xlsx.readFile(filePath);
  const sheetNames = workbook.SheetNames;
  console.log('Sheets found:', sheetNames);
  
  const outputData = {};
  for (const sheetName of sheetNames) {
    const sheet = workbook.Sheets[sheetName];
    // We want to read row data, styling/coloring is stored in sheet cells
    // Let's get sheet data as JSON first, but also let's inspect the cell objects to check formatting colors (black, green, red)
    outputData[sheetName] = {
      rows: xlsx.utils.sheet_to_json(sheet, { header: 1 }),
      cells: []
    };
    
    // Check cell colors if needed
    // The library cell object: sheet[address] has .s property if cellStyles: true was used or if it exists.
  }
  
  fs.writeFileSync(path.join(__dirname, 'scratch', 'xlsx_data.json'), JSON.stringify(outputData, null, 2));
  console.log('Successfully wrote sheet structures to scratch/xlsx_data.json');
} catch (err) {
  console.error('Error reading excel:', err);
}
