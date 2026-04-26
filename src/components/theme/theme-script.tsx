export function ThemeScript() {
  const script = `(function(){var t=localStorage.getItem('propositor-theme');if(t==='dark')document.documentElement.classList.add('dark')})();`
  return <script dangerouslySetInnerHTML={{ __html: script }} />
}
