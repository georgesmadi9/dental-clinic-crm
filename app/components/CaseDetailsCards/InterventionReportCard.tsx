import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { File, Sparkle, Upload, X } from "lucide-react";
import React, { useEffect, useState } from "react";

interface InterventionReportCardProps {
  report_url: string;
}

const InterventionReportCard: React.FC<InterventionReportCardProps> = ({
  report_url,
}) => {
  const [, setLoadingReport] = useState(true);

  useEffect(() => {
    if (!report_url) {
      setLoadingReport(false);
      return;
    }
    fetch(`${process.env.NEXT_PULIC_SUPABASE_DIRECT_STORAGE_URL}/reports/${report_url}`)
      .finally(() => setLoadingReport(false));
  }, [report_url]);

  const handleOpenReport = () => {
    window.open(`${process.env.NEXT_PULIC_SUPABASE_DIRECT_STORAGE_URL}/reports/${report_url}`, "_blank");
  };

  return (
    <Card className="shadow-lg py-0 flex flex-col h-full">
      <CardHeader className="bg-[#19287A] text-white font-semibold rounded-t-lg text-center pt-1 text-2xl">
        Intervention Report
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        {report_url ? (
          <div className="flex flex-col flex-1">
            <div className="flex items-center justify-between mb-4 border-[#19287A] border-2 rounded-lg p-2 hover:bg-[#19287A] hover:text-white transition-colors">
              <button
                className="flex items-center gap-2 hover:underline focus:outline-none"
                onClick={handleOpenReport}
                type="button"
              >
                <File size={20} />
                <span
                  className="font-medium max-w-[175px] overflow-hidden text-ellipsis whitespace-nowrap"
                  title={report_url}
                >
                  {report_url}
                </span>
              </button>
              <button
                type="button"
                className="text-red-500 hover:text-red-700 focus:outline-none"
              >
                <X size={20} />
              </button>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg mb-2 flex-1 flex flex-col">
              <div className="flex items-center gap-2 mb-2 text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-yellow-500 to-purple-500 animate-gradient-x">
                <Sparkle className="w-6 h-6 animate-text-gradient" />
                AI Generated Summary
              </div>
              <p className="text-gray-700 flex-1">
                This is a placeholder for the AI-generated summary of the
                intervention report. The functionality is still in progress.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col flex-1 items-center justify-center text-gray-500 text-base font-medium text-center">
            <span className="mb-6">
              No intervention report is currently available.
            </span>
            <span className="italic">
              Please upload a report to view its details.
            </span>
          </div>
        )}
      </CardContent>
      <CardFooter className="bg-[#19287A] hover:bg-[#0C8F8F] transition-colors text-white font-semibold cursor-pointer rounded-b-lg py-2 justify-center align-middle">
        <button
          type="button"
          className="flex items-center justify-center gap-2 cursor-pointer focus:outline-none"
        >
          <Upload size={20} />
          <span>Upload Report</span>
        </button>
      </CardFooter>
    </Card>
  );
};

export default InterventionReportCard;
