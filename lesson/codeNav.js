const h4List = Array.from(document.getElementsByClassName('caption'));

let cnt = 0;
for (const h4 of h4List) {
  h4.id = 'code' + cnt;
  cnt += 1;
}

const select = document.querySelector('.codeNav select');
for (const h4 of h4List) {
  let el = h4.firstElementChild;
  if (el.tagName == 'NOBR') {
    el = el.firstElementChild;
  }

  const span = document.createElement('span');
  span.textContent = el.textContent + ' - ';
  const capt = el.nextSibling;
  const text = document.createTextNode(capt.textContent.trim());
  if (capt.nextSibling.tagName == 'WBR') {
    text.textContent += '...';
  }

  const opt = document.createElement('option');
  opt.value = h4.id;
  opt.appendChild(span);
  opt.appendChild(text);
  select.appendChild(opt);
}

select.addEventListener('change', (ev) => {
  location.hash = ev.currentTarget.value;
});

document
  .getElementsByClassName('back')[0]
  .lastElementChild.addEventListener('click', () => {
    select.value = 'init';
  });
