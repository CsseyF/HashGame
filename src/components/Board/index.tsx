import React, { useEffect, useRef, useState } from "react";
import { HubConnectionBuilder } from '@microsoft/signalr';
import Cell from "./Cell";
import { ICellProps, IdCells, InitialBoardState, PlayerSelect } from "./Cell/types";
import "./style.css";
import { useParams } from 'react-router-dom';
import LoadingOverlay from "../LoadingOverlay";

const Board = () => {

  //WebSocket
  const [ connection, setConnection ] = useState<any>(null);
  const [ chat, setChat ] = useState<{user: string, message: any}[]>([]);
  const latestChat = useRef<any>(null);
  const [player, setPlayer] = useState<string>("");
  const [blockGame, setBlockGame] = useState<boolean>(false);
  const [waitingHandler, setWaitingHandler] = useState<boolean>(true);
  let { id } = useParams();
  const roomId = id!;

  const winsCombinations = [
    ['0', '1', '2'],
    ['3', '4', '5'],
    ['6', '7', '8'],
    ['0', '3', '6'],
    ['1', '4', '7'],
    ['2', '5', '8'],
    ['0', '4', '8'],
    ['2', '4', '6']
  ]
  const players = {
    [PlayerSelect.PlayerOne] : 0,
    [PlayerSelect.PlayerTwo] : 1,
  }

  latestChat.current = chat;

  useEffect(() => {
      const newConnection = new HubConnectionBuilder()
          // .withUrl(' https://hashgame-api-production.up.railway.app/hashgame')
          .withUrl(' http://localhost:5257/hashgame')
          .withAutomaticReconnect()
          .build();

      setConnection(newConnection);
  }, []);

  useEffect(() => {
      if (connection) {
          connection.start()
              .then((result: any) => {
                  console.log('Connected!');
                  joinRoom(roomId)
                  connection.on('ReceiveMessage', (message : any) => {
                      const updatedChat = [...latestChat.current];
                      updatedChat.push(message);
                      setChat(updatedChat);
                  });
              })
              .catch((e : any) => console.log('Connection failed: ', e));
      }
  }, [connection]);

  const joinRoom = async (roomId: string) => {
    try{
      await connection.send('JoinRoom', roomId);
      console.log('Connected sucessfully to room', roomId)
    }
    catch(e) {
      console.log(e);
    }
  }

  const sendMessage = async (user : string, message: string) => {
      const chatMessage = {
          user: user,
          message: message
      };
          try {

              await connection.send('SendMessage', chatMessage, roomId);
          }
          catch(e) {
              console.log(e);
          }
      }



  const [round, setRound] = useState<number>(0);
  const [cellsArray, setCellsArray] = useState<ICellProps[]>(InitialBoardState);

  const CheckCurrentPlayer = (round: number) => {
    if (round % 2 === 0) return PlayerSelect.PlayerOne;
    else return PlayerSelect.PlayerTwo;
  };

  const currentPlayer = {
    player: CheckCurrentPlayer(round),
  };
  // const allEqual = (arr : ICellProps[])  => arr.every(val => val.player === arr[0].player);

  const checkWin = () => {
    const currentCells = cellsArray.filter(cell => cell.player !== null);
    const sortedCells = currentCells.sort((a, b) => players[a.player!] - players[b.player!])
    const cellsGroups = new Array(Math.ceil(sortedCells.length / 3))
      .fill('')
      .map(_ => sortedCells.splice(0, 3));
    
      winsCombinations.map(combination => {
        const tempArr = cellsGroups.map(item => item.sort().map(item2 => item2.cellId)).sort()
        if(tempArr.some(a => combination.every((v, i) => v === a[i]))){
          sendMessage("EndGame", "Game ended!")
        }
      })
  }

  const handlePlay = (cell: ICellProps) => {
    if (cell.player !== null) return;
    if(blockGame === true) return;

    setCellsArray(
      cellsArray.map((item) =>
        item.cellId === cell.cellId
          ? { ...item, player: currentPlayer.player }
          : { ...item }
      )
    );

    sendMessage(player + `%${Object.keys(PlayerSelect)[currentPlayer.player]}`, cell.cellId)
  };

  useEffect(()=> {
    chat.map((message) => {
      setCellsArray(
        cellsArray.map((item) =>
          item.cellId === message?.message
            ? { ...item, player: Object.keys(PlayerSelect).indexOf(message?.user.split("%")[1])}
            : { ...item }
        )
      );
      
      if(message.user === "System" &&  player === "" ){
        setPlayer(message.message);
        const index = chat.indexOf(message);
        chat.splice(index, 1);
      }
      if(message.user === "System" || message.user === "Host"){
        if( player !== "" && waitingHandler === true){
          setWaitingHandler(false);
          sendMessage("Host", "Match Begin");
        }
      }
      if(message.user === "EndGame"){
        setBlockGame(true);
        setCellsArray(InitialBoardState)
        setRound(0);
      }
      console.log(message)
    })
    if(player !== "" && chat[chat.length - 1]?.user !== "System"){
      setRound(round + 1);
    }
    if(chat.slice(-1)[0]?.user.split("%")[0] === player){
      setBlockGame(true);
    }
    else{
      setBlockGame(false);
    }
    checkWin();
  },[chat])


  return (
    <div className="main-board">
      <LoadingOverlay
        show={waitingHandler}
        relative
      />
      <h2 className="board-title">Your room: {roomId}</h2>
      {cellsArray.map((item) => (
        <div onClick={() => handlePlay(item)}>
          <Cell id={item.cellId} selectedBy={item.player} />
        </div>
      ))}
      <h2>Round: {round}</h2>
    </div>
  );
};

export default Board;
