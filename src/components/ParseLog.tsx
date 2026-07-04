"use client";

import { useEffect, useRef, useState } from "react";
import { EDGES, LOG_LINES, type LogLine } from "@/data/ontology";

interface ParseLogProps {
  onCommit: (visibleEdges: number) => void;
}

interface Shown {
  line: LogLine;
  ghost: boolean;
}

export function ParseLog({ onCommit }: ParseLogProps) {
  const [shown, setShown] = useState<Shown[]>([]);
  const [done, setDone] = useState(false);
  const committed = useRef(0);
  const onCommitRef = useRef(onCommit);
  useEffect(() => {
    onCommitRef.current = onCommit;
  });

  useEffect(() => {
    let i = 0;
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];

    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || innerWidth <= 860) {
      timers.push(
        setTimeout(() => {
          setShown(LOG_LINES.map((line) => ({ line, ghost: false })));
          setDone(true);
          onCommitRef.current(EDGES.length);
        }, 0)
      );
      return () => {
        cancelled = true;
        timers.forEach(clearTimeout);
      };
    }

    function commit() {
      committed.current = Math.min(EDGES.length, committed.current + Math.ceil(EDGES.length / (LOG_LINES.length - 1)));
      onCommitRef.current(committed.current);
    }

    function next() {
      if (cancelled) return;
      if (i >= LOG_LINES.length) {
        setDone(true);
        onCommitRef.current(EDGES.length);
        return;
      }
      const line = LOG_LINES[i++];
      if (line.ghosts?.length) {
        setShown((prev) => [...prev, { line, ghost: true }]);
        timers.push(
          setTimeout(() => {
            if (cancelled) return;
            setShown((prev) => prev.map((s) => (s.line === line ? { line, ghost: false } : s)));
            commit();
            timers.push(setTimeout(next, 155));
          }, 190)
        );
      } else {
        setShown((prev) => [...prev, { line, ghost: false }]);
        commit();
        timers.push(setTimeout(next, line.comment ? 50 : 155));
      }
    }
    timers.push(setTimeout(next, 0));

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, []);

  return (
    <div className="log" aria-label="ontology parse log">
      {shown.map(({ line, ghost }, idx) =>
        line.comment ? (
          <div key={idx} className="ln">
            <span className="ghost">{line.s}</span>
          </div>
        ) : ghost ? (
          <div key={idx} className="ln">
            <span className="s">{line.s}</span> <span className="p">{line.p}</span>{" "}
            <span className="ghost">{line.ghosts!.join(" | ")}</span>
          </div>
        ) : (
          <div key={idx} className="ln">
            <span className="s">{line.s}</span> <span className="p">{line.p}</span> <span className="o">{line.o}</span>{" "}
            . <span className="ok">✓</span>
          </div>
        )
      )}
      {!done && <span className="caret" />}
    </div>
  );
}
