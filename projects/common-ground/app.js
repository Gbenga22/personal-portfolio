const votes = { garden: 8, library: 5, seating: 7 };

function render() {
  const total = Object.values(votes).reduce((sum, value) => sum + value, 0);
  Object.entries(votes).forEach(([key, value]) => {
    const percent = Math.round((value / total) * 100);
    document.querySelector(`#${key}-count`).textContent = `${percent}%`;
    document.querySelector(`#${key}-fill`).style.setProperty('--width', `${percent}%`);
  });
}

document.querySelector('#form').onsubmit = (event) => {
  event.preventDefault();
  const choice = new FormData(event.target).get('vote');
  votes[choice] += 1;
  document.querySelector('#thanks').textContent =
    'Your response is in. Thank you for making the room larger.';
  render();
};
render();