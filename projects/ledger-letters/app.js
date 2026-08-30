function format(text) {
  return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
}

function render() {
  document.querySelector('#preview-title').textContent =
    document.querySelector('#title').value;
  document.querySelector('#preview-body').innerHTML = format(
    document.querySelector('#body').value,
  );
}

['title', 'body'].forEach((id) =>
  document.querySelector(`#${id}`).addEventListener('input', render),
);
document.querySelector('#save').onclick = () => {
  document.querySelector('#save').textContent = 'Draft saved';
  setTimeout(() => (document.querySelector('#save').textContent = 'Save draft'), 1600);
};
render();