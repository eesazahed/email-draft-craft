import React from "react";
import type { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import { getSession, signIn, signOut, useSession } from "next-auth/react";
import Gradient from "../components/Gradient";
import Btn from "../components/Btn";
import Input from "../components/Input";
import Textarea from "../components/Textarea";
import getUserFromSession from "../utils/getUserFromSession";

interface Props {
  userTokens: number;
}

const Home: NextPage<Props> = ({ userTokens }) => {
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    teacherName: "",
    course: "",
    gradeLevel: "",
    content: "",
    generatedEmail: "",
  });
  const [generatedEmail, setGeneratedEmail] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [tokens, setTokens] = useState<number>(userTokens);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setGeneratedEmail("");
    setErrorMessage("");

    if (!session) {
      await signIn("google");
      return;
    }

    const request = await fetch("/api/generate", {
      method: "POST",
      body: JSON.stringify(formData),
    });

    const response = await request.json();

    setLoading(false);

    if (response.error) {
      setErrorMessage(response.error);
    } else {
      setGeneratedEmail(response.generatedEmail);
      setFormData({
        ...formData,
        generatedEmail: response.generatedEmail,
      });
      setTokens(response.remainingTokens);
    }
  };

  const copy = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => alert("Copied!"))
      .catch(() => true);
  };

  return (
    <div className="m-0 py-32 min-h-screen flex flex-col justify-center items-center">
      <Head>
        <title>EmailDraftCraft</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="text-center text-xl">
        <h1 className="text-7xl font-bold">
          <Gradient text="EmailDraftCraft" /> 📝
        </h1>
        {!session ? (
          <>
            <div className="mt-32 w-[550px] mx-auto p-7 shadow appearance-none border rounded-lg dark:border-zinc-500 text-left">
              <p>
                Welcome to <b>EmailDraftCraft</b>, your personal email
                assistant!
              </p>
              <p className="mt-4">
                To get started, sign in with your Google account.
              </p>
              <Btn
                text="Sign in with Google"
                onClick={() => signIn("google")}
              />
            </div>
          </>
        ) : (
          <div>
            <p className="my-8">
              You have <b>{String(tokens)}</b> tokens remaining.
            </p>
            <div className="flex w-[1000px] m-auto">
              <div className="w-1/2 m-6">
                <form
                  onSubmit={handleSubmit}
                  className="mx-auto p-7 shadow appearance-none border rounded-lg dark:border-zinc-500 text-left"
                >
                  <Input
                    label="Teacher's Name:"
                    name="teacherName"
                    placeholder="Mr. ABCXYZ"
                    parentData={formData.teacherName}
                    updateParent={(e: string) =>
                      setFormData({ ...formData, teacherName: e })
                    }
                  />
                  <Input
                    label="Course:"
                    name="course"
                    placeholder="Science"
                    parentData={formData.course}
                    updateParent={(e: string) =>
                      setFormData({ ...formData, course: e })
                    }
                  />
                  <Input
                    label="Grade level:"
                    name="gradeLevel"
                    placeholder="5"
                    parentData={formData.gradeLevel}
                    updateParent={(e: string) =>
                      setFormData({ ...formData, gradeLevel: e })
                    }
                    number
                  />
                  <Textarea
                    label="What do you want to write about?"
                    name="content"
                    placeholder="What is the particle theory of matter?"
                    parentData={formData.content}
                    updateParent={(e: string) =>
                      setFormData({ ...formData, content: e })
                    }
                  />
                  <Btn text="Generate Email" submit />
                </form>
                <Btn
                  text="Sign out"
                  color="#a61308"
                  onClick={() => signOut()}
                />
              </div>
              <div className="w-1/2 m-6">
                <div className="mx-auto p-7 shadow appearance-none border rounded-lg dark:border-zinc-500 text-left">
                  <h2 className="text-2xl mb-2">
                    {errorMessage && <>Error</>}
                    {!errorMessage && <>Generated Email</>}
                  </h2>
                  <div className="text-gray-700 text-base dark:text-white">
                    {generatedEmail && (
                      <>
                        <Textarea
                          name="generatedEmail"
                          parentData={formData.generatedEmail}
                          updateParent={(e: string) =>
                            setFormData({ ...formData, generatedEmail: e })
                          }
                          large
                        />

                        <p className="my-4">
                          Make sure you double check the email&apos;s content!
                        </p>
                        <Btn
                          text="Copy to clipboard"
                          color="#34a853"
                          onClick={() => copy(formData.generatedEmail)}
                        />
                      </>
                    )}

                    {errorMessage && errorMessage}
                    {loading && <>Loading...</>}
                  </div>
                </div>
              </div>
            </div>{" "}
          </div>
        )}
      </main>
      <p className="mt-32">
        Made by{" "}
        <a
          className="text-[#0070f3]"
          rel="noreferrer"
          target="_blank"
          href="https://eesa.zahed.ca/"
        >
          Eesa Zahed
        </a>
      </p>
    </div>
  );
};

export default Home;

export const getServerSideProps = async (context: any) => {
  let userTokens = 5;

  const user = await getUserFromSession(context.req);
  if (user) {
    userTokens = user.tokens;
  }

  return {
    props: {
      userTokens,
    },
  };
};
