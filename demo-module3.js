// Always run `use pluralsight` to use the correct DB

// Understanding diacritic sensitivity

db.movies.find({$text: {$search: "Shintaro", $diacriticSensitive: true}})
db.movies.find({$text: {$search: "Shintaro", $diacriticSensitive: false}})

// Understanding different language tokenizations


db.movies.find({$text: {$search: "t'aime", $diacriticSensitive: true}}, {_id:0, title:1})
db.movies.find({$text: {$search: "aime", $diacriticSensitive: true}}, {_id:0, title:1})
db.movies.find({$text: {$search: "aime"}}, {_id:0, title:1})


// Understanding case sensitivenes?

db.movies.find({$text: {$search: "P!nk"}}, {_id:0, title:1})
db.movies.find({$text: {$search: "p!nk", $caseSensitive: true}}, {_id:0, title:1})
