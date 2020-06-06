// Always run `use pluralsight` to use the correct DB

// /Let's search for lofts in tribeca!

// First lets drop the previous indexes and create a new one!

db.rent.dropIndexes()
db.rent.createIndex({"name": "text", "neighbourhood_cleansed": "text", "description": "text"})

db.rent.find({$text: {$search: "tribeca loft"}}, {_id:0, name:1, neighbourhood_cleansed:1})

// Seems odd, and many results are not from tribeca!

db.rent.find({$text: {$search: "tribeca loft"}}, {_id:0, name:1, neighbourhood_cleansed:1, score: {$meta: "textScore"}}).sort({score: {$meta: "textScore"}})

// That looks better! However if we check there are lots of NOT tribeca results with high score!

db.rent.find({$text: {$search: "tribeca loft"}, neighbourhood_cleansed: {$ne: "Tribeca"}}, {_id:0, name:1, neighbourhood_cleansed:1, score: {$meta: "textScore"}}).sort({score: {$meta: "textScore"}})

// Lets give more weight to neighborhood!

db.rent.dropIndexes()

db.rent.createIndex({"name": "text", "neighbourhood_cleansed": "text", "description": "text"}, { weights: {neighbourhood_cleansed:5}})

// Noticed how long it starts to take?

db.rent.find({$text: {$search: "tribeca loft"}, neighbourhood_cleansed: {$ne: "Tribeca"}}, {_id:0, name:1, neighbourhood_cleansed:1, score: {$meta: "textScore"}}).sort({score: {$meta: "textScore"}})

// Now it looks better! we can make a cut in our app for score > 5 for example!

//Maybe a better strategy will be to partition the index (but loose the ability of searching full text in neighborhoods!)

db.rent.dropIndexes()
db.rent.createIndex({"neighbourhood_cleansed":1, "name": "text", "description": "text"})

db.rent.explain("executionStats").find({$text: {$search: "loft"}, neighbourhood_cleansed: "Tribeca"}, {_id:0, name:1, neighbourhood_cleansed:1, score: {$meta: "textScore"}}).sort({score: {$meta: "textScore"}})

// What happens if we try to break the rules? If we try to fo a full text but the other indexed field put in negation

db.rent.find({$text: {$search: "tribeca loft"}, neighbourhood_cleansed: {$ne: "Tribeca"}}, {_id:0, name:1, neighbourhood_cleansed:1, score: {$meta: "textScore"}}).sort({score: {$meta: "textScore"}})

// ERROR!! Of course, we know that the text index is supedited to the first hashtable! So Mongo complains
// if it has to go search full text in many places! 