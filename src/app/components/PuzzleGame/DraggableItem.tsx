import { useState, type PointerEvent } from "react";
import leftImg from "../../../images/hrt1.png";
import rightImg from "../../../images/hrt2.png";

export type HeartItem = {
side: "left" | "right" | string;
};

export type DraggableItemProps = {
item: HeartItem;
section: string;
index: number;
onDragStart: (section: string, index: number) => void;
onPointerDrop?: (
section: string,
index: number,
clientX: number,
clientY: number
) => void;
};

export function DraggableItem({
item,
section,
index,
onDragStart,
onPointerDrop,
}: DraggableItemProps) {
const [isDragging, setIsDragging] = useState(false);
const [offset, setOffset] = useState({ x: 0, y: 0 });
const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(
null
);

const handleHtmlDragStart = () => {
setIsDragging(true);
onDragStart(section, index);
};

const handleHtmlDragEnd = () => {
setIsDragging(false);
setOffset({ x: 0, y: 0 });
setStartPos(null);
};

const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
if (e.pointerType === "mouse") return;

e.currentTarget.setPointerCapture(e.pointerId);
setIsDragging(true);
setStartPos({ x: e.clientX, y: e.clientY });
setOffset({ x: 0, y: 0 });
onDragStart(section, index);
};

const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
if (!isDragging || !startPos || e.pointerType === "mouse") return;

setOffset({
x: e.clientX - startPos.x,
y: e.clientY - startPos.y,
});
};

const handlePointerUp = (e: PointerEvent<HTMLDivElement>) => {
if (!isDragging || e.pointerType === "mouse") return;

if (e.currentTarget.hasPointerCapture(e.pointerId)) {
e.currentTarget.releasePointerCapture(e.pointerId);
}

onPointerDrop?.(section, index, e.clientX, e.clientY);

setIsDragging(false);
setOffset({ x: 0, y: 0 });
setStartPos(null);
};

return (
<div
draggable
onDragStart={handleHtmlDragStart}
onDragEnd={handleHtmlDragEnd}
onPointerDown={handlePointerDown}
onPointerMove={handlePointerMove}
onPointerUp={handlePointerUp}
onPointerCancel={handlePointerUp}
className={`w-12 sm:w-20 lg:w-[7.5rem] h-24 sm:h-40 lg:h-[15rem] my-2 sm:my-4 lg:my-6 mx-auto cursor-grab touch-none select-none transition-transform duration-150 ${
isDragging ? "scale-110 rotate-2 cursor-grabbing z-30" : ""
}`}
style={{
transform: isDragging
? `translate3d(${offset.x}px, ${offset.y}px, 0) scale(1.1) rotate(2deg)`
: undefined,
touchAction: "none",
filter: isDragging
? "drop-shadow(0 0.5rem 1.25rem rgba(255, 105, 180, 0.4))"
: "drop-shadow(0 0.25rem 0.75rem rgba(255, 105, 180, 0.2))",
WebkitUserSelect: "none",
WebkitTouchCallout: "none",
}}
>
<img
src={item.side === "left" ? leftImg : rightImg}
alt={`heart-${item.side}`}
className="w-full h-full block object-contain pointer-events-none"
draggable={false}
/>
</div>
);
}

export function PairedItem() {
return (
<div
className="flex gap-0 my-2 sm:my-4 lg:my-6 mx-auto w-24 sm:w-48 lg:w-[15rem] h-24 sm:h-48 lg:h-[15rem] relative z-10 before:content-[''] before:absolute before:-inset-2 sm:before:-inset-4 lg:before:-inset-6 before:rounded-full before:pointer-events-none"
style={{
background:
"radial-gradient(circle, rgba(255, 105, 180, 0.3) 0%, transparent 70%)",
}}
>
<div className="w-12 sm:w-24 lg:w-[7.5rem] h-24 sm:h-48 lg:h-[15rem]">
<img
src={leftImg}
alt="left-heart"
draggable={false}
className="w-full h-full object-contain"
/>
</div>
<div className="w-12 sm:w-24 lg:w-[7.5rem] h-24 sm:h-48 lg:h-[15rem]">
<img
src={rightImg}
alt="right-heart"
draggable={false}
className="w-full h-full object-contain"
/>
</div>
</div>
);
}