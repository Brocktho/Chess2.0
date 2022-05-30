export const NoNoWords = () => {
  let badwords = [
    "nigger",
    "nigg3r",
    "ni6ger",
    "ni6g3r",
    "ni66er",
    "n1gger",
    "n1gg3r",
    "n16ger",
    "n16g3r",
    "n166er",
    "ni663r",
    "n1663r",
    "kike",
    "kik3",
    "k1ke",
    "k1k3",
    "f4ggot",
    "f46got",
    "f466ot",
    "f4gg0t",
    "f46g0t",
    "f4660t",
    "f4ggo7",
    "f46go7",
    "f466o7",
    "f4gg07",
    "f46g07",
    "f46607",
    "faggot",
    "fa6got",
    "fa66ot",
    "fagg0t",
    "fa6g0t",
    "fa660t",
    "faggo7",
    "fa6go7",
    "fa66o7",
    "fagg07",
    "fa6g07",
    "fa6607",
    "chin4m4n",
    "chin4man",
    "ch1n4man",
    "ch1n4m4n",
    "chinaman",
    "ch1naman",
    "chink",
    "ch1nk",
    "niglet",
    "nigl3t",
    "ni6let",
    "ni6l3t",
    "n1glet",
    "n1gl3t",
    "n16let",
    "n16l3t",
    "nigle7",
    "nigl37",
    "ni6le7",
    "ni6l37",
    "n1gle7",
    "n1gl37",
    "n16le7",
    "n16l37",
    "neeger",
    "n3eger",
    "n33ger",
    "nee6er",
    "n3e6er",
    "n336er",
    "n33g3r",
    "n3363r",
    "kneegor",
    "kn3egor",
    "kn33gor",
    "knee6or",
    "kn3e6or",
    "kn336or",
    "kneeg0r",
    "kn3eg0r",
    "kn33g0r",
    "knee60r",
    "kn3e60r",
    "kn3360r",
    "kniggor",
    "kni6gor",
    "kni66or",
    "kn1ggor",
    "kn16gor",
    "kn166or",
    "knigg0r",
    "kni6g0r",
    "kni660r",
    "kn1gg0r",
    "kn16g0r",
    "kn1660r",
    "knigger",
    "knigg3r",
    "kni6ger",
    "kni6g3r",
    "kni66er",
    "kn1gger",
    "kn1gg3r",
    "kn16ger",
    "kn16g3r",
    "kn166er",
    "kni663r",
    "kn1663r",
  ];
  // its not perfect, but a couple of runs should get all cases of weird spellings, or at least as many as i care to get right now.
  // commenting out until more words should be added or whatever is needed.
  /* let variants: Array<string> = [];
  const alphabets = {
    a: "4",
    b: "8",
    e: "3",
    g: "6",
    i: "1",
    o: "0",
    p: "9",
    s: "5",
    t: "7",
    z: "2",
  };
  for (const index in badwords) {
    let currentVars: string[] = [];
    const word = badwords[index];
    for (const [key, value] of Object.entries(alphabets)) {
      if (word.includes(key)) {
        let candidate = word.replace(key, value);
        if (!currentVars.includes(candidate)) {
          currentVars.push(candidate);
        }
      }
      for (const varInd in currentVars) {
        let varWord: string = currentVars[varInd];
        if (varWord.includes(key)) {
          let candidate = varWord.replace(key, value);
          if (!currentVars.includes(candidate)) {
            currentVars.push(candidate);
          }
        }
      }
      if (!currentVars.includes(word)) {
        currentVars.push(word);
      }
    }
    for (const varInd in currentVars) {
      let newVar = currentVars[varInd];
      if (!variants.includes(newVar)) {
        variants.push(newVar);
      }
    }
  } */
  return badwords;
};
