import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { X, Save, Pencil } from "lucide-react";
import React from "react";

const DoctorNoteCard = ({
  caseId,
  noteText,
}: {
  caseId: string;
  noteText: string;
}) => {
  const [isEditable, setIsEditable] = React.useState(false);
  const [noteContent, setNoteContent] = React.useState(
    noteText ||
      "This is a placeholder for the doctor's note. The functionality is still in progress."
  );

  async function saveNote() {
    try {
      const res = await fetch("/api/doctor-note", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ note: noteContent, caseId: caseId }),
      });
      if (!res.ok) {
        throw new Error("Failed to save note");
      }
      // Optionally handle response here
    } catch (error) {
      console.error("Error saving note:", error);
    }
  }

  return (
    <Card className="shadow-lg py-0 flex flex-col h-full">
      <CardHeader className="bg-[#19287A] text-white font-semibold rounded-t-lg text-center pt-1 text-2xl">
        Doctor&apos;s Note
      </CardHeader>

      <CardContent className="flex-1 flex flex-col justify-start items-start">
        <Textarea
          className="w-full h-full rounded-lg border-none focus:ring-0 focus:border-none bg-transparent text-gray-700 resize-none text-xxl text-left p-3"
          style={{ minHeight: 0, alignSelf: "stretch" }}
          placeholder="Write notes..."
          value={noteContent}
          onChange={(e) => setNoteContent(e.target.value)}
          readOnly={!isEditable}
        />
      </CardContent>

      <CardFooter className="bg-[#19287A] hover:bg-[#0C8F8F] transition-colors cursor-pointer text-white font-semibold rounded-b-lg py-2 justify-center align-middle">
        {isEditable ? (
          <>
            <div className="flex w-full gap-2">
              <button
                type="button"
                className="flex-1 flex items-center justify-center gap-2 cursor-pointer rounded text-white font-semibold hover:bg-[#f0f4ff] hover:text-green-600 transition"
                onClick={() => {
                  saveNote();
                  setIsEditable(false);
                }}
              >
                <Save size={20} />
                <span>Save</span>
              </button>
              <button
                type="button"
                className="flex-1 flex items-center justify-center gap-2 cursor-pointer rounded text-white font-semibold hover:bg-[#f0f4ff] hover:text-red-500 transition"
                onClick={() => {
                  setNoteContent(
                    noteText ||
                      "This is a placeholder for the doctor's note. The functionality is still in progress."
                  );
                  setIsEditable(false);
                }}
              >
                <X size={20} />
                <span>Cancel</span>
              </button>
            </div>
          </>
        ) : (
          <>
            <button
              type="button"
              className="flex items-center justify-center gap-2 cursor-pointer focus:outline-none"
              onClick={() => setIsEditable(true)}
            >
              <Pencil size={20} />
              <span>Edit Notes</span>
            </button>
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default DoctorNoteCard;
