import {
  collection,
  doc,
  onSnapshot,
  query,
  setDoc,
  where,
  WhereFilterOp,
} from "firebase/firestore";
import { ChangeEvent, MouseEvent, useEffect, useMemo, useState } from "react";
import { FormControl, InputGroup } from "react-bootstrap";
import { db, serverStamp } from "../../../config/FirebaseConfig";
import { useAppSelector } from "../../../store/hooks";
import { selectUser } from "../../../store/userSlice";
import MessageChat from "./MessageChat";
//overflow-y: auto: thêm thanh scroll lên xuống khi phần content chat vượt quá chiều cao cố định

export interface Message {
  text: string;
  displayName: string;
  photoURL: string | null;
  roomId: string;
  createdAt: any;
}
interface Props {
  selectedRoom: any | undefined;
}
interface Condition {
  fieldName: string;
  opStr: WhereFilterOp;
  value: string;
}

const ContentRoomChat = ({ selectedRoom }: Props) => {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const roomId = selectedRoom?.id;
  const user = useAppSelector(selectUser);
  const { displayName, photoURL, uid, email } = user;
  const defaultAvatar = "https://graph.facebook.com/403982431236568/picture";
  const createdAt = serverStamp.now().toDate().toDateString();

  const handleMessageChange = (e: ChangeEvent<{ value: string }>) => {
    setText(e.target.value);
  };
  const handleSendMessage = async (e: MouseEvent) => {
    e.preventDefault();
    const messagesRef = doc(collection(db, "messages"));
    await setDoc(messagesRef, {
      photoURL: photoURL,
      email: email,
      displayName: displayName,
      createdAt: createdAt,
      text: text,
      roomId: roomId,
      uid: uid,
    });
    setText("");
  };
  const condition: Condition | undefined = useMemo(() => {
    if (!selectedRoom) return;
    return {
      fieldName: "roomId",
      opStr: "==",
      value: selectedRoom.id,
    };
  }, [selectedRoom]);

  useEffect(() => {
    if (!condition) return;
    const getRooms = async (condition: Condition) => {
      const q = query(
        collection(db, "messages"),
        where(condition.fieldName, condition.opStr, condition.value)
      );
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const items: any[] = [];
        querySnapshot.forEach((doc) => {
          const document: any = doc.data();
          document.id = doc.id;
          items.push(document);
        });
        setMessages(items);
      });
      return () => {
        unsubscribe();
      };
    };
    getRooms(condition);
  }, [condition]);

  return (
    <div className="content__roomchat">
      <div className="content__roomchat-message">
        {messages.map((mes) => (
          <MessageChat
            key={mes.id}
            photoURL={mes.photoURL ? mes.photoURL : defaultAvatar}
            displayName={
              mes.displayName
                ? mes.displayName
                : mes.email?.charAt(0)?.toUpperCase()
            }
            createdAt={createdAt}
            text={mes.text}
            roomId={mes.roomId ? mes.roomId : undefined}
          />
        ))}
      </div>
      <InputGroup>
        <FormControl
          placeholder="Nhập tin nhắn..."
          aria-label="Recipient's username"
          aria-describedby="basic-addon2"
          value={text}
          onChange={handleMessageChange}
        />
        <button
          id="button-addon2"
          className="send-message d-flex align-center justify-center"
          onClick={handleSendMessage}
        >
          <h6 className="mb-0">Gửi</h6>
        </button>
      </InputGroup>
    </div>
  );
};

export default ContentRoomChat;
