const namesKek = [
  ['Gil Daniel'],
  ['Mohammad Diaz'],
  ['Bradley Peters'],
  ['Uriah Figueroa'],
  ['Clinton Lane'],
  ['Perry Lyons'],
  ['Judah Harper'],
  ['Mufutau Rhodes'],
  ['Fletcher Rivera'],
  ['Marshall Hester'],
  ['Thor Wilson'],
  ['Quinlan Brock'],
  ['Chandler Merrill'],
  ['Reuben Jarvis'],
  ['Amos York'],
  ['Philip Pittman'],
  ['Lester Rush'],
  ['Ethan Chen'],
  ['Hu Weeks'],
  ['Geoffrey Phillips'],
  ['Kelly Chan'],
  ['Fitzgerald Arnold'],
  ['Geoffrey Frost'],
  ['Vincent Colon'],
  ['Trevor Cook'],
  ['Jordan Watkins'],
  ['Gannon Montgomery'],
  ['Amos Mcpherson'],
  ['Thane Cox'],
  ['Hilel Newman'],
  ['Keaton Alexander'],
  ['Mark Roy'],
  ['Xavier Leach'],
  ['Leonard Riggs'],
  ['Nolan Booth'],
  ['Quamar Mays'],
  ['Justin Haley'],
  ['James Green'],
  ['Brock Russo'],
  ['Garrett Mcmahon'],
  ['Rahim Farrell'],
  ['Brody Sawyer'],
  ['Cruz Salazar'],
  ['Griffin Gilmore'],
  ['Darius Reynolds'],
  ['Gareth Garrison'],
  ['Daquan Mcdowell'],
  ['Arden Holder'],
  ['Berk Kramer'],
  ['Jackson Gamble'],
  ['Ferdinand Fuentes'],
  ['Ezekiel Bradshaw'],
  ['Abel Goff'],
  ['Isaac Vasquez'],
  ['Lamar Bartlett'],
  ['Sylvester West'],
  ['Yoshio Cabrera'],
  ['Lev Kennedy'],
  ['Craig Meadows'],
  ['Ferdinand Figueroa'],
  ['Craig Figueroa'],
  ['Hasad Frank'],
  ['Darius Faulkner'],
  ['Hop Horton'],
  ['Darius Olsen'],
  ['Ulric Nichols'],
  ['Ronan Roberts'],
  ['Reuben Obrien'],
  ['Jameson Shaw'],
  ['Nathan Jensen'],
  ['Mason Alvarez'],
  ['Rudyard Tillman'],
  ['Alvin Ashley'],
  ['Tyrone Goodwin'],
  ['Jamal Moody'],
  ['Peter Hess'],
  ['Hayes Head'],
  ['Keaton Sloan'],
  ['Gavin Aguirre'],
  ['Philip Booth'],
  ['Barry Irwin'],
  ['Kenyon Henderson'],
  ['Yuli Banks'],
  ['Allen Bennett'],
  ['Daquan Glover'],
  ['James Higgins'],
  ['Ashton Lawson'],
  ['Dalton Hammond'],
  ['Ethan Randolph'],
  ['Tiger Head'],
  ['Nathaniel Snider'],
  ['Tanner Watts'],
  ['Brandon Waller'],
  ['Dane Warren'],
  ['Herrod Castillo'],
  ['Nigel Ellison'],
  ['Vernon Trevino'],
  ['Nasim Munoz'],
  ['Deacon Ramirez'],
  ['Zeph Hatfield'],
];

/**
 *
 * @param {Array.<Object>} source
 */
function getMockCategory(source, name, deepLevel) {
  if (deepLevel === 3) {
    return null;
  }

  const nestedItemsLength = Math.floor(Math.random() * 5) + 1;
  const nestedItems = [];

  for (let i = 0; i < nestedItemsLength; i++) {
    const randomIndex = Math.floor(Math.random() * source.length);
    const newDeepLevel = deepLevel + Math.floor(Math.random()) + 1;
    const category = getMockCategory(source, source[randomIndex], newDeepLevel);

    nestedItems.push(category);
  }

  return {
    name,
    nestedItems: nestedItems.filter(Boolean),
    link: name,
  };
}

export function getMockCategoryTree() {
  const flatNames = namesKek.map(nameArr => nameArr[0]);

  const categories = [];

  for (let i = 0; i < 20; i++) {
    categories.push(getMockCategory(flatNames, flatNames[i], 0));
  }

  return categories;
}
