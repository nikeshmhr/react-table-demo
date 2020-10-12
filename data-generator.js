const fs = require('fs');

const NO_OF_NICHES = 7;
const NO_OF_COLUMNS_PER_NICHE = 10;
const TOTAL_NO_OF_LENDERS = 100;

function generate() {
    let niches = [];

    for(let i = 0; i < NO_OF_NICHES; i++) {
        let niche = {
            id: i,
            name: `Niche name ${i}`,
            label: `Niche ${i}`,
            defaultColumn: 'Column0_0',
            columns: [],
            rowData: []
        }

        // Loop for columns
        for(let j = 0; j < NO_OF_COLUMNS_PER_NICHE; j++) {
            let column = {
                id: `Column${i}_${j}`,
                label: `Column ${i}_${j}`
            }
            niche.columns.push(column);
        }

        for(let k = 0; k < TOTAL_NO_OF_LENDERS; k++) {
            let row = {
                lenderInfo: {
                    id: `Lender${k}`,
                    lenderId: `Lender${k}`,
                    name: `Lender ${k}`
                },
                cellData: []
            };
            for(let x = 0; x < NO_OF_COLUMNS_PER_NICHE; x++) {
                let cellData = {
                    id: `Cell${x}`,
                    columnId: niche.columns[x].id,
                    value: (Math.random() * 2000).toFixed(2)
                }
                row.cellData.push(cellData);
            }
            niche.rowData.push(row);
        }
        niches.push(niche);
    }

    let data = JSON.stringify(niches);
    fs.writeFileSync('niche-data.json', data);
}

generate();