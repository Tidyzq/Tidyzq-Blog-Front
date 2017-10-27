import Xml2js from 'xml2js'

const xmlParser = new Xml2js.Parser({explicitArray: false, ignoreAttrs: true})

export function xml2js (str) {
  return new Promise((resolve, reject) => {
    xmlParser.parseString(str, (err, data) => {
      if (err) { return reject(err) }
      resolve(data)
    })
  })
}
