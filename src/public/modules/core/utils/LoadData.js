/**
 * This contains pure JavaScript code to load data from a file. We need this
 * to go around the fact that FileRead interface in TypeScript is not mature
 */

/**
 * Function to read the eagle.xls files and convert them to an array of arrays
 * @param  {[type]}   file     [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
function xlsFileReader(file, callback) {
    var fileR = new FileReader();
    fileR.addEventListener('load', function(ev) {
        if (ev.target.result) {
            // Parse the table inside
            // This is as ugly as it gets
            try {
                var xml = $("<div>" + ev.target.result); // table is the last element in the parsed list
                var rowsTable = xml.find('table').find('tr');
            } catch (e) {
                alert("Loading of the Eagle file failed. Please restart the browser and try again.");
            }
            var cols = []; // will  contain the column names
            var rows = []; // will contain the rows
            $.each(rowsTable, function(i, el) {
                if (i === 0) { // first row, headers
                    cols = $.map($(el).find('th'), function(eel) {
                        return $(eel).text();
                    });
                } else {
                    var row = $.map($(el).find('td'), function(eel) {
                        // The text in eagle files is complete CRAP. Needs a lot of cleaning
                        return $(eel).text()
                            .replace(/(\r\n|\n|\r)/gm, "") // remove the plethora of ENTERS
                            .trim() // remove leading space
                        ;
                    });
                    rows[i - 1] = row;
                }
            });

            callback(cols, rows);
        }
    });
    fileR.readAsText(file);
}

/**
 * Read a pdf file and give it to the callback as an ArrayBuffer
 * @param  {File}   file     The file to upload
 * @param  {Function} callback (ArrayBuffer) => void
 */
function pdfFileReader(file, callback) {
    var reader = new FileReader();
    reader.onload = function(loadEvent) {
        var result = loadEvent.target.result;
        console.log('Loaded pdf of length: ', result.byteLength);
        callback(result);
    };
    reader.readAsArrayBuffer(file);
}

/**
 * Read a text file. 
 * @param  {[type]}   file     [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
function textFileReader(file, callback) {
    var reader = new FileReader();
    reader.onload = function(loadEvent) {
        var result = loadEvent.target.result;
        callback(result);
    };
    reader.readAsText(file);
}

function csvFileReader(file, callback) {
    let reader = new FileReader();
    reader.onload = function(loadEvent) {
        let result = loadEvent.target.result;
        let allTextLines = result.split(/\r\n|\n/);
        let headings = allTextLines[0].split(',');
        let lines = [];

        //entries = allTextLines[0].split(',');
        for (var i = 1; i < allTextLines.length; i++) {
            var data = allTextLines[i].split(',');
            if (data.length == headings.length) {
                var tarr = [];
                for (var j = 0; j < headings.length; j++) {
                    tarr.push(data[j]);
                }
                lines.push(tarr);
            } else if (data.length == 15) {
                var tarr = [];
                for (var j = 0; j < 15; j++) {
                    tarr.push(data[j]);
                }
                lines.push(tarr);
            }
        }
        callback(lines);
    }
    reader.readAsText(file);
}