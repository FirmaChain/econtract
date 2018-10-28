import aesjs from 'aes-js'
import FormData from 'form-data';
import jsPDF from "jspdf" 
import pdfjsLib from "pdfjs-dist"
import { Base64 } from 'js-base64'

global.Buffer = require('buffer').Buffer;
global.process = require('process');

const HOST = "test.firma-solutions.com"
//const HOST = "127.0.0.1:9999"

if (typeof btoa === 'undefined') {
  global.btoa = function (str) {
    return new Buffer(str, 'binary').toString('base64');
  };
}

if (typeof atob === 'undefined') {
  global.atob = function (b64Encoded) {
    return new Buffer(b64Encoded, 'base64').toString('binary');
  };
}

Number.prototype.number_format = function(){
  return this.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}
String.prototype.number_format = function(){
  return this.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

export const byte2fct = function(byte){
  if(byte == null || byte == undefined)
    return 0
  return Number( ((byte / 1024 / 1024) / 3).toFixed(2) )
}

export const request = async function(path,method="GET",body=null){
  let resp = await fetch(`http://${HOST}${path}`,{
    method: method,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body:body ? JSON.stringify(body) : null
  })
  let raw = await resp.text()
  try{
    return JSON.parse(raw)
  }catch(err){
  }
  return raw
}

export const encrypt_with_pin = function(raw, p){
    let pin = `${p}`
    let key_256 = new Uint8Array([
        pin[0], pin[1], pin[2], pin[3], 
        pin[1], pin[2], pin[3], pin[4], 
        pin[2], pin[3], pin[4], pin[5], 
        pin[3], pin[4], pin[5], pin[4], 
        pin[4], pin[5], pin[4], pin[3], 
        pin[5], pin[4], pin[3], pin[2], 
        pin[4], pin[3], pin[2], pin[1], 
        pin[3], pin[2], pin[1], pin[0]
    ]);
    let base64 = btoa(unescape(encodeURIComponent( raw )));
    let textBytes = aesjs.utils.utf8.toBytes(base64);

    let aesCtr = new aesjs.ModeOfOperation.ctr(key_256, new aesjs.Counter(5));
    let encrypted = aesCtr.encrypt(textBytes);

    return aesjs.utils.hex.fromBytes(encrypted)
}

export const decrypt_with_pin = function(raw, p){
  let pin = `${p}`
  let key_256 = new Uint8Array([
      pin[0], pin[1], pin[2], pin[3], 
      pin[1], pin[2], pin[3], pin[4], 
      pin[2], pin[3], pin[4], pin[5], 
      pin[3], pin[4], pin[5], pin[4], 
      pin[4], pin[5], pin[4], pin[3], 
      pin[5], pin[4], pin[3], pin[2], 
      pin[4], pin[3], pin[2], pin[1], 
      pin[3], pin[2], pin[1], pin[0]
  ]);

  let textBytes = aesjs.utils.hex.toBytes(raw);

  let aesCtr = new aesjs.ModeOfOperation.ctr(key_256, new aesjs.Counter(5));
  let encrypted = aesCtr.decrypt(textBytes);

  let base64 = aesjs.utils.utf8.fromBytes(encrypted)
  return decodeURIComponent(escape(atob( base64 )));
}

window.ipfs_upload = async function (buf){
    const form = new FormData();
    form.append('file', buf);
    let resp = await global.fetch("https://ipfs.infura.io:5001/api/v0/add",{
        method: 'POST',
        body:form
    })

    let raw = await resp.text()
    try{
      return JSON.parse(raw)
    }catch(err){
    }
    return raw
}
window.ipfs_download = async function (hash){
    let resp = await global.fetch(`https://ipfs.infura.io:5001/api/v0/cat?arg=${hash}`,{
        method: 'GET'
    })

    let raw = await resp.text()
    try{
      return JSON.parse(raw)
    }catch(err){
    }
    return raw
}

window.setCookie = function(name,value,days) {
  var expires = "";
  if (days) {
      var date = new Date();
      date.setTime(date.getTime() + (days*24*60*60*1000));
      expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}
window.getCookie = function(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for(var i=0;i < ca.length;i++) {
      var c = ca[i];
      while (c.charAt(0)==' ') c = c.substring(1,c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
  }
  return null;
}
window.eraseCookie = function(name) {   
  document.cookie = name+'=; Max-Age=-99999999;';  
}

window.clone_object = function (obj) {
  if (obj === null || typeof(obj) !== 'object')
  return obj;

  var copy = obj.constructor();

  for (var attr in obj) {
    if (obj.hasOwnProperty(attr)) {
      copy[attr] = window.clone_object(obj[attr]);
    }
  }

  return copy;
}

function getImgSize(src){
  return new Promise(r=>{
    let img = document.createElement("img")
    img.src = src
    img.onload = function(){

      r({w:img.width, h:img.height})
    }
  })
}
window.pdf = {
  create:function(imgs){
    return new Promise((r)=>{

      for(let img of imgs){
        await getImgSize(img);
      }
      
      let img = document.createElement("img")
      img.src = baseImg
      img.onload = function(){
        let ratio = 595.28 / img.width
        let width = ratio * img.width;
        let height = ratio * img.height;

        let doc = new jsPDF("p","pt","a4")
        doc.setFontSize(40);
        doc.setDrawColor(0);
        doc.setFillColor(255, 255, 255);
        doc.rect(0, 0, img.width,  img.height, 'F');
        doc.addImage(baseImg, "png", 0, 0, width, height, undefined, "none");

        r(doc);
      }
    })
  },
  add:function(doc, element){

  },
  download:function(doc, name=Date.now()){
    doc.save(`${name}.pdf`)
  },
}

function pdf_test(){
  let input = document.createElement("input")
  input.type = "file"
  input.accept=".pdf"

  input.onchange = (e)=>{
    let file = e.target.files[0];
    let reader = new FileReader();
    reader.readAsBinaryString(file)

    reader.onload = async()=>{
      try{
        let pdf = await pdfjsLib.getDocument({data: reader.result}).promise;
        let imgs = []
        for(let i=1; i <= pdf.numPages;i++){
            let page = await pdf.getPage(i)
            let viewport = page.getViewport(1.5);

            let canvas = document.createElement('canvas');
            let context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            let renderContext = {
                canvasContext: context,
                viewport: viewport
            };

            await page.render(renderContext);
            let v = canvas.toDataURL("image/png")
            imgs.push(v);
        }

        console.log(imgs)

        let doc = await window.pdf.create(imgs[0]);
        window.pdf.download(doc)
      }catch(err){
        console.log(err)
        window.alert("PDF 형식이 아닙니다.")
      }
      await window.hideIndicator()
    }
  }
  input.click()
  document.body.append(input)
}

// pdf_test();