import { useState } from "react";
import { PuzzleColumn } from "./PuzzleColumn";
import { SuccessScreen } from "../SuccessScreen";
import { PUZZLE_MESSAGES } from "../../data/messages";
import { canDrop, getPairedItems, playGlassSlideSound } from "../../utils/puzzleLogic";

type HeartSlice = {
sliceId: number;
side: "left" | "right";
};

type SectionKey = "leftCol" | "InProgress" | "rightCol";

type PuzzleData = Record<SectionKey, HeartSlice[]>;

type ActiveDrag = {
sourceSection: SectionKey;
idx: number;
item: HeartSlice;
};

const initialData: PuzzleData = {
leftCol: [{ sliceId: 1, side: "left" }],
InProgress: [],
rightCol: [{ sliceId: 1, side: "right" }],
};

export function PuzzleGame({ onHeartClick }: { onHeartClick?: () => void }) {
const [data, setData] = useState<PuzzleData>(initialData);
const [dragItem, setDragItem] = useState<ActiveDrag | null>(null);
const [showSuccess, setShowSuccess] = useState(false);

const handleDragStart = (section: SectionKey, idx: number) => {
setDragItem({
sourceSection: section,
idx,
item: data[section][idx],
});
};

const commitDrop = (targetSection: SectionKey, activeDrag: ActiveDrag | null) => {
if (!activeDrag || !canDrop(activeDrag, targetSection)) {
setDragItem(null);
return;
}

const newData: PuzzleData = {
leftCol: [...data.leftCol],
InProgress: [...data.InProgress],
rightCol: [...data.rightCol],
};

const [movedItem] = newData[activeDrag.sourceSection].splice(activeDrag.idx, 1);
if (!movedItem) {
setDragItem(null);
return;
}

newData[targetSection].push(movedItem);

setData(newData);
setDragItem(null);
playGlassSlideSound();

const { pairs } = getPairedItems(newData.InProgress);
if (pairs.length > 0) {
setTimeout(() => setShowSuccess(true), 800);
}
};

const handleDrop = (targetSection: SectionKey) => {
commitDrop(targetSection, dragItem);
};

const handlePointerDrop = (
section: SectionKey,
index: number,
clientX: number,
clientY: number
) => {
const activeDrag: ActiveDrag = dragItem ?? {
sourceSection: section,
idx: index,
item: data[section][index],
};

const elementsUnderFinger = document.elementsFromPoint(clientX, clientY);
let matchedSection: SectionKey | null = null;

for (const el of elementsUnderFinger) {
const sectionEl = el.closest("[data-drop-section]") as HTMLElement | null;
const attr = sectionEl?.getAttribute("data-drop-section") as SectionKey | null;
if (attr && (attr === "leftCol" || attr === "InProgress" || attr === "rightCol")) {
matchedSection = attr;
break;
}
}

if (matchedSection) {
commitDrop(matchedSection, activeDrag);
} else {
setDragItem(null);
}
};

const handleDragOver = (e: React.DragEvent) => e.preventDefault();

if (showSuccess) {
return <SuccessScreen onHeartClick={onHeartClick} />;
}

return (
<div className="flex flex-col gap-3 sm:gap-6 lg:gap-10 px-3 sm:px-6 lg:px-10 py-3 sm:py-6 lg:py-10 bg-gradient-to-br from-[#ffeef8] to-[#ffe4f1] min-h-full items-center justify-center overflow-x-hidden">
<h1
className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#c9184a] text-center mb-4 sm:mb-6 animate-pulse"
style={{
textShadow: "0 2px 4px rgba(201, 24, 74, 0.15)",
letterSpacing: "-0.5px",
}}
>
{PUZZLE_MESSAGES.title}
</h1>

<div className="flex flex-col items-center gap-2 sm:gap-3 max-w-[600px] mx-auto mb-6 sm:mb-8">
<p className="text-base sm:text-lg lg:text-xl text-[#c9184a] font-semibold text-center leading-relaxed tracking-wide">
{PUZZLE_MESSAGES.instruction1}
</p>
<p className="text-sm sm:text-base lg:text-lg text-[#d63a5a] font-medium text-center leading-normal opacity-90">
{PUZZLE_MESSAGES.instruction2}
</p>
</div>

<div className="grid grid-cols-[1fr_1.1fr_1fr] gap-2 sm:gap-6 lg:gap-10 items-center justify-items-center w-full max-w-[1400px]">
{(Object.keys(data) as SectionKey[]).map((section) => (
<div key={section} data-drop-section={section} className="w-full h-full">
<PuzzleColumn
section={section}
items={data[section]}
onDrop={handleDrop}
onDragOver={handleDragOver}
onDragStart={handleDragStart}
onPointerDrop={handlePointerDrop}
/>
</div>
))}
</div>

<div className="text-sm sm:text-base text-[#c9184a] text-center font-medium px-4 sm:px-6 py-2 sm:py-4 bg-pink-200/20 border-l-[3px] border-[#ff69b4] rounded-lg mt-4 sm:mt-6 max-w-[500px] mx-auto opacity-85">
💡 {PUZZLE_MESSAGES.hint}
</div>
</div>
);
}