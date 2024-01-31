/* parses index.xml and each class file from JUCE Doxygen to generate a concise list
 * make sure to enable GENERATE_XML in Doxyfile */

const fs = require('node:fs');
const { XMLParser, XMLBuilder, XMLValidator} = require("fast-xml-parser");

let doxygenXmlPath = "/tmp/JUCE/docs/doxygen/xml";

async function getBrief(unit) {
  let classPath = doxygenXmlPath + '/' + unit['@_refid'] + '.xml';
  fs.readFile(classPath, (err, data) => {
    if (err) throw err;
    const parser = new XMLParser({ignoreAttributes: false});
    const klass = parser.parse(data);
    console.log(klass.doxygen.compounddef.briefdescription.para);
  });
}

fs.readFile(doxygenXmlPath + "/index.xml", (err, data) => {
  if (err) throw err;
  const parser = new XMLParser({ignoreAttributes: false});
  const index = parser.parse(data);
  var collection = [];

  index.doxygenindex.compound.forEach((unit) => {
    if (unit['@_kind'] == 'class') {
      collection.push({
        label: unit.name,
        url: "https://docs.juce.com/master/" + unit['@_refid'] + ".html"
      });
    }
  });

  fs.writeFile("../juce-docs/index.json", JSON.stringify(collection), (err) => {
    if (err) throw err;
  });
});
