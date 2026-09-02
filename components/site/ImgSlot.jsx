// Placeholder image slot — the same three treatments the landing established.
// Swap for a real <img className="lp-img"> once the art exists; the container
// takes the image's own proportions.
//
//   bleed  — transparent cut-out anchored to a section seam (light sections)
//   framed — a normal photo in a 16px rounded frame (light sections)
//   tile   — opaque, contained, diagonal top-right cut (forest sections)

const TREATMENT_LABEL = {
  bleed: "BLEED · transparent cut-out, anchored to the section seam",
  framed: "FRAMED · normal photo, 16px rounded frame + soft shadow",
  tile: "TILE · contained, centered, opaque, diagonal cut",
};

export default function ImgSlot({ id, treatment = "framed", ar, caption }) {
  const body = (
    <span>
      <span className="t">{TREATMENT_LABEL[treatment]}</span>
      <strong style={{ fontWeight: 600 }}>[{id}]</strong> {caption}
    </span>
  );

  if (treatment === "tile") {
    return (
      <div className="lp-imgtile">
        <div className="lp-imgslot" style={{ "--slot-ar": ar }}>
          {body}
        </div>
      </div>
    );
  }
  if (treatment === "framed") {
    return (
      <div className="lp-img-framed">
        <div className="lp-imgslot" style={{ "--slot-ar": ar }}>
          {body}
        </div>
      </div>
    );
  }
  return (
    <div className="lp-imgslot" style={{ "--slot-ar": ar }}>
      {body}
    </div>
  );
}
