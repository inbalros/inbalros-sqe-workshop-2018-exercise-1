import $ from 'jquery';
import {parseCode} from './code-analyzer';
import {getModel} from './code-analyzer';

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        parseCode(codeToParse);
        let model = getModel();
        let htmlTable = createTable(model);
        document.getElementById('tableWrapper').innerHTML = htmlTable;
        //$('#parsedCode').val(JSON.stringify(parsedCode, null, 2));
    });
});

function compare(a,b) {
    if (a.line < b.line)
        return -1;
    if (a.line > b.line)
        return 1;
}

function createTable(model)
{
    model.sort(compare);

    var inerHtmlTable ='<div><table border="1">\n ';
    for (var i = 0; i < model.length; i++) {
        inerHtmlTable += '<tr>';
        inerHtmlTable += '<td>'+(model[i].line + '</td><td>' + model[i].type + '</td><td>' + model[i].name + '</td><td>' + model[i].condition + '</td><td>' + model[i].value +'</td>');
        inerHtmlTable += '</tr>\n';
    }

    return inerHtmlTable;
}