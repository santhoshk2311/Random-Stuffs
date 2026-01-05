import { ContentForm } from "../components/ContentForm";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-center gap-8 py-20 px-6 bg-white dark:bg-black sm:px-10">
        <div className="w-full">
          <h1 className="text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            Add content
          </h1>
          <p className="mt-2 text-base leading-7 text-zinc-600 dark:text-zinc-400">
            A simple form generated from your schema:{" "}
            <span className="font-medium text-zinc-950 dark:text-zinc-50">
              title (Text), description (Text), contentImg (image)
            </span>
            .
          </p>
        </div>

        <ContentForm />
      </main>
    </div>
  );
}
