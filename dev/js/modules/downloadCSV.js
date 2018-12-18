define([
  "jquery"
], function (
  $
) {

  // Convert a row of values to a  CSV-compatible string.  If a value contains
  // any commas, then it needs to be wrapped in double-quotes (and in turn, any
  // double-quotes that the value contains must be replaced with two
  // double-quote characaters)
  function valuesToTextRow(values)
  {
    return $.map(values, function(v){
      if (v==null || v==undefined || v == "") return "";
      if (v===false) return "0";
      if (v===true) return "1";
      if (v && /,/g.test(v)) return '"' + v.replace(/"/g,'""') + '"';
      if (v) return v.toString().replace(/\r/g, " ").replace(/\n/g, " ");
    }).join(",") + "\r\n";
  }

  return {
    downloadMarkersAsCSV: function(markers, filename, sortby){

      if (sortby) markers.sort(function(a,b){
        var aValue = (a.options.feature.properties[sortby] || '').toString(),
          bValue = (b.options.feature.properties[sortby] || '').toString();
        if (aValue.toLowerCase() < bValue.toLowerCase()) return -1;
        if (aValue.toLowerCase() > bValue.toLowerCase()) return 1;
        return 0;
      });

      // Get column headers:
      var columns = Object.keys(markers[0].options.feature.properties);

      // Get column headers as a CSV-compatible string:
      var csvText = valuesToTextRow(columns);

      // For each marker, convert it's values to a CSV-compatible text string,
      // with the values in the same order as the column headers:
      $.each(markers, function(i, marker){
        var values = [];
        $.each(columns, function(i, column){
          values.push(marker.options.feature.properties[column]);
        });
        csvText += valuesToTextRow(values);
      });

      // Initiate a download of the text as a file:
      var a = document.createElement('a');
      if (navigator.msSaveBlob) { // IE10
        navigator.msSaveBlob(new Blob([csvText], {
          type: mimeType
        }), filename);
      } else if (URL && 'download' in a) { //html5-compatible (Chrome, FF, etc.)
        a.href = URL.createObjectURL(new Blob([csvText], {
          type: "text/csv;encoding:utf-8"
        }));
        a.setAttribute('download', filename);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else {  // other browsers?
        location.href = 'data:application/octet-stream,' +
          encodeURIComponent(content);
      }
    }
  }
});
