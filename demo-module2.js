// First run mongoimport -c movies -d pluralsight --file movieDetails.json to populate the DB

//Running a query, verify it is exact match

db.movies.find({title: "Toy story 3"})

// Create the index

db.movies.createIndex({title: "text"})

// Running the same query, nos is full text search.

db.movies.find({$text : {$search : "Toy Story"}}, {title: 1})

// Get only the Toy Story movies

db.movies.find({$text : {$search : "\"Toy Story\""}}, {title: 1})


// Get movies with a title having "return" and NOT having "wars"

db.movies.find({$text : {$search : "\"return\" -wars"}}, {title: 1})

// Get movies with a title having (return OR star) but NOT having "wars"


db.movies.find({$text : {$search : "return star -wars"}}, {title: 1})
