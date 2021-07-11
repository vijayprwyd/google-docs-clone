import { useState } from "react";
import Head from "next/head";
import Image from "next/image";
import firebase from "firebase/app";
import Header from "../components/Header/Header";
import Button from "@material-tailwind/react/Button";
import Icon from "@material-tailwind/react/Icon";
import { getSession, useSession } from "next-auth/client";
import Login from "../components/Login";
import { db } from "../firebase";
import { useCollectionOnce } from "react-firebase-hooks/firestore";
import DocumentRow from "../components/DocumentRow";
import CreateDocumentModal from "../components/CreateDocumentModal";

export default function Home() {
  const [session] = useSession();
  if (!session) return <Login />;

  const [showModal, setShowModal] = useState(false);
  const [snapshot] = useCollectionOnce(
    db
      .collection("userDocs")
      .doc(session.user.email)
      .collection("docs")
      .orderBy("timestamp", "desc")
  );

  const createDocument = (input) => {
    if (!input) return;

    db.collection("userDocs").doc(session.user.email).collection("docs").add({
      fileName: input,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });

    setInput("");
    setShowModal(false);
  };

  return (
    <>
      <CreateDocumentModal
        showModal={showModal}
        onClose={() => setShowModal(false)}
        onSave={createDocument}
      />
      <div>
        <Head>
          <title>Google Docs Clone</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <Header />

        <section className="bg-[#F8F9FA] pb-10 px-10">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between py-6">
              <h2 className="text-gray-700 text-lg">Start a new document</h2>
              <Button
                color="gray"
                buttonType="outline"
                iconOnly
                ripple="dark"
                className="border-0"
              >
                <Icon name="more_vert" size="3xl" />
              </Button>
            </div>
            <div>
              <div className="relative h-52 w-40 border-2 cursor-pointer hover:border-blue-700">
                <Image
                  src="https://links.papareact.com/pju"
                  layout="fill"
                  onClick={() => setShowModal(true)}
                />
              </div>
              <p className="ml-2 mt-2 font-semibold text-sm text-gray-700">
                Blank
              </p>
            </div>
          </div>
        </section>

        <section className="bg-white px-10 md:px-0">
          <div className="max-w-3xl mx-auto py-8">
            <div className="flex items-center justify-between pb-5 text-sm text-gray-700">
              <h2 className="font-medium flex-grow">My Document</h2>
              <p className="mr-12">Data created</p>
              <Icon name="folder" size="3xl" color="gray"></Icon>
            </div>
            {snapshot?.docs.map((doc) => (
              <DocumentRow
                key={doc.id}
                id={doc.id}
                fileName={doc.data().fileName}
                date={doc.data().timestamp}
              />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  return {
    props: {
      session,
    },
  };
}
