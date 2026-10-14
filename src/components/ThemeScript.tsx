// Inline, blocking script that sets data-theme before paint so there is no
// flash of the wrong theme. Reads a saved preference, else follows the OS.
const THEME_INIT = `
(function () {
  try {
    var stored = localStorage.getItem("apphub-theme");
    var theme = stored === "light" || stored === "dark"
      ? stored
      : (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    document.documentElement.setAttribute("data-theme", theme);
  } catch (e) {}
})();
`;

export default function ThemeScript() {
  // eslint-disable-next-line react/no-danger
  return <script dangerouslySetInnerHTML={{ __html: THEME_INIT }} />;
}
