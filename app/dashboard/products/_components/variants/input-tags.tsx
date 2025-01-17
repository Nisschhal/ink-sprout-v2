"use client" // Enables React's client-side rendering mode for this component.
import { Input, InputProps } from "@/components/ui/input" // Import custom Input component and its props.
import { cn } from "@/lib/utils" // Utility function for conditional classNames.
import { Dispatch, SetStateAction, useState } from "react" // React hooks for managing state.
import { useFormContext } from "react-hook-form" // Hook to manage form context for `react-hook-form`.
import { AnimatePresence, motion } from "motion/react" // Animation components for smooth transitions.
import { Badge } from "@/components/ui/badge" // Badge UI component for displaying tags.
import { XIcon } from "lucide-react" // Icon component for a close button.

type InputTagsProps = InputProps & {
  value: string[] // Array of tags currently added.
  onChange: Dispatch<SetStateAction<string[]>> // Callback to update the array of tags.
}

// Main InputTags component for managing a list of tags interactively.
export default function InputTags({
  value, // Current tags array.
  onChange, // Callback to update tags.
  ...props // Additional props passed to the Input component.
}: InputTagsProps) {
  const [pendingDataPoint, setPendingDataPoint] = useState("") // State to hold the text being typed.
  const [focused, setFocused] = useState(false) // State to track whether the input is focused.

  // Adds the current pendingDataPoint to the tags array if it isn't empty.
  function addPendingDataPoint() {
    if (pendingDataPoint) {
      const newDataPoint = new Set([...value, pendingDataPoint]) // Use a Set to prevent duplicate tags.
      onChange(Array.from(newDataPoint)) // Update the tags array.
      setPendingDataPoint("") // Clear the input field after adding the tag.
    }
  }

  // Access form context to programmatically set focus on the input field.
  const { setFocus } = useFormContext()

  return (
    <div
      className={cn(
        "w-full rounded-lg border border-input bg-background text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        focused
          ? "ring-offset-2 outline-none ring-ring ring-2" // Style when focused.
          : "ring-offset-0 outline-none ring-ring ring-0" // Style when not focused.
      )}
      onClick={() => setFocus("tags")} // Set focus on the input field when clicking the container.
    >
      <motion.div className="rounded-md min-h-[2.5rem] p-2 flex gap-2 flex-wrap items-center">
        {/* AnimatePresence ensures smooth animations for tag additions/removals */}
        <AnimatePresence>
          {value.map((tag) => (
            <motion.div
              key={tag} // Unique key for each tag (required for animations).
              initial={{ scale: 0 }} // Initial animation state.
              animate={{ scale: 1 }} // Final animation state when tag is added.
              exit={{ scale: 0 }} // Animation state when tag is removed.
            >
              <Badge variant={"secondary"}>
                {tag} {/* Display the tag */}
                <button
                  className="w-2 ml-2"
                  onClick={() => onChange(value.filter((i) => i !== tag))} // Remove tag on click.
                >
                  <XIcon className="w-3" /> {/* Small close icon */}
                </button>
              </Badge>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Input for typing new tags */}
        <div className="flex">
          <Input
            {...props} // Pass down all additional props.
            className="focus-visible:border-transparent border-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
            placeholder="Add tags" // Placeholder text.
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault() // Prevent form submission on Enter.
                addPendingDataPoint() // Add the tag.
              }
              if (
                e.key === "Backspace" && // Detect Backspace key.
                !pendingDataPoint && // Ensure input is empty.
                value.length > 0 // Ensure there are tags to remove.
              ) {
                e.preventDefault()
                const newValue = [...value]
                newValue.pop() // Remove the last tag.
                onChange(newValue) // Update the tags array.
              }
            }}
            value={pendingDataPoint} // Controlled input value.
            onFocus={() => setFocused(true)} // Set focus state when input is focused.
            onBlurCapture={() => setFocused(false)} // Reset focus state when input loses focus.
            onChange={(e) => setPendingDataPoint(e.target.value)} // Update the input value on change.
          />
        </div>
      </motion.div>
    </div>
  )
}
