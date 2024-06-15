const params = new URLSearchParams(window.location.search);
const email = params.get('email');
const table = params.get('table');


document.addEventListener("DOMContentLoaded", function () {
    if (email != 'none') {
        if (table === 'sa') {
            document.getElementById("addbutton").addEventListener("click", function () {
                window.location.href = "input_attended";
            });
        }
        else if (table === 'so') {
            document.getElementById("addbutton").addEventListener("click", function () {
                window.location.href = "input_organised";
            });
        }
        else if (table === 'si') {
            document.getElementById("addbutton").addEventListener("click", function () {
                window.location.href = "input_invited";
            });
        }

    }
    document.getElementById("analytic").addEventListener("click", function () {
        window.location.href = "analytic.html?email=" + encodeURIComponent(email) + "&table=" + encodeURIComponent(table);
    });
});


// sorting option

document.getElementById('column').addEventListener('change', function (event) {
    const column = event.target.value;
    const valueInput = document.getElementById('value');
    const downloadButton = document.getElementById('downloadButton');


    // Check if the column is 'all'
    if (column === 'all' || column === 'range') {
        // If 'all' is selected, hide the input box and the download button

        valueInput.style.display = 'none';
        downloadButton.style.display = 'none';
        var label = document.querySelector('label[for="value"]');
        label.style.display = 'none';
        var label1 = document.querySelector('label[for="columndays"]');
        label1.style.display = 'none';
        document.getElementById('columndays').style.display = 'none';

    } else {
        // If any other option is selected, show the input box and the download button
        valueInput.style.display = 'inline-block';
        var label = document.querySelector('label[for="value"]');
        label.style.display = 'inline-block';
        downloadButton.style.display = 'inline-block';
        var label1 = document.querySelector('label[for="columndays"]');
        label1.style.display = 'none';
        document.getElementById('columndays').style.display = 'none';
    }

    if (column === 'range') {
        valueInput.style.display = 'none';
        downloadButton.style.display = 'none';
        var label = document.querySelector('label[for="value"]');
        label.style.display = 'none';
        var label1 = document.querySelector('label[for="columndays"]');
        label1.style.display = 'block';
        document.getElementById('columndays').style.display = 'block';
    }
});

// Event listener for form submission
document.getElementById('filterForm').addEventListener('submit', function (event) {
    console.log("Form submitted");
    event.preventDefault();

    const column = document.getElementById('column').value;
    const value = document.getElementById('value').value;
    const fromYear = document.getElementById('fromYear').value;
    const toYear = document.getElementById('toYear').value;

    // Fetch records based on selected column and value

    if (email === 'none') {
        var columndays = document.getElementById("columndays").value;
        console.log(columndays)

        fetch(`/records1?column=${column}&value=${value}&fromYear=${fromYear}&toYear=${toYear}&table=${table}&columndays=${columndays}`)
            .then(response => response.json())
            .then(records => {
                displayRecords(records);
            })
            .catch(error => console.error('Error fetching records:', error));
    }
    else {
        fetch(`/records2?column=${column}&value=${value}&fromYear=${fromYear}&toYear=${toYear}&email=${email}&table=${table}`)
            .then(response => response.json())
            .then(records => {
                displayRecords(records);
            })
            .catch(error => console.error('Error fetching records:', error));
    }

    // Clear input box if column is 'all'
    if (column === 'all') {
        document.getElementById('value').value = '';
    }


});

let displayedRecords = [];

// Function to display or clear records
function displayRecords(records) {
    const filteredRecordsDiv = document.getElementById('filteredRecords');
    // Clear previous content
    filteredRecordsDiv.innerHTML = '';

    if (records.hasOwnProperty('message')) {
        // Display the message
        const messageParagraph = document.createElement('p');
        messageParagraph.textContent = records.message;
        filteredRecordsDiv.appendChild(messageParagraph);

        // Hide the download button when no records are found
        document.getElementById('downloadButton').style.display = 'none';
    } else {
        // Display the table only if records are present
        const table = document.createElement('table');
        table.classList.add("table", "table-bordered", "table-light")
        const headerRow = document.createElement('tr');
        Object.keys(records[0]).forEach(header => {
            const th = document.createElement('th');
            th.textContent = header;
            headerRow.appendChild(th);
        });
        table.appendChild(headerRow);

        records.forEach(record => {
            const row = document.createElement('tr');
            Object.entries(record).forEach(([key, value]) => {
                const cell = document.createElement('td');
                if (key === 'file') {
                    // If the key is 'file', create a link to the PDF file
                    const link = document.createElement('a');
                    link.textContent = value;
                    link.href = `/files/${value}`;
                    link.target = '_blank'; // Open the link in a new tab
                    cell.appendChild(link);
                } else {
                    cell.textContent = value;
                }
                row.appendChild(cell);
            });
            table.appendChild(row);
        });

        filteredRecordsDiv.appendChild(table);

        // Store the displayed records in the global variable
        displayedRecords = records;

        // Show the download button
        document.getElementById('downloadButton').style.display = 'inline-block';
    }
}

// Event listener for download button
document.getElementById('downloadButton').addEventListener('click', function () {
    console.log("Download button clicked");
    const csvData = convertToCSV(displayedRecords);
    downloadCSV(csvData, 'table_data.csv');
});

// Function to convert records to CSV format
function convertToCSV(records) {
    const header = Object.keys(records[0]).join(',');
    const body = records.map(record => Object.values(record).join(',')).join('\n');
    return `${header}\n${body}`;
}

// Function to download a CSV file
function downloadCSV(csvData, filename) {
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}


