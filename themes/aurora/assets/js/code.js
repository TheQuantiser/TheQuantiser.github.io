// Add language labels and copy buttons to code blocks
const blocks = document.querySelectorAll('.chroma code[data-lang]');

blocks.forEach(bc => {
  const parent = bc.parentElement;
  const content = bc.innerText.split('\n').filter(Boolean).join('\n');

  const title = document.createElement('div');
  title.classList.add('code-title');
  title.innerText = bc.dataset.lang;

  if (navigator.clipboard) {
    const btn = document.createElement('button');
    btn.classList.add('copy-button');
    btn.innerText = 'Copy';
    btn.addEventListener('click', () => {
      btn.innerText = 'Copied';
      setTimeout(() => { btn.innerText = 'Copy'; }, 1000);
      navigator.clipboard.writeText(content);
    });
    title.append(btn);
  }

  parent.closest('.highlight').prepend(title);
});
