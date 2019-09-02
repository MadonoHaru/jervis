import firebase from "firebase/app"
import "firebase/auth"
import "firebase/storage"
import uuid from "uuid"
import ObservableOperation from "./ObservableOperation"

firebase.initializeApp({
  apiKey: "AIzaSyCL42Zt_fL5Bxj4mgbTcX9T-EOnzhvptbQ",
  authDomain: "jervis-6f57c.firebaseapp.com",
  databaseURL: "https://jervis-6f57c.firebaseio.com",
  projectId: "jervis-6f57c",
  storageBucket: "jervis-6f57c.appspot.com",
  messagingSenderId: "34493730451"
})

const storageRef = firebase.storage().ref()

export const urlShortener = async (url: string, domain: "jervis" | "kancolle") => {
  const apiKey = "AIzaSyCL42Zt_fL5Bxj4mgbTcX9T-EOnzhvptbQ"
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json"
  }
  const body = {
    longDynamicLink: `https://${domain}.page.link/?link=${url}`,
    suffix: {
      option: "SHORT"
    }
  }
  const res = await fetch(`https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=${apiKey}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body)
  })
  const json = await res.json()
  return json as { previewLink: string; shortLink: string } | { error: { code: number } }
}

export const setOperation = async (operation: ObservableOperation) => {
  const file = new File([JSON.stringify(operation)], "name", { type: "application/json" })
  const filePath = `operations/${uuid()}.json`
  const snapshot = await storageRef.child(filePath).put(file)
  return filePath
}

export const getOperation = async (filePath: string) => {
  const url = await storageRef.child(filePath).getDownloadURL()
  const json = await fetch(url).then(res => res.json())
  return ObservableOperation.create(json)
}

let credential: undefined | firebase.auth.AuthCredential
const twitterProvider = new firebase.auth.TwitterAuthProvider()
firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
const login = async () => {
  const result = await firebase.auth().getRedirectResult()

  if (result.credential) {
    credential = result.credential
  } else {
    const res = await firebase.auth().signInWithPopup(twitterProvider)
    if (res.credential) {
      credential = res.credential
    }
    console.log(res)
  }
}

export const testTwitter = async () => {
  if (!credential) {
    console.warn("credential not found")
    return
  }
  const url = await import("../images/ships/banner/394.png")
  const image = new Image()
  image.src = url.default
  const blob = await fetch(url.default).then(res => res.blob())
  const reader = new FileReader()
  reader.onload = () => {
    const base64 = (reader.result as string).replace(/^data:image\/png;.+base64,/, "")
    fetch("https://jervis-server.glitch.me/api/media", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      body: JSON.stringify({ ...credential, base64 })
    }).then(res => res.text().then(str => console.log(str)))
  }
  reader.readAsDataURL(blob)
}
