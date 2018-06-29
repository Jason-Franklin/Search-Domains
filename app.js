//////////////////////////////////////////////////////////////////////////////////////////
// CHANGE THESE 
// YOU MUST WHITELIST YOUR IP ON NAME.COM'S API PAGE
//////////////////////////////////////////////////////////////////////////////////////////
const FILE = "words.txt"
const EXTENSION = ".one"
const USER = 'USER'
const API_KEY = 'AAAAAAAAAAAAAAA'
const PRICE_THRESHOLD = "49.99" // Anything above this price is filtered from results
const MIN_LENGTH = 3 
const MAX_LENGTH = 10
const MAX_PER_API_CALL = 50 // Name.com API limits this to 50
//////////////////////////////////////////////////////////////////////////////////////////

const fs = require('fs')
const request = require('request')
const readline = require('readline')

const input = fs.createReadStream(FILE)

var lines = []

var rl = readline.createInterface({
	input: input	
});

rl.on('line', line => {	

	if (line.length <= MAX_LENGTH  && line.length >= MIN_LENGTH) { lines.push(line) }

}).on('close', () => {

	checkDomains().then( (data) => {
		console.log(data)
	}).catch( (err) => {
		console.log(err)
	})

})

async function checkDomains() {

	let i = 0

	while (i < lines.length) {

		let domains = ""
		for ( line of lines.slice(i, i += MAX_PER_API_CALL) ) { // Notice the += here
			domains += `"${line}${EXTENSION}",`
		}

		domains = domains.slice(0, -1) // Remove trailing comma

		let dataString = `{"domainNames":[${domains}]}`
			let options = {
				url: 'https://api.name.com/v4/domains:checkAvailability',
				method: 'POST',
				body: dataString,
				auth: {
					'user': USER,
					'pass': API_KEY
				}
			}

			let p = new Promise( (resolve, reject) => {
				request(options, (error, response, body) => {
					if (!error && response.statusCode == 200) {
						results = JSON.parse(body)["results"]
						for ( let result of results ) {
							if ( "purchasePrice" in result ) {
								if (parseFloat(result["purchasePrice"]) <= PRICE_THRESHOLD ) {
									console.log(result["domainName"] )	
								}
							}
						}
						resolve("SUCCESS")
					} else {
						reject("FAILURE")
					}
				})
			})

			await p

	}
}
