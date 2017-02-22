
// - find and replace semi colons to csv in restaurants_info.csv (used sublime)

// - used npm csvtojson to convert csv to json objects
//  `csvtojson restaurants_info.csv > restaurants_info.json`

// - Using node, run the manipulate_data.js file & write to single json file (all_data.json)

// - Import all_data.json into Algolia using dashboard import

var fs = require("fs");
var _ = require('underscore');
var info = JSON.parse(fs.readFileSync("./project-files/resources/dataset/restaurants_info.json"));
var list = JSON.parse(fs.readFileSync("./project-files/resources/dataset/restaurants_list.json"));

// info = restaurant info json, list = restaurant list json
function matchJSON(info, list) {  
  var newArray = []

  info.forEach(function (i) {
    // convert objectID to int because csvtojson processes this as int
    i["objectID"] = parseInt(i["objectID"])
    list.forEach(function (l) {
      if (i["objectID"] == l["objectID"]) {
        // extend both objects
        newArray.push(_.extend(i, l))
      }
    })
  })
  return newArray
}

var allData = matchJSON(info, list)

fs.writeFile('all_data.json', JSON.stringify(allData), (err) => {
  if (err) throw err;
  console.log('Success!');
});

