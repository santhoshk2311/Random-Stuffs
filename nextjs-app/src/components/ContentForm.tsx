"use client";

import { useEffect, useMemo, useState } from "react";

type FormState = {
  title: string;
  description: string;
  contentImg: File | null;
};

type SubmittedState = {
  title: string;
  description: string;
  contentImgName: string | null;
};

const fieldHelpText: Record<keyof FormState, string> = {
  title: "Text",
  description: "Text",
  contentImg: "Image",
};

export function ContentForm() {
  const [form, setForm] = useState<FormState>({
    title: "",
    description: "",
    contentImg: null,
  });
  const [submitted, setSubmitted] = useState<SubmittedState | null>(null);

  const previewUrl = useMemo(() => {
    if (!form.contentImg) return null;
    return URL.createObjectURL(form.contentImg);
  }, [form.contentImg]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // No backend wired yet—capture what the user entered and show it.
    setSubmitted({
      title: form.title.trim(),
      description: form.description.trim(),
      contentImgName: form.contentImg ? form.contentImg.name : null,
    });
  }

  const canSubmit = form.title.trim().length > 0 && form.description.trim().length > 0;

  return (
    <section className="w-full">
      <div className="w-full rounded-2xl border border-black/[.08] bg-white p-6 shadow-sm dark:border-white/[.145] dark:bg-black sm:p-8">
        <div className="mb-6 flex flex-col gap-2">
          <h2 className="text-xl font-semibold tracking-tight text-black dark:text-zinc-50">
            Content form
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Fields generated from your schema:{" "}
            <span className="font-medium text-zinc-950 dark:text-zinc-50">
              {`{ title: ${fieldHelpText.title}, description: ${fieldHelpText.description}, contentImg: ${fieldHelpText.contentImg} }`}
            </span>
          </p>
        </div>

        <form className="flex flex-col gap-5" onSubmit={onSubmit}>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-black dark:text-zinc-50">
              Title <span className="text-zinc-500 dark:text-zinc-400">(Text)</span>
            </span>
            <input
              className="h-11 rounded-xl border border-black/[.08] bg-transparent px-4 text-black outline-none ring-0 placeholder:text-zinc-400 focus:border-black/30 dark:border-white/[.145] dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-white/40"
              type="text"
              name="title"
              placeholder="Enter a title"
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              required
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-black dark:text-zinc-50">
              Description{" "}
              <span className="text-zinc-500 dark:text-zinc-400">(Text)</span>
            </span>
            <textarea
              className="min-h-28 resize-y rounded-xl border border-black/[.08] bg-transparent px-4 py-3 text-black outline-none placeholder:text-zinc-400 focus:border-black/30 dark:border-white/[.145] dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-white/40"
              name="description"
              placeholder="Write a short description"
              value={form.description}
              onChange={(e) =>
                setForm((p) => ({ ...p, description: e.target.value }))
              }
              required
            />
          </label>

          <div className="flex flex-col gap-2">
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-black dark:text-zinc-50">
                Content image{" "}
                <span className="text-zinc-500 dark:text-zinc-400">(Image)</span>
              </span>
              <input
                className="block w-full cursor-pointer rounded-xl border border-black/[.08] bg-transparent px-4 py-2 text-sm text-zinc-700 file:mr-4 file:rounded-lg file:border-0 file:bg-black file:px-3 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-[#383838] dark:border-white/[.145] dark:text-zinc-200 dark:file:bg-white dark:file:text-black dark:hover:file:bg-[#ccc]"
                type="file"
                name="contentImg"
                accept="image/*"
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    contentImg: e.target.files?.[0] ?? null,
                  }))
                }
              />
            </label>

            {previewUrl ? (
              <div className="mt-2 overflow-hidden rounded-xl border border-black/[.08] dark:border-white/[.145]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl}
                  alt="Selected preview"
                  className="max-h-64 w-full object-contain bg-zinc-50 dark:bg-black"
                />
              </div>
            ) : (
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Optional — choose an image to preview it here.
              </p>
            )}
          </div>

          <div className="mt-1 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="submit"
              disabled={!canSubmit}
              className="inline-flex h-11 items-center justify-center rounded-full bg-foreground px-5 text-sm font-medium text-background transition-colors hover:bg-[#383838] disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-[#ccc]"
            >
              Submit
            </button>

            <button
              type="button"
              className="inline-flex h-11 items-center justify-center rounded-full border border-solid border-black/[.08] px-5 text-sm font-medium transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a]"
              onClick={() => {
                setForm({ title: "", description: "", contentImg: null });
                setSubmitted(null);
              }}
            >
              Reset
            </button>
          </div>
        </form>

        {submitted ? (
          <div className="mt-6 rounded-xl border border-black/[.08] bg-zinc-50 p-4 text-sm dark:border-white/[.145] dark:bg-[#0f0f0f]">
            <div className="mb-2 font-medium text-zinc-950 dark:text-zinc-50">
              Submitted payload (preview)
            </div>
            <pre className="overflow-x-auto whitespace-pre-wrap break-words text-xs leading-5 text-zinc-700 dark:text-zinc-300">
              {JSON.stringify(submitted, null, 2)}
            </pre>
          </div>
        ) : null}
      </div>
    </section>
  );
}

