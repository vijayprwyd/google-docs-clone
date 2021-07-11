import dynamic from "next/dynamic";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { convertToRaw, EditorState, convertFromRaw } from "draft-js";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/client";
import { useRouter } from "next/dist/client/router";
import { db } from '../firebase';
import { useDocumentOnce } from "react-firebase-hooks/firestore";

const Editor = dynamic(
  () => import("react-draft-wysiwyg").then((module) => module.Editor),
  {
    ssr: false,
  }
);

export default function TextEditor() {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [session] = useSession();
  const router = useRouter();
  const { id } = router.query;
  const [snapshot] = useDocumentOnce(
    db
      .collection("userDocs")
      .doc(session?.user?.email)
      .collection("docs")
      .doc(id)
  );

  useEffect(() => {
    if (snapshot?.data()?.editorState) {
      setEditorState(
        EditorState.createWithContent(
          convertFromRaw(snapshot?.data()?.editorState)
        )
      );
    }
  }, [snapshot]);

  function onEditorStateChange(editorState) {
    setEditorState(editorState);
    db.collection("userDocs")
      .doc(session.user.email)
      .collection("docs")
      .doc(id)
      .set(
        {
            editorState: convertToRaw(editorState.getCurrentContent()),
        },
        {
          merge: true,
        }
      );
  }

  return (
    <div className="bg-white min-h-screen pb-16">
      <Editor
        editorState={editorState}
        toolbarClassName="flex sticky top-0 z-50 justofy-center max-auto"
        editorClassName="mt-6 p-10 bg-white shadow-lg max-w-5xl mx-auto mb-12 border"
        onEditorStateChange={onEditorStateChange}
      />
    </div>
  );
}
