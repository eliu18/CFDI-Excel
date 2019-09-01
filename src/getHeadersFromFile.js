let fs = require("fs");
const getLogger = require('./logger');
const log = getLogger('main');

function readFile(file) {
    return new Promise((resolve, reject) => {
        log.debug('reading file:',file);
        fs.readFile(file, 'utf8', (error, data) => {
            if (error)
                reject(error);
            else {
                resolve(data);
            }
        });
    });

}

function getHeadersFromFile(path) {
    if(!path) throw Error("getHeadersFromFile debe recibir un nombre de archivo");
    log.debug("Error llamada desde getHeaaderFromFile",path);
    return readFile(path).then((data) => {
        let headers = {
            headers: [],
            order: { column: -1, ascending: true }
        }
        //parsing....
        let headersData = data.split("\n");

        headers.headers = headersData.map((header, position) => {
            
            header = header.trim().replace(/\s\s+/g, ' ');
            let splitHeaders = header.split(" ");
            if (splitHeaders[1] == 'ordenar') {
                headers.order.column = position;
            }
            if (splitHeaders[2] == 'descendente') {
                headers.order.ascending = false;
            }
            return splitHeaders[0];
        });
        return headers;

    });
};


module.exports = getHeadersFromFile;