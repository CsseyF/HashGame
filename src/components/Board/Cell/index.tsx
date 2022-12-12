import React, { useEffect } from "react";
import { PlayerSelect } from "./types";
import XIcon from "../../../assets/img/x.png";
import OIcon from "../../../assets/img/o.png";
import "./style.css";

interface Props {
  id: string;
  selectedBy?: PlayerSelect | null;
}

const Cell = (props: Props) => {
  const handleSelect = (): string => {
    if (props.selectedBy === 0) {
      return XIcon;
    }
    if (props.selectedBy === 1) {
      return OIcon;
    } else {
      return "";
    }
  };
  useEffect(() => {
    handleSelect();
  }, [props.selectedBy]);
  return (
    <div className="cell-container">
      <img src={handleSelect()} alt="" className="cell-image" />
    </div>
  );
};

export default Cell;
