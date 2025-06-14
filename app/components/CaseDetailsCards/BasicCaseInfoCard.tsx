import { Card, CardContent } from "@/components/ui/card";
import { Check, Copy } from "lucide-react";
import React from "react";
import moment from "moment";

const BasicCaseInfoCard = ({
  props,
}: {
  props: { caseId: string; caseTitle: string; caseDate: Date };
}) => {
  const [textToCopy, ] = React.useState(`${props.caseId}`);
  const [isCopied, setIsCopied] = React.useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <Card className="mx-4 my-4 p-4 shadow-lg">
      <CardContent>
        <h1 className="font-bold text-2xl mb-2">{props.caseTitle}</h1>
        <h2
          className="font-semibold text-lg mb-2 hover:text-[#19287A] transition-colors cursor-pointer"
          onClick={() => copyToClipboard()}
        >
          <span className="flex items-center gap-4">
            Case #{props.caseId}
            <div className="relative w-4 h-4">
              <Check
                size={16}
                className={`absolute inset-0 transition-all duration-200 ${
                  isCopied
                    ? "opacity-100 scale-100 text-green-500"
                    : "opacity-0 scale-90"
                }`}
              />
              <Copy
                size={16}
                className={`absolute inset-0 transition-all hover:text-[#0C8F8F] duration-200 ${
                  isCopied ? "opacity-0 scale-90" : "opacity-100 scale-100"
                }`}
              />
            </div>
          </span>
        </h2>
        <span className="text-gray-500">
          Intervention Date:{" "}
          { moment(props.caseDate).format("MMMM Do YYYY, h:mm A") }
        </span>
      </CardContent>
    </Card>
  );
};

export default BasicCaseInfoCard;
