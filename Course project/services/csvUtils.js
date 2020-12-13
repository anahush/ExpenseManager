let CSVUtils = {

    downloadCSV: (csv, filename) => {
        let csvFile;
        let downloadLink;
    
        csvFile = new Blob([csv], {type: "text/csv"});

        downloadLink = document.createElement("a");
        downloadLink.download = filename;
        downloadLink.href = window.URL.createObjectURL(csvFile);
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);
        downloadLink.click();
    },

    exportTableToCSV: (filename) => {
        let csv = [];
        let rows = document.querySelectorAll("table tr");
        
        for (let i = 0; i < rows.length; i++) {
            let row = [], cols = rows[i].querySelectorAll("td, th");
            
            for (let j = 0; j < cols.length; j++) 
                row.push(cols[j].innerText);
            
            csv.push(row);        
        }

        // Download CSV file
        CSVUtils.downloadCSV(csv.join("\n"), filename);
    }

};

export default CSVUtils;