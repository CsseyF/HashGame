import React, { useEffect, useRef, useState } from "react";
import { HubConnectionBuilder } from '@microsoft/signalr';
import Cell from "./Cell";
import { ICellProps, IdCells, PlayerSelect } from "./Cell/types";
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

  latestChat.current = chat;

  useEffect(() => {
      const newConnection = new HubConnectionBuilder()
          .withUrl(' https://hashgame-api-production.up.railway.app/hashgame')
          // .withUrl(' http://localhost:5257/hashgame')
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

  const StringIsNumber = (value: any) => isNaN(Number(value)) === false;

  const [round, setRound] = useState<number>(0);
  const [cellsArray, setCellsArray] = useState<ICellProps[]>(
    Object.keys(IdCells)
      .filter(StringIsNumber)
      .map((obj) => {
        return {
          cellId: obj,
          player: null,
        };
      })
  );

  const CheckCurrentPlayer = (round: number) => {
    if (round % 2 === 0) return PlayerSelect.PlayerOne;
    else return PlayerSelect.PlayerTwo;
  };

  const currentPlayer = {
    player: CheckCurrentPlayer(round),
  };

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
