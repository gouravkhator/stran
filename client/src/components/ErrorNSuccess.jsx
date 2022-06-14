/** @jsx h */
import { h } from "preact";
import { useSelector } from "react-redux";

export default function ErrorNSuccess() {
  const error = useSelector(({ global }) => global.error);
  const message = useSelector(({ global }) => global.message);

  return (
    <div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p style={{ color: "blue" }}>{message}</p>}
    </div>
  );
}
