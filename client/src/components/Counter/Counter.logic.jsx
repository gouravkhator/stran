import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "preact/hooks";
import { setError } from "../../store/actions";

export default function CounterLogic() {
  const count = useSelector(({ counter }) => counter.count);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setError(null));
    console.log({ countChangedTo: count });
  }, [count]);

  const increment = () => {
    dispatch({ type: "INC" });
  };

  const decrement = () => {
    if (count <= 0) {
      // already count is less than or equal to 0, so we should stop the decrement
      dispatch(setError("Cannot decrement to less than 0"));
    } else {
      dispatch({ type: "DEC" });
    }
  };

  return {
    increment,
    decrement,
    count,
  };
}
