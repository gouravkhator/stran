/** @jsx h */
import { h } from "preact";
import CounterLogic from "./Counter.logic";

export default function Counter() {
  const { count, decrement, increment } = CounterLogic();

  return (
    <div>
      Count: {count}
      <button onClick={() => increment()}>Inc</button>
      <button onClick={() => decrement()}>Dec</button>
    </div>
  );
}
