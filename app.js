//////////////////////////////////////////////////////////////////////////////////////////
// CHANGE THESE 
// YOU MUST WHITELIST YOUR IP ON NAME.COM'S API PAGE
//////////////////////////////////////////////////////////////////////////////////////////
const FILE = "words.txt"
const EXTENSION = ".one"
const USER = 'USER_NAME'
const API_KEY = '222222222224333333333334e5545'
const MIN_LENGTH = 3 
const MAX_LENGTH = 10
//////////////////////////////////////////////////////////////////////////////////////////

const fs = require('fs')
const request = require('request')
const readline = require('readline')

const input = fs.createReadStream(FILE)

var lines = []

let rl = readline.createInterface({
	input: input	
});

rl.on('line', (line) => {
	if (line.length <= MAX_LENGTH  && line.length >= MIN_LENGTH) {
		lines.push(line)
	}
}).on('close', () => {
	checkDomains().then( (data) => {
		console.log(data)
	}).catch( (err) => {
		console.log(err)
	})
})

async function checkDomains() {

	let i = 0;

	while (i < lines.length) {

		let domains = ""

		sliceOfLines = lines.slice(i, i+50)

		for ( line of sliceOfLines ) {
			domains += `"${line}${EXTENSION}",`
			//let domains = domains `${line[i]}.one`
			i++;
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

		p = new Promise( (resolve, reject) => {
			request(options, (error, response, body) => {
				if (!error && response.statusCode == 200) {
					results = JSON.parse(body)["results"]
					for ( let result of results ) {
						if ( "purchasePrice" in result ) {
							// This can be used to avoid premium domains for certain extensions 
							//if (result["purchasePrice"] == "19.99" ) {
								console.log(result["domainName"] )	
							//}
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
