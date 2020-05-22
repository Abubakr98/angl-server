const words = document.getElementsByClassName('sets-words__col_word-wordset-global-mobile-width');
const arr = [];
for (let i = 0; i < words.length; i++) {
  const el = words[i];
  arr.push({
    en: el.firstElementChild.innerText,
    ua: el.lastElementChild.innerText,
    group: 'top100diesliv',
  });
}
console.log(JSON.stringify(arr));
