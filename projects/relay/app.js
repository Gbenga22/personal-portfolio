const handoffs = [
  { task: 'Check in after the pharmacy visit', owner: 'Amina', time: '09:20', done: true },
  { task: 'Confirm transport plan for Thursday', owner: 'Tunde', time: '10:45', done: false },
];

function render() {
  document.querySelector('#timeline').innerHTML = handoffs
    .map(
      (item, index) =>
        `<article class="item ${item.done ? 'done' : ''}"><div class="meta"><span>${item.time} · ${item.owner}</span><span>${item.done ? 'Complete' : 'Open'}</span></div><strong>${item.task}</strong>${item.done ? '' : `<button data-index="${index}">Mark complete</button>`}</article>`,
    )
    .join('');
  document.querySelectorAll('[data-index]').forEach((button) => {
    button.onclick = () => {
      handoffs[Number(button.dataset.index)].done = true;
      render();
    };
  });
}

document.querySelector('#form').onsubmit = (event) => {
  event.preventDefault();
  handoffs.push({
    task: document.querySelector('#task').value,
    owner: document.querySelector('#owner').value,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    done: false,
  });
  event.target.reset();
  render();
};
render();