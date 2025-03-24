export const checkEmail = (email) => {
  const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
  return regex.test(email);
}

export const gitInit = (name) => {
  const words = name.split(" ");
  let init = "";
  for(let i = 0; i < Math.min(words.length, 2); i++) {
    const firstLetter = words[i].split("")[0].toUpperCase()
    init += firstLetter;
  }
  return init;
}
