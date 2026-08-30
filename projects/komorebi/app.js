const fields = ['electricity', 'travel', 'shipments'].map((id) =>
  document.querySelector(`#${id}`),
);

function render() {
  const total =
    Number(fields[0].value) * 0.4 +
    Number(fields[1].value) * 0.21 +
    Number(fields[2].value) * 1.8;
  document.querySelector('#total').textContent = Math.round(total).toLocaleString();
  document.querySelector('#bar').style.setProperty(
    '--width',
    `${Math.min((total / 1000) * 100, 100)}%`,
  );
  document.querySelector('#message').textContent =
    total > 700
      ? 'Travel and energy are the largest levers in this snapshot.'
      : 'The footprint is modest today. Watch the trend as activity changes.';
}

fields.forEach((field) => (field.oninput = render));
render();