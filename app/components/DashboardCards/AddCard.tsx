import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import Link from "next/link";
import React from "react";

interface AddCardProps {
  props: {
    what: string;
  };
}

const AddCard: React.FC<AddCardProps> = ({ props }) => {
  return (
    <Card className="rounded-b-lg bg-[#f9fafb] shadow-lg hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-lg font-semibold mb-2">
            Add New {props.what[0].toUpperCase() + props.what.slice(1)}
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Click the button below to add a new {props.what}.
          </p>
          <Link
            href={`/${props.what}s/new`}
            className="inline-flex items-center justify-center px-4 py-2 bg-[#19287A] text-white rounded-lg hover:bg-[#0C8F8F] transition-colors duration-300"
          >
            <Plus className="inline mr-2" />
            <span>Add {props.what}</span>
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default AddCard;
