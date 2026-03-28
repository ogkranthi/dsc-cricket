export const metadata = { title: "Gallery | DSC Cricket" };

export default function GalleryPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-black tracking-tight text-white mb-2">GALLERY</h1>
      <p className="text-sm text-slate-500 mb-8">Match photos and team moments</p>
      <div className="text-center py-20">
        <div className="w-20 h-20 mx-auto rounded-full bg-slate-800 flex items-center justify-center text-3xl mb-4">
          📸
        </div>
        <p className="text-slate-400 text-lg font-semibold">Photos coming soon!</p>
        <p className="text-sm text-slate-600 mt-2">
          Send photos to the DSC Teampilot bot and they&apos;ll appear here.
        </p>
      </div>
    </div>
  );
}
