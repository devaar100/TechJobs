//var csv is the CSV file with headers
function csvJSON(csv){

    var lines = csv.split("\n");

    var result = [];

    // NOTE: If your columns contain commas in their values, you'll need
    // to deal with those before doing the next step
    // (you might convert them to &&& or something, then covert them back later)
    // jsfiddle showing the issue https://jsfiddle.net/
    var headers=lines[0].split(",");

    for(var i=1;i<lines.length;i++){

        var obj = {};
        var currentline=lines[i].split(",");

        for(var j=0;j<headers.length;j++){
            let val = currentline[j]
            if(!isNaN(val)) val = parseInt(val)
            obj[headers[j]] = val;
        }

        result.push(obj);
    }
    console.log(result)
}

function readTextFile(file)
{
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                csvJSON(allText)
            }
        }
    }
    rawFile.send(null);
}

readTextFile('/TechJobs/data.csv')