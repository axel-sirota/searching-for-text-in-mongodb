// Lets import the data mongoimport -d pluralsight -c countries --drop --file countries.json

// Always run `use pluralsight` to use the correct DB

db.countries.findOne()

// We see we got continents and countries in multiple languages!

//Let's try to create a text index

db.countries.createIndex({"Country Name": "text", "iso": "text"})


db.countries.find({$text: {$search: "United"}}) // Works!

//However this is an english index, therefore what happens if we start to query another language?

db.countries.find({$text: {$search: "United", $language: "de"}})

// The reason for this is that in german, United is not stemmed so Mongo will search for united
// While the words in the index (english one) is unite (since the d can be interpreted as a conjunction)!

//What happens if we create a german index and do the same?

db.countries.dropIndexes()
db.countries.createIndex({"Country Name": "text", "iso": "text"}, {default_language: "german"})

// lets also filter by "iso" marker "US"

db.countries.find({$text: {$search: "United", $language: "en"}, "iso": "US"})
// { "_id" : ObjectId("55a0f1d420a4d760b5fc2b2c"), "Country Name" : "Statele Unite ale Americii", "Language" : "ro", "iso" : "US" }

db.countries.find({$text: {$search: "United", $language: "de"}, "iso": "US"})
// { "_id" : ObjectId("55a0f1d420a4d760b5fc2af6"), "Country Name" : "United States", "Language" : "en", "iso" : "US" }

// Interesting! If the text operator stems in english, but the index is indexed in german, we get USA in other languages!
// In the same way, using german as the stemming on the text operator, we get the correct "expected" result, the english one!  Querying in german!

// What happens if we set the language as none in the index? It should "just work"!

db.countries.dropIndexes()
db.countries.createIndex({"Country Name": "text", "iso": "text"}, {default_language: "none"})

db.countries.find({$text: {$search: "United", $language: "de"}, "iso": "US"})
// { "_id" : ObjectId("55a0f1d420a4d760b5fc2af6"), "Country Name" : "United States", "Language" : "en", "iso" : "US" }

db.countries.find({$text: {$search: "United", $language: "en"}, "iso": "US"})

db.countries.find({$text: {$search: "United", $language: "none"}, "iso": "US"})
// { "_id" : ObjectId("55a0f1d420a4d760b5fc2af6"), "Country Name" : "United States", "Language" : "en", "iso" : "US" }


// Again, this is because of stemming, in none and german we use the whole word, but in romance languages we stem
// Always be prepared for surprises! What can we do?!

// Lets use the language field! But our field is named Language, so we use language_override field!


db.countries.dropIndexes()
db.countries.createIndex({"Country Name": "text", "iso": "text"}, {language_override: "Language"})

db.countries.find({$text: {$search: "United"}, "iso": "US"})
// { "_id" : ObjectId("55a0f1d420a4d760b5fc2b11"), "Country Name" : "Stati Uniti", "Language" : "it", "iso" : "US" }
// { "_id" : ObjectId("55a0f1d420a4d760b5fc2af6"), "Country Name" : "United States", "Language" : "en", "iso" : "US" }
// { "_id" : ObjectId("55a0f1d420a4d760b5fc2b2c"), "Country Name" : "Statele Unite ale Americii", "Language" : "ro", "iso" : "US" }

db.countries.find({$text: {$search: "United", $language: "de"}, "iso": "US"})

db.countries.find({$text: {$search: "United", $language: "none"}, "iso": "US"})

// SUCCESS! Setting these we could get the correct results! Note that the none language did not return anything, 
// even though the default index is none on the text index!

