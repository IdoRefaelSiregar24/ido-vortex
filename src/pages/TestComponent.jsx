import { useNavigate } from "react-router-dom";
import Button from "../components/Button";

export default function TestComponent({ kodeError, deskripsiError }) {
  return (
    <div>
      <Button variant="primary"> Ini Button Primary</Button>
      <Button variant="secondary"/>
      <Button variant="accent"/>
      <Button variant="gradient"/>
    </div>
    
  );
  ;
}
