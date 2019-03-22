package main

import (
	"fmt"
	"github.com/rakyll/statik/fs"
	"log"
	"net/http"
	"os/exec"
	"runtime"
	_ "toolbox/statik"
)

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

func main()  {
	statikFS, err := fs.New()
	if err != nil {
		log.Fatal(err)
	}
	http.Handle("/", http.StripPrefix("/", http.FileServer(statikFS)))
	openBrowser("http://localhost:8080")
	http.ListenAndServe(":8080", nil)
}

