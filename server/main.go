package main

import (
	"encoding/json"
	"fmt"
	"github.com/gorilla/websocket"
	"github.com/rakyll/statik/fs"
	"github.com/tarm/serial"
	"io"
	"io/ioutil"
	"log"
	"net/http"
	"os/exec"
	"runtime"
	"time"
	_ "toolbox/statik"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func (r *http.Request) bool {return true},
}

var serialPort *serial.Port
var client *websocket.Conn

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
	client = conn;
	for {
		_, p, err := conn.ReadMessage()
		if err != nil {
			log.Println(err)
			continue
		}
		var data = &SocketData{}
		err = json.Unmarshal(p, data)
		if err != nil {
			log.Println(err)
			continue
		}
		log.Println("event " + data.Event + " data " + data.Data)
		if data.Event == "serial" {
			_, err = serialPort.Write([]byte(data.Data))
			if err != nil {
				log.Println(err)
			}
		}
	}
}

type JsonResponse struct {
	Success bool `json:"success"`
	Msg string `json:"msg"`
	Data interface{} `json:"data"`
}

type OpenOptions struct {
	Name string `json:"name"`
	Baud int `json:"baud"`
}

type SocketData struct {
	Event string `json:"event"`
	// base64
	Data string `json:"data"`
}

func responseJson(w http.ResponseWriter, body interface{})  {
	js, err := json.Marshal(body)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.Write(js)
}

func responseSuccess(w http.ResponseWriter, data interface{})  {
	res := JsonResponse{}
	res.Success = true
	res.Data = data
	responseJson(w, res)
}

func responseError(w http.ResponseWriter, msg string)  {
	res := JsonResponse{}
	res.Success = false
	res.Msg = msg
	responseJson(w, res)
}

func serialInfo(w http.ResponseWriter, r *http.Request)  {
	if serialPort == nil {
		responseSuccess(w, false)
		return
	}
	responseSuccess(w, true)
}

func openSerial(w http.ResponseWriter, r *http.Request)  {
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		responseError(w, "请求读取错误")
		return
	}

	var options = &OpenOptions{}
	err = json.Unmarshal(body, options)
	if err != nil {
		log.Println(err)
		responseError(w, "json解析错误")
		return
	}
	sConfig := &serial.Config{Name: options.Name, Baud: options.Baud, ReadTimeout: time.Second * 1}
	_serialPort, err := serial.OpenPort(sConfig)
	if err != nil {
		log.Println(err)
		responseError(w, "串口打开错误" + err.Error())
		return
	}
	serialPort = _serialPort
	go readSerial(serialPort)
	responseSuccess(w, nil)
}

func closeSerial(w http.ResponseWriter, r *http.Request)  {
	if serialPort != nil {
		err := serialPort.Close()
		if err != nil {
			log.Fatal(err)
			responseError(w, "串口关闭失败" + err.Error())
			return
		}
		responseSuccess(w, nil)
		return
	}
	responseError(w, "串口未打开")
}

func readSerial(s *serial.Port) {
	buf := make([]byte, 128)
	for {
		if s == nil {
			log.Println("serial is nil")
			break
		}
		// 读之前等待100毫秒
		time.Sleep(time.Millisecond * 100)
		n, err := s.Read(buf)
		if err == io.EOF {
			//log.Println("EOF")
			continue
		}
		if err != nil {
			//log.Fatal(err)
			log.Println(err)
			continue
		}
		data := SocketData{}
		data.Event = "serial"
		log.Println("serial " + string(buf[:n]))
		data.Data = string(buf[:n])
		err = client.WriteJSON(data)
		if err != nil {
			log.Println(err)
		}
	}
}

func cors(handler func(http.ResponseWriter, *http.Request)) func(http.ResponseWriter, *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		origin := r.Header.Get("Origin")
		w.Header().Set("Access-Control-Allow-Origin", origin)
		if r.Method == "OPTIONS" {
			w.Header().Set("Access-Control-Allow-Credentials", "true")
			w.Header().Set("Access-Control-Allow-Methods", "GET,POST")

			w.Header().Set("Access-Control-Allow-Headers", "Content-Type, X-CSRF-Token, Authorization")
			return
		} else {
			handler(w, r)
		}
	}
}

func HandleFunc(pattern string, handler func(http.ResponseWriter, *http.Request))  {
	http.HandleFunc(pattern, cors(handler))
}

func main()  {
	statikFS, err := fs.New()
	if err != nil {
		log.Fatal(err)
	}
	http.Handle("/", http.StripPrefix("/", http.FileServer(statikFS)))
	HandleFunc("/ws", ws)
	HandleFunc("/openSerial", openSerial)
	HandleFunc("/closeSerial", closeSerial)
	HandleFunc("/serialInfo", serialInfo)
	//openBrowser("http://localhost:8080")
	err = http.ListenAndServe(":8080", nil)
	if err != nil {
		log.Fatal(err)
	}
}

