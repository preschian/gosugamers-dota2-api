const gosu = 'http://www.gosugamers.net'

exports.link = url => {
  return `${gosu}${url}`
}

exports.match = () => {
  return this.link('/dota2/gosubet')
}
