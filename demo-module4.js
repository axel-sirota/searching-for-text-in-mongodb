// Always run `use pluralsight` to use the correct DB

// /Let's search for jennifer aniston movies!

db.movies.find({$text: {$search: "jennifer aniston"}}, {_id:0, title:1, plot:1})

// Ordering by score to be less random!

db.movies.find({$text: {$search: "jennifer aniston"}}, {_id:0, title:1, plot:1, score: {$meta: "textScore"}}).sort({score: {$meta: "textScore"}})

// We see a lot of movies where she did not star! However the DB is not normalized (Sometimes is Jennifer Aniston, sometimes Jenifer Aniston)

// As she is an actress, lets try to give actors more weight!

db.movies.dropIndexes()

db.movies.createIndex({"$**": "text"}, { weights: {"actors" :5}})

// We see now that more Jennifers appear! Lets filter that by surname

db.movies.find({$text: {$search: "jennifer \"aniston\""}}, {_id:0, title:1, plot:1, score: {$meta: "textScore"}}).sort({score: {$meta: "textScore"}})

db.movies.explain("executionStats").find({$text: {$search: "jennifer \"aniston\""}}, {_id:0, title:1, plot:1, score: {$meta: "textScore"}}).sort({score: {$meta: "textScore"}})

