'use client';
import clsx from 'clsx';
import { useState, useEffect, useRef } from 'react';

export function AnswerChoiceList() {
  const [selectedChoiceIndex, setSelectedChoiceIndex] = useState(5);
  const [answerChoices, setAnswerChoices] = useState([
    'flakes last minute.',
    'laughs at their own jokes.',
    'shares too much.',
    'can never read the room.',
    'never responds.',
    'leaves people on read.',
    'reacts to every msg.',
    'shills their own tweets.',
    'ends every msg with "!!!".',
    'forgets birthdays.',
    'always asks for a favor.',
    'sends too many memes.',
    'double texts.',
    'uses too many emojis.',
    'never initiates plans.',
    'always has the last word.',
    'sends voice notes.',
    'forwards chain messages.',
    'complains but never acts.',
    'avoids direct questions.',
    'changes topics abruptly.',
    'sends unsolicited advice.',
    'ghosts everyone.',
    'overuses acronyms.',
    'forgets to reply mid-convo.',
    'leaves everyone "on read"',
    'sends cryptic messages.',
    'overthinks simple texts.',
    'apologizes too much.',
    'never uses punctuation.',
  ]);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const list = listRef.current;
      if (list) {
        const { scrollTop, offsetHeight } = list;
        const listCenter = scrollTop + offsetHeight / 2;
        let closestIndex = 0;
        let smallestDistance = Infinity;
        Array.from(list.children).forEach((child, index) => {
          const childElement = child as HTMLElement; // Type assertion for child
          const childCenter =
            childElement.offsetTop + childElement.offsetHeight / 2;
          const distance = Math.abs(listCenter - childCenter);
          if (distance < smallestDistance) {
            closestIndex = index;
            smallestDistance = distance;
          }
        });
        setSelectedChoiceIndex(closestIndex);
      }
    };

    const list = listRef.current;
    list?.addEventListener('scroll', handleScroll);

    return () => list?.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      id="answer-choices-list"
      ref={listRef}
      className="scrollbar-hide flex h-[calc(100vh-10rem)] w-fit flex-col gap-y-5 overflow-y-auto pb-[21.5rem]"
    >
      {answerChoices.map((answer, index) => (
        <p
          key={answer}
          className={clsx('text-5xl', {
            'font-medium text-secondary': selectedChoiceIndex !== index,
            'font-bold text-primary': selectedChoiceIndex === index,
          })}
        >
          {answer}
        </p>
      ))}
    </div>
  );
}
