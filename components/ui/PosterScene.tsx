/**
 * The hero illustration: Longs Peak at sunset, drawn the way a screen-printed
 * park poster would draw it — a few flat inks, hard-edged shapes, no
 * gradients or outlines. Everything is plain SVG, so it is sharp at any
 * size and costs a few kilobytes.
 *
 * The art is anchored to the bottom centre and cropped at the sides
 * (`xMidYMax slice`), so a phone sees the peak, lake and trail and a wide
 * screen gains the flanking ridges and pines.
 */

/** A pine as stacked tiers; (x, base) is the foot of the trunk. */
function pine(x: number, base: number, height: number): string {
  const width = height * 0.36;
  const tiers = 5;
  let d = `M${x - 3} ${base}V${base - height * 0.12}`;
  for (let i = 0; i < tiers; i++) {
    const t = i / tiers;
    const half = (width / 2) * (1 - t * 0.78);
    const nextY = base - height * (0.12 + 0.88 * ((i + 1) / tiers));
    const tuck = half * 0.42;
    d += `H${(x - half).toFixed(1)}L${(x - tuck).toFixed(1)} ${nextY.toFixed(1)}`;
    if (i === tiers - 1) d += `L${x} ${(base - height).toFixed(1)}`;
  }
  for (let i = tiers - 1; i >= 0; i--) {
    const t = i / tiers;
    const half = (width / 2) * (1 - t * 0.78);
    const topY = base - height * (0.12 + 0.88 * ((i + 1) / tiers));
    const y = base - height * (0.12 + 0.88 * t);
    const tuck = half * 0.42;
    d += `L${(x + tuck).toFixed(1)} ${topY.toFixed(1)}L${(x + half).toFixed(1)} ${y.toFixed(1)}`;
  }
  return `${d}H${x + 3}V${base}Z`;
}

const leftPines = [
  pine(34, 610, 330),
  pine(104, 606, 250),
  pine(168, 604, 300),
  pine(236, 600, 190),
  pine(292, 598, 140),
].join('');

const rightPines = [
  pine(1408, 610, 340),
  pine(1340, 606, 240),
  pine(1274, 604, 290),
  pine(1206, 600, 180),
  pine(1150, 598, 130),
].join('');

export function PosterScene({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1440 600"
      preserveAspectRatio="xMidYMax slice"
      className={className}
    >
      {/* Sun, with two printed halos */}
      <circle cx="1000" cy="300" r="250" className="fill-mustard" opacity="0.28" />
      <circle cx="1000" cy="300" r="195" className="fill-mustard" opacity="0.5" />
      <circle cx="1000" cy="300" r="140" className="fill-cream" />

      {/* Far range */}
      <path
        className="fill-tangerine"
        d="M0 372L96 318L180 352L300 262L372 306L470 250L560 318L660 286L760 330L880 270L990 322L1110 268L1210 316L1310 276L1440 330V600H0Z"
      />

      {/* West peak */}
      <path
        className="fill-maroon"
        d="M0 600V440L84 396L150 330L196 316L250 352L318 430L420 476L560 600Z"
      />
      <path className="fill-cream" d="M150 330L196 316L222 334L204 372L176 350L158 366Z" />

      {/* Longs Peak: the flat summit, the notch, the sheer east face */}
      <path
        className="fill-rust"
        d="M330 600L520 396L610 346L672 258L716 236L852 224L890 244L912 300L946 286L1004 352L1088 404L1176 388L1300 476L1440 528V600Z"
      />
      {/* East face in shadow */}
      <path
        className="fill-maroon"
        d="M852 224L890 244L912 300L946 286L1004 352L1088 404L1176 388L1300 476L1440 528V600H770L812 420L830 300Z"
      />
      {/* Snowfields */}
      <path className="fill-cream" d="M672 258L716 236L760 246L736 300L708 280L690 312Z" />
      <path className="fill-cream" d="M778 232L852 224L836 282L812 262L792 296Z" />
      <path className="fill-cream" d="M596 372L640 344L628 398L604 410Z" />

      {/* Forested foothills */}
      <path
        className="fill-teal"
        d="M0 506C180 452 360 520 600 492S1000 436 1200 482S1380 470 1440 452V600H0Z"
      />

      {/* Lake, catching the sun */}
      <path
        className="fill-mustard"
        d="M560 556C680 522 900 522 1050 548C910 584 690 590 560 556Z"
      />
      <path
        className="stroke-cream"
        d="M760 546H930M800 558H980M740 570H900"
        fill="none"
        strokeWidth="5"
        strokeLinecap="round"
      />

      {/* Foreground and pines */}
      <path className="fill-pine" d="M0 566C220 532 420 600 720 590S1220 548 1440 574V600H0Z" />
      <path className="fill-pine" d={leftPines} />
      <path className="fill-pine" d={rightPines} />

      {/* The trail, switchbacking up to the summit */}
      <path
        className="stroke-cream"
        d="M470 600C520 566 430 548 500 520S640 500 600 462S560 420 640 398S720 350 700 312S740 268 790 240"
        fill="none"
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray="1 13"
      />
      {/* Summit flag */}
      <path className="stroke-cream" d="M790 240V204" fill="none" strokeWidth="3" />
      <path className="fill-mustard" d="M790 204L822 212L790 222Z" />
    </svg>
  );
}
