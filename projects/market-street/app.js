const items = [
  { business: 'Mina’s Market', category: 'Food', amount: 42 },
  { business: 'Sola Studio', category: 'Services', amount: 120 },
  { business: 'Corner Books', category: 'Culture', amount: 18 },
];
const money = (value) =>
  '$' + value.toLocaleString(undefined, { maximumFractionDigits: 2 });

function render() {
  const total = items.reduce((sum, item) => sum + item.amount, 0);
  document.querySelector('#total').textContent = money(total);
  document.querySelector('#count').textContent = items.length;
  document.querySelector('#average').textContent = money(total / items.length);
  const grouped = {};
  items.forEach((item) => {
    grouped[item.category] = (grouped[item.category] || 0) + item.amount;
  });
  const max = Math.max(...Object.values(grouped));
  document.querySelector('#bars').innerHTML = Object.entries(grouped)
    .map(
      ([category, value]) =>
        `<div class="bar"><span>${category}</span><div class="track"><div class="fill" style="--width:${(value / max) * 100}%"></div></div><b>${money(value)}</b></div>`,
    )
    .join('');
  document.querySelector('#transactions').innerHTML = items
    .slice()
    .reverse()
    .map((item) => `<div><span>${item.business} · ${item.category}</span><b>${money(item.amount)}</b></div>`)
    .join('');
}

document.querySelector('#form').addEventListener('submit', (event) => {
  event.preventDefault();
  items.push({
    business: document.querySelector('#business').value,
    category: document.querySelector('#category').value,
    amount: Number(document.querySelector('#amount').value),
  });
  event.target.reset();
  render();
});
render();