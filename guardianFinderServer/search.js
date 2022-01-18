const router = require('express').Router();
const bungieConnection = require('bungieConnect');

const collection = require('../db/collection');

//A helper function that takes readable platform names and converts it to a number representing that platform on the bungie api
const parsePlatform = async (platform) => {
  switch (platform) {
    case 'xbox':
      return 1;
      break;
    case 'psn':
      return 2;
      break;
    case 'steam':
      return 3;
      break;
    default:
      return -1;
  }
};

//Turns the array of profile objects returned by the bungie api into readable relevant information for the user
const generatePlayers = (rawProfilesList) => {
  return rawProfilesList.map((player) => {
    return {
      playerName: player.displayName,
      playerId: player.membershipId,
      platform: player.membershipType,
    };
  });
};

// Turns the raw profile object containing player stats into readable object for the user
const parseStats = (playerProfile) => {
  //destructuring the pvp stats from the selected profile
  const { allPvP } = playerProfile;

  //If the selected player has never done pvp return text saying so
  if (Object.keys(allPvP).length === 0) {
    return 'This gaurdian has never entered the crucible.';
  }

  //Destructuring all of the pvp data possible
  const { allTime } = allPvP;

  //destructuring each respective stat object
  const {
    kills,
    deaths,
    assists,
    longestKillSpree,
    suicides,
    weaponKillsMelee,
    averageLifespan,
    winLossRatio,
    secondsPlayed,
  } = allTime;

  //create a stats object
  let stats = {};

  //add each stat object into an array
  const rawStats = [
    kills,
    deaths,
    assists,
    longestKillSpree,

    suicides,
    weaponKillsMelee,
    averageLifespan,
    winLossRatio,
    secondsPlayed,
  ];

  //for each stat object in the rawStats array
  //Use its "statId" or name as a ket in our stat object
  // and then use the 'basic' and 'value' keywords for get that stats value from the stat object
  //return the readable version of the stats
  rawStats.forEach((StatObject) => {
    stats[StatObject['statId']] = StatObject['basic']['value'];
  });

  return stats;
};

router.get('/findGuardian', async (req, res) => {
  try {
    //The destiny api requires a search name and a platform
    const { searchedName, platform = -1 } = req.query;

    //use helper functions to parse the platform
    const parsedPlatform = await parsePlatform(platform);

    //make a request to the bungie api for a list of player based on our searchedName
    const rawProfilesList = await bungieConnection.requestPlayers(
      searchedName,
      parsedPlatform,
    );

    //parse the raw info into a readable player list
    const playersList = generatePlayers(rawProfilesList);

    //Get the count of results
    const resultsCount = playersList.length;

    //time stamp it
    const timeStamp = new Date();

    //Record the search in our db
    collection.add({
      searchedName,
      timeStamp,
      resultsCount,
    });

    //Return an object with the searched name, platform, and player list so the user can post
    res.json({ searchedName, platform, playersList });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

router.post('/vaultGuardian', async (req, res) => {
  try {
    //user must post the chosen vaultedGaurdian,their id,and what platform they areon

    const { vaultedGuardian, vaultedGuardianId = 0, platform = -1 } = req.body;
    //is the id or platform is not passed send an error
    if (vaultedGuardianId == 0 || platform == -1) {
      console.log('hi');
      res.status(406).json({
        error: `You must enter a platform and a guardian Id in the post body!`,
      });
      return;
    } else {
      //send a request to the bungie api for more info on the selected guardian
      const playerProfile = await bungieConnection.requestProfile(
        vaultedGuardianId,
        platform,
      );

      //Parses the stats object that is returned
      const stats = parseStats(playerProfile);

      // respond with the guardian and their stats
      res.json({ vaultedGuardian, stats });
    }
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

module.exports = router;
