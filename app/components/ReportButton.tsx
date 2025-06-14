import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { File } from "lucide-react";
import React from "react";

const ReportButton = ({
  case_id,
  report_url,
}: {
  case_id: string;
  report_url: string;
}) => {
  async function getReport() {
    try {
      await fetch(`${process.env.NEXT_PULIC_SUPABASE_DIRECT_STORAGE_URL}${report_url}`);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Tooltip>
      <TooltipTrigger>
        <Button
          variant="ghost"
          onClick={() => getReport()}
          className="flex flex-col items-center justify-center h-full w-32 px-3 py-4 rounded-2xl border border-[#19287A] text-[#19287A] bg-white hover:bg-[#19287A] hover:text-white shadow-sm transition text-center"
        >
          <File className="scale-175 my-2" />
          <span className="text-sm font-medium break-words whitespace-normal w-full">
            {report_url}
          </span>
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        <p className="tetx-center">Case: {case_id}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default ReportButton;
