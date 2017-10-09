import xml2js from 'xml2js'

const xmlParser = new xml2js.Parser({explicitArray: false, ignoreAttrs: true})

export default function (str) {
  return new Promise((resolve, reject) => {
    xmlParser.parseString(str, (err, data) => {
      if (err) { return reject(err) }
      resolve(data)
    })
  })
}
