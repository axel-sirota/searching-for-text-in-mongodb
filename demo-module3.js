// Always run `use pluralsight` to use the correct DB

// Let's create a compound text index!

db.rent.createIndex({"name": "text", "space": "text"})

// Understanding case sensitivenes

db.rent.find({$text : {$search : "Tribeca", $caseSensitive:true}}, {_id:0, name: 1})
db.rent.find({$text : {$search : "tribeca", $caseSensitive:true}}, {_id:0, name: 1})
db.rent.find({$text : {$search : "TriBeCa", $caseSensitive:true}}, {_id:0, name: 1})

// When there is capitalization on the suffix (exact match!)

db.rent.find({$text : {$search : "br", $caseSensitive:true}}, {"name":1})
db.rent.find({$text : {$search : "bR", $caseSensitive:true}}, {"name":1})

// Understanding diacritic sensitiveness (exact match!)

> db.rent.find({$text : {$search : "Namasté", $diacriticSensitive: false}}, {name:1})
> db.rent.find({$text : {$search : "Namasté", $diacriticSensitive: true}}, {name:1})
> db.rent.find({$text : {$search : "Namaste", $diacriticSensitive: false}}, {name:1})
> db.rent.find({$text : {$search : "Namaste", $diacriticSensitive: true}}, {name:1})

