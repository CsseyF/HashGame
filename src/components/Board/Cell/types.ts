export enum IdCells {
  A1,
  A2,
  A3,
  B1,
  B2,
  B3,
  C1,
  C2,
  C3,
}

export interface ICellProps {
  cellId: string;
  player: PlayerSelect | null;
}

export enum PlayerSelect {
  PlayerOne,
  PlayerTwo,
}

const StringIsNumber = (value: any) => isNaN(Number(value)) === false;
export const InitialBoardState = Object.keys(IdCells)
.filter(StringIsNumber)
.map((obj) => {
  return {
    cellId: obj,
    player: null,
  };
})