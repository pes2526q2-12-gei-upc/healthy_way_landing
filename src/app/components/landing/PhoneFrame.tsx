type PhoneFrameProps = {
  src: string;
  alt: string;
  className?: string;
};

/** Phone frame matched to screenshot aspect (507×1024); full bleed, no letterboxing. */
export function PhoneFrame({ src, alt, className = '' }: PhoneFrameProps) {
  return (
    <div
      className={`mx-auto w-[220px] shrink-0 rounded-[2rem] border-4 border-slate-800 bg-slate-800 shadow-xl sm:w-[240px] ${className}`}
    >
      <div className="aspect-[507/1024] w-full overflow-hidden rounded-[1.65rem]">
        <img
          src={src}
          alt={alt}
          className="block h-full w-full object-cover object-top"
          draggable={false}
        />
      </div>
    </div>
  );
}
