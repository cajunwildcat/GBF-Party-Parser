# GBF Party Wiki Exporter

Bookmarklet that generates a gbf.wiki formatted TeamSpread of the currently open team page and copies it to your clipboard.

## Installation

- Copy [this](https://raw.githubusercontent.com/cajunwildcat/GBF-Party-Parser/main/bookmarklet) code and paste it into the URL bar of a new bookmark in the browser you use to play GBF.
- Go to a party team and press click the bookmark
- Click the okay button in the pop-up to have the team copied to your clipboard for easy pasting access.

## Why use this bookmarklet

This bookmarklet makes use of a kept up to date databse of character and summon IDs in this repo to get more accurate names. This means it is able to accurate differentiate between characters with multiple versions such as `Vira` and `Vira (Grand)`. The names are set according to the page names on the gbf.wiki so you should not have to edit anything.

A smaller feature, but opening the estimated damage panel in order to get more accurate Support Summon data.

## Limitations

- Newly added characters and summons will not be grabbed properly and break functionality. Please wait a day or two after their release before using the bookmarklet on teams including them.
- To get more accurate Support Summon data (LB & Transcendence) you have to open the Estimated Damage panel at least once. Afterwards you can close it and use the bookmark as much as you want until you reload the page or switch teams.
  - Otherwise only the summon name will be filled out.
- More detailed information about characters such as their EMPs or Awakening is not available to be extracted from the game on the team page, so these cannot be automatically filled out.

## Developer Installation

If for some reason you are interested in cloning, the data for `summons.json` and `characters.json` can be regenerated by simply running `database-builder.py`. If there is an update to this data and you manage to catch it before I do, feel free to open a PR with the updated files.

### Update Log
Version 2.2:
 - Updated summon uncaps to not include the max uncap specifier (mlb,flb,tlb) in accordance with the updated SummonGrid template on the wiki.
  - As such, `summons.json` no longer has data for `evo_max` of each summon.

Version 2.1: 
 - Fixed an issue with Support Summon parsing

Version 2 (04/05/2024):
 - Changed from making API calls to the gbf.wiki to fetching a static database in this repo that will be manually updated
 - Refactored some code in reference to the above and extrapolating filling out summon data for main and sub summons to a helper function
 - Released as a publicly available verison!

Version 1.2:
 - Fixed support for character transcendence
 - Fixed caching of version number
 - Used better JS minifier extrapolated setting character data in TeamSpread to helper functions

Version 1.1:
 - Fixed support summons incorrectly getting transcendence levels
 - Fixed Ultima and CCW Weapons not having their element in their names
 - Changed character art to be based on uncap level instead of currently set art
 - Extrapolated setting weapon data in TeamSpread to helper functions

Version 1 (01/05/2024):
 - First "complete" version with features for exporting regular parties with correct wiki name for character variants