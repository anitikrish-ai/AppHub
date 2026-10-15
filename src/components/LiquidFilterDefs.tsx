/**
 * Global SVG filters used by the liquid toggle:
 *  - #lt-goo          metaball blur + alpha threshold (the "goo window")
 *  - #lt-remove-black knocks out the black mask so the knob shows the backdrop
 *  - #lt-knockout     channel knockout variant
 * (Liquid-glass refraction filters are created per element by lib/liquid-glass.)
 */
export default function LiquidFilterDefs() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      xmlns="http://www.w3.org/2000/svg"
      style={{ position: "absolute", width: 0, height: 0, overflow: "hidden", pointerEvents: "none" }}
    >
      <defs>
        <filter id="lt-goo">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
          <feColorMatrix
            in="blur"
            type="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 16 -10"
            result="goo"
          />
          <feComposite in="goo" operator="atop" />
        </filter>

        <filter id="lt-knockout" colorInterpolationFilters="sRGB">
          <feColorMatrix
            result="knocked"
            type="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  -1 -1 -1 1 0"
          />
          <feComponentTransfer>
            <feFuncR type="linear" slope="3" intercept="-1" />
            <feFuncG type="linear" slope="3" intercept="-1" />
            <feFuncB type="linear" slope="3" intercept="-1" />
          </feComponentTransfer>
          <feComponentTransfer>
            <feFuncR type="table" tableValues="0 0 0 0 0 1 1 1 1 1" />
            <feFuncG type="table" tableValues="0 0 0 0 0 1 1 1 1 1" />
            <feFuncB type="table" tableValues="0 0 0 0 0 1 1 1 1 1" />
          </feComponentTransfer>
        </filter>

        <filter id="lt-remove-black" colorInterpolationFilters="sRGB">
          <feColorMatrix
            type="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  -255 -255 -255 0 1"
            result="black-pixels"
          />
          <feMorphology in="black-pixels" operator="dilate" radius="0.5" result="smoothed" />
          <feComposite in="SourceGraphic" in2="smoothed" operator="out" />
        </filter>
      </defs>
    </svg>
  );
}
