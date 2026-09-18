"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { FormError, FormNotice, PersonPhoto, buttonClass } from "@/components/app/ui";
import { removePhoto, savePhoto } from "./actions";

const SIZE = 256;

// The chosen image, cropped to its centre square and scaled to 256px in the
// browser, so what's stored is small and always the same shape.
async function squareWebp(file) {
  const bitmap = await createImageBitmap(file);
  const side = Math.min(bitmap.width, bitmap.height);
  const canvas = document.createElement("canvas");
  canvas.width = SIZE;
  canvas.height = SIZE;
  canvas.getContext("2d").drawImage(bitmap, (bitmap.width - side) / 2, (bitmap.height - side) / 2, side, side, 0, 0, SIZE, SIZE);
  return new Promise((resolve) => canvas.toBlob(resolve, "image/webp", 0.88));
}

// Your profile photo: Google's, if you signed in with Google and never
// uploaded one; otherwise the one you upload here.
export default function PhotoForm({ userId, name, photo, fromGoogle }) {
  const router = useRouter();
  const input = useRef(null);
  const [busy, setBusy] = useState(null); // "upload" | "remove"
  const [state, setState] = useState(null);

  async function pick(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!/^image\/(jpeg|png|webp|heic)$/.test(file.type)) return setState({ error: "Choose a JPG, PNG or WebP image." });
    if (file.size > 15 * 1024 * 1024) return setState({ error: "That image is over 15 MB. Choose a smaller one." });
    setBusy("upload");
    setState(null);
    try {
      const blob = await squareWebp(file);
      const path = `${userId}/${crypto.randomUUID()}.webp`;
      const { error } = await createClient().storage.from("cred-avatars").upload(path, blob, { contentType: "image/webp" });
      if (error) throw new Error(error.message);
      const result = await savePhoto(path);
      setState(result);
      router.refresh();
    } catch (err) {
      setState({ error: `Couldn't upload the photo: ${err.message}` });
    } finally {
      setBusy(null);
    }
  }

  async function remove() {
    setBusy("remove");
    setState(null);
    const result = await removePhoto();
    setState(result);
    setBusy(null);
    router.refresh();
  }

  const spinner = <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden="true" />;

  return (
    <div className="flex flex-col gap-4">
      <FormError message={state?.error} />
      <FormNotice message={state?.notice} />
      <div className="flex flex-wrap items-center gap-5">
        <PersonPhoto name={name} photo={photo} size="xl" />
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => input.current?.click()} disabled={Boolean(busy)} className={buttonClass("secondary")}>
              {busy === "upload" && spinner}
              {photo && !fromGoogle ? "Change photo" : "Upload a photo"}
            </button>
            {photo && !fromGoogle && (
              <button type="button" onClick={remove} disabled={Boolean(busy)} className={buttonClass("ghost")}>
                {busy === "remove" && spinner}
                Remove
              </button>
            )}
          </div>
          <p className="text-xs text-ink-500">
            {fromGoogle ? "This is your Google photo. Upload one to use a different photo here." : "A square photo works best. It's cropped to a circle."}
          </p>
        </div>
      </div>
      <input ref={input} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={pick} />
    </div>
  );
}
