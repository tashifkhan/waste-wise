import React from "react";

export default function MainInput() {
  return (
    <div className="w-full flex flex-col gap-8 p-6 bg-black text-white">
      <div className="flex w-full flex-wrap gap-4">
        {/* Title Input */}
        <input
          type="text"
          placeholder="Enter the title"
          className="flex-1 text-xl font-bold bg-white-800 border border-gray-600 rounded p-2" // Tailwind styling for the title input
        />
        
        {/* This div acts as a break between the inputs */}
        <div className="w-full" />

        {/* Description Textarea */}
        <textarea
          placeholder="Enter the description"
          className="flex-1 text-sm bg-white-800 border border-gray-600 rounded p-2 resize-x overflow-auto" // Tailwind styling for the textarea
          rows={15} // Adjust the number of rows as needed
        />
      </div>
    </div>
  );
}
