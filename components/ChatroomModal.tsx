import React, { FC, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  getFirestore,
  collection,
  getDocs,
  QueryDocumentSnapshot,
  doc,
  orderBy,
  query,
  documentId,
  where,
  addDoc,
  Timestamp,
} from "firebase/firestore";
import { useFirestoreCollectionData, useFirestore, useUser } from "reactfire";
import * as ScrollArea from "@radix-ui/react-scroll-area";

interface ChatroomModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  setPlace: (place: any) => void;
  place: any;
  closestMarkerIndex: string[] | null;
}

const getHumanReadableTime = (database_date: any) => {
  const currentDate = new Date();
  const messageDate = new Date(database_date);
  if (
    currentDate.getFullYear() === messageDate.getFullYear() &&
    currentDate.getMonth() === messageDate.getMonth() &&
    currentDate.getDate() === messageDate.getDate()
  ) {
    // If the message date is today, display "Today"
    let hour_minute = new Date(database_date).toLocaleString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
      })
    return String(hour_minute) + ' Today';
  } else {
    // If the message date is older, display the full date
    const humanReadableTime = messageDate.toLocaleString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    return humanReadableTime;
  }
};

export const ChatroomModal: FC<ChatroomModalProps> = ({
  isOpen,
  setIsOpen,
  place,
  setPlace,
  closestMarkerIndex,
}) => {
  if (!place) {
    return null;
  }

  // TODO(ldalton02): set closing functionality to clear place
  const [message, setMessage] = useState("");
  const isLoading = false;

  const firestore = useFirestore();
  const currentUser = useUser();
  const messagesCollection = collection(firestore, "chats");
  const messageQuery = query(
    messagesCollection,
    where("place", "==", `${place.id}`),
    orderBy("time", "desc")
  );

  const { status, data: messages } = useFirestoreCollectionData(messageQuery, {
    idField: "id",
  });


  const openChange = (open: any) => {
    setPlace(null)
    setIsOpen(open)
  }
  console.log(closestMarkerIndex)

  return (
    <Dialog open={isOpen} onOpenChange={openChange}>
      <DialogContent className="h-2/3 w-full border border-solid border border-black">
        <DialogHeader className="space-y-0 grow-0">
          <DialogTitle>{place.name} Chatroom</DialogTitle>
        </DialogHeader>
        <div className="grow h-5/6">
          {status != "loading" && (
            <ScrollArea.Root className="w-full h-full">
              <ScrollArea.Viewport className="w-full h-full rounded">
                <div className="py-[15px] px-5">
                  {messages.map((msg) => (
                    <div
                      className="text-mauve12 text-[13px] leading-[18px] mt-2.5 pt-2.5 border-t border-t-mauve6"
                      key={`${msg.uid}-${msg.time}`}
                    >
                      <div className="flex items-center justify-between">
                        <div>Anonymous</div> {/* Username */}
                        <div>
                          {getHumanReadableTime(msg.time )}
                        </div>{" "}
                        {/* Time */}
                      </div>
                      <div>{msg.message}</div> {/* Message Content */}
                    </div>
                  ))}
                </div>
              </ScrollArea.Viewport>
              <ScrollArea.Scrollbar
                className="flex select-none touch-none p-0.5 bg-blackA3 transition-colors duration-[160ms] ease-out hover:bg-blackA5 data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:h-2.5"
                orientation="vertical"
              >
                <ScrollArea.Thumb className="flex-1 bg-mauve10 rounded-[10px] relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]" />
              </ScrollArea.Scrollbar>
              <ScrollArea.Scrollbar
                className="flex select-none touch-none p-0.5 bg-blackA3 transition-colors duration-[160ms] ease-out hover:bg-blackA5 data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:h-2.5"
                orientation="horizontal"
              >
                <ScrollArea.Thumb className="flex-1 bg-mauve10 rounded-[10px] relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]" />
              </ScrollArea.Scrollbar>
              <ScrollArea.Corner className="bg-blackA5" />
            </ScrollArea.Root>
          )}
        </div>
        {/* (stovsky) set to true for testing purposes to test all chats*/}
        {(false || (closestMarkerIndex?.includes(place.name))) ? (

                <div className="flex flex-row items-end gap-2 text-center h-min">
                {/*TODO(ldalton02): add list here */}
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.currentTarget.value)}
                  disabled={isLoading}
                  type="text"
                  required
                  className="border border-solid border border-black focus:outline-none focus-visible:ring-0"
                />
                <Button
                  disabled={isLoading}
                  onClick={() => {
                    addDoc(collection(firestore, "chats"), {
                      place: place.id,
                      message,
                      time: new Date().getTime(),
                      uid: currentUser.data.uid,
                    });
                    setMessage("")
                  }}
                >
                  {" "}
                  Send
                </Button>
                </div>

                  ) : 

                  <div className="flex justify-center mt-4">
                  <p className="max-w-5xl leading-normal text-muted-foreground sm:text-xl sm:leading-8">
                    Get closer to join the fun!
                  </p>
                          </div> 



        }
      </DialogContent>
    </Dialog>
  );
};