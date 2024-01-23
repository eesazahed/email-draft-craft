import React from "react";
import type { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import { getSession, signIn, signOut, useSession } from "next-auth/react";

import Btn from "../components/Btn";
import Gradient from "../components/Gradient";
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
    <div className="py-32 min-h-screen flex flex-col justify-center items-center overflow-x-hidden">
      <Head>
        <title>EmailDraftCraft</title>
        <link rel="icon" href="/favicon.ico" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6731814705038829"
          crossOrigin="anonymous"
        ></script>
      </Head>
      <main className="text-center text-xl">
        <h1 className="text-4xl md:text-7xl font-bold">
          <Gradient text="EmailDraftCraft" /> 📝
        </h1>
        {!session ? (
          <>
            <div className="mt-32 mx-4 mx-auto p-7 shadow appearance-none border rounded-lg dark:border-none text-center">
              <p>
                Welcome to <b>EmailDraftCraft</b>, your personal email
                assistant!
              </p>
              <p className="mt-4">
                To get started, sign in with your Google account.
              </p>
              <div className="w-1/2 mx-auto p-6">
                <Btn
                  text="Sign in with Google"
                  onClick={() => signIn("google")}
                />
              </div>
              <p className="mt-4">
                None of your data will be shared or sold with any third-parties.
                <br /> Your Google account is simply being used for a convenient
                authentication method.
              </p>
            </div>
          </>
        ) : (
          <div className="">
            <p className="my-8">
              You have <b>{String(tokens)}</b>{" "}
              {tokens === 1 ? "token" : "tokens"} remaining.
            </p>
            <div className="w-screen">
              <div className="md:flex lg:w-1/2 m-auto">
                <div className="md:w-1/2 px-6 mx-auto">
                  <form
                    onSubmit={handleSubmit}
                    className="mx-auto p-7 mb-7 shadow appearance-none border rounded-lg dark:border-none text-left"
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
                    <Btn text="Generate Email" submit />{" "}
                    <Btn
                      text="Sign out"
                      color="#a61308"
                      onClick={() => signOut()}
                    />
                  </form>
                </div>
                <div className="md:w-1/2 px-6 mx-auto">
                  <div className="mx-auto p-7 shadow appearance-none border rounded-lg dark:border-none text-left">
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
          </div>
        )}
      </main>
      <p className="mt-32">
        Made by{" "}
        <a
          className="text-green-400"
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
  const session = await getSession(context);
  let userTokens = 5;
  if (session) {
    const user = await getUserFromSession(context.req);
    if (user) {
      userTokens = user.tokens;
    }
  }
  return {
    props: {
      userTokens,
    },
  };
};
