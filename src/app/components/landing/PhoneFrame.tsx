type PhoneFrameProps = {
  src: string;
  alt: string;
  className?: string;
};

/** Phone frame with 9:19.5 viewport; screenshot fills the screen (no letterboxing). */
export function PhoneFrame({ src, alt, className = '' }: PhoneFrameProps) {
  return (
    <div
      className={`mx-auto w-[220px] shrink-0 rounded-[2rem] border-[6px] border-slate-800 bg-slate-800 p-1 shadow-xl sm:w-[240px] ${className}`}
    >
      <div className="aspect-[9/19.5] w-full overflow-hidden rounded-[1.6rem] bg-white">
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover object-top"
          draggable={false}
        />
      </div>
    </div>
  );
}
