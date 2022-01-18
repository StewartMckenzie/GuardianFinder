const router = require('express').Router();
const bungieConnection = require('bungieConnect');

const collection = require('../db/collection');

// GET /history/search
router.get('/searchVaultedGuardian', (req, res) => {
  try {
    //Requires and search term
    const { searchedName } = req.query;
    let results = [];
    // search for results using the file-system "database"
    if (searchedName) {
      // search the db using the search term
      results = collection.search('searchedName', searchedName);
    } else {
      results = collection.search();
    }

    //respond with the results
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

module.exports = router;
