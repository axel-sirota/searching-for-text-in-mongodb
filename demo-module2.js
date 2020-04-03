// First run mongoimport -d pluralsight -c rent --file newyork-rent.csv --type csv --headerline --drop

//Running a query, verify it is exact match

db.rent.find({name: "Tribeca"})

// Create the index

db.movies.createIndex({title: "text"})

// Running the same query, now is full text search.

> db.rent.find({$text: {$search: "Tribeca"}}, {_id:0, "name":1})

// Get only Loft apaertment in tribeca!

> db.rent.find({$text: {$search: "\"Tribeca\" loft"}}, {_id:0, "name":1}) // check the order does not matter!

// Confirm that by lowercase and stemming, we get the same results with Tribeca, TriBeca and TriBeCa

> db.rent.find({$text: {$search: "Tribeca"}}).count()
185
> db.rent.find({$text: {$search: "TriBeca"}}).count()
185
> db.rent.find({$text: {$search: "TriBeCa"}}).count()
185


// Getting rentals in tribeca that ARE NOT lofts

db.rent.find({$text : {$search : "Tribeca -loft"}}, {name: 1})

// Getting rentals in Tribeca or East Village that are not Lofts!


db.rent.find({$text : {$search : "Tribeca \"East Village\" -loft"}}, {name: 1})

// Going crazy, explaining:

> db.rent.find({$text : {$search : "\"bedroom\" apartment"}}, {name: 1}).count()
8719
> db.rent.find({$text : {$search : "bedroom"}}, {name: 1}).count()
8701
> db.rent.find({$text : {$search : "\"bedroom\" apartment -bedroom"}}, {name: 1}).count() // What is going on here?!
18