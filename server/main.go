package main

import (
	"fmt"
	"github.com/gorilla/websocket"
	"github.com/rakyll/statik/fs"
	"log"
	"net/http"
	"os/exec"
	"runtime"
	_ "toolbox/statik"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func (r *http.Request) bool {return true},
}

func openBrowser(url string) {
	var err error

	switch runtime.GOOS {
	case "linux":
		err = exec.Command("xdg-open", url).Start()
	case "windows":
		err = exec.Command("rundll32", "url.dll,FileProtocolHandler", url).Start()
	case "darwin":
		err = exec.Command("open", url).Start()
	default:
		err = fmt.Errorf("unsupported platform")
	}
	if err != nil {
		log.Fatal(err)
	}
}


func ws(w http.ResponseWriter, r*http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Fatal(err)
	}
	for {
		messageType, p, err := conn.ReadMessage()
		if err != nil {
			log.Println(err)
			return
		}
		//websocket.BinaryMessage
		//websocket.TextMessage
		if err := conn.WriteMessage(messageType, p); err != nil {
			log.Println(err)
			return
		}
	}
	//c.WriteMessage(1, []byte("test"))
}


func main()  {
	statikFS, err := fs.New()
	if err != nil {
		log.Fatal(err)
	}
	http.Handle("/", http.StripPrefix("/", http.FileServer(statikFS)))
	http.HandleFunc("/ws", ws)
	//openBrowser("http://localhost:8080")
	err = http.ListenAndServe(":8080", nil)
	if err != nil {
		log.Fatal(err)
	}
}

