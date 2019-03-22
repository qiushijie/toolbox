package main

import (
	"github.com/tarm/serial"
	"io"
	"log"
	"time"
)

func read(s *serial.Port) {
	buf := make([]byte, 128)
	var result []byte
	for {
		n, err := s.Read(buf)
		if err == io.EOF {
			break
		}
		if err != nil {
			log.Fatal(err)
		}
		//log.Printf("%q", buf[:n])
		result = append(result, buf[:n]...)
	}
	log.Printf("%q", result)
}

func main() {
	c := &serial.Config{Name: "/dev/tty.usbserial", Baud: 115200, ReadTimeout: time.Second * 1}
	s, err := serial.OpenPort(c)
	if err != nil {
		log.Fatal(err)
	}

	//n, err := s.Write([]byte("test"))
	_, err = s.Write([]byte("test"))
	if err != nil {
		log.Fatal(err)
	}
	go read(s);
	//buf := make([]byte, 128)
	//n, err = s.Read(buf)
	//if err != nil {
	//	log.Fatal(err)
	//}
	//log.Printf("%q", buf[:n])
	time.Sleep(2*time.Second)
}