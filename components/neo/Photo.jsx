// A photography slot. Pass `src` and it renders a real <img> at the crop the
// layout expects; leave `src` off and it renders a labelled placeholder that
// states the crop and the art direction, so the brief travels with the layout
// instead of living in a separate document.
//
// Art direction for every slot on this site is the same: documentary, a real
// clinic back office, available light, nobody looking at or smiling into the
// camera, work visibly in progress on the desk. No stock-photo handshakes, no
// stethoscope-on-a-laptop still lifes.
//
// <img> rather than next/image, with explicit width/height and alt, matching
// the rest of the marketing site.
export default function Photo({
  src,
  alt,
  ratio = "4 / 3",
  width,
  height,
  direction,
  priority = false,
  className = "",
  children,
}) {
  return (
    <figure className={`sk-photo ${className}`} style={{ "--ar": ratio }}>
      {src ? (
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? "eager" : "lazy"}
          decoding={priority ? "sync" : "async"}
        />
      ) : (
        <div className="sk-photo__slot">
          <b>Photo · {ratio.replace(/\s/g, "")}</b>
          <span>{direction || alt}</span>
        </div>
      )}
      {children}
    </figure>
  );
}
