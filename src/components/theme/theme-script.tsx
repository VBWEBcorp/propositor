export function ThemeScript() {
  const script = `(function(){var t=localStorage.getItem('mymag-theme');if(t==='dark')document.documentElement.classList.add('dark')})();`
  return <script dangerouslySetInnerHTML={{ __html: script }} />
}
