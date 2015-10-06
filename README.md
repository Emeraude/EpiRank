# EpiRank
## Setup

```bash
cp config.json.default config.json
mysql -u root -p < db.sql
```

## Usage
### Crawler

```bash
./crawler.js
```

### Server

```bash
./server.js
```

Open **localhost:8080** in your browser and you will get an epirank!  

### API
#### GET /api/:login

Get all the informations about a student:
```json
{
	"login": "broggi_t",
	"firstname": "thibaut",
	"lastname": "broggi",
	"promo": "2018",
	"createdAt": "2015-10-05 22:30:18",
	"modifiedAt": "2015-10-05 22:30:18",
	"gpaBachelor": "3.58",
	"gpaMaster": null,
	"city": "FR/PAR",
	"credits": "125",
	"availableSpices": "30",
	"consumedSpices": "240"
}
```

#### GET /api/:promo

Get an array containing each etudiant in the promotion **promo**

#### GET /api/:promo/:city

Get an array containing each etudiant in the promotion **promo** and the city **city**  
The city is identified by a 3 digits code. They are: **PAR**, **STG**, **NAN**, **NCY**, **LIL**, **NCE**, **TLS**, **BDX**, **LYN**, **MAR**, **REN** and **MPL**.

#### Exemples

```
curl localhost:8080/api/2018/PAR # Get the informations about each parisian student in promotion 2018
curl localhost:8080/api/broggi_t # Get the informations about broggi_t
```

### Author

Emeraude
