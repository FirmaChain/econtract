import aesjs from 'aes-js'
import FormData from 'form-data';
import jsPDF from "jspdf" 
import pdfjsLib from "pdfjs-dist"
import { Base64 } from 'js-base64'
import CancelablePromise from 'cancelable-promise';
import html2canvas from "html2canvas"
import { sha256 } from 'js-sha256'
import md5 from 'md5'

// window.Promise = global.Promise = CancelablePromise;

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

function getImg(src){
  return new Promise(r=>{
    let img = document.createElement("img")
    img.src = src
    img.onload = function(){
      r(img)
    }
  })
}

window.pdf = {
  gen:async function(imgs){
    let pdfs = []
    
    for(let i in imgs){
        let div = document.createElement("div")
        div.style.width=800;
        div.style.display="inline-block";
        div.style.position="fixed";
        div.style.left=-9999999999;
        div.style.top=-9999999999;

        document.body.append(div)

        let img = document.createElement("img")
        img.src = imgs[i].img
        img.width=800;
        div.appendChild(img)
        
        let objects = imgs[i].objects
        for(let o of objects){
            let element = null 
            if(o.type == "img"){
                let img = element = document.createElement("img")
                img.src = o.data
            }

            element.width=o.width;
            element.height=o.height;
            element.style.left=o.x;
            element.style.top=o.y;
            element.style.position="absolute";
            div.appendChild(element)
        }

        let canvas = await html2canvas(div)
        pdfs.push({img:canvas.toDataURL("png")})
        div.remove();
    }

    let fileId = md5(JSON.stringify(pdfs));
    let creatationDate = new Date(1540977124241);
    return await window.pdf.make( fileId, creatationDate, pdfs )
  },
  make:function(fileId, creatationDate, imgs, name = Date.now()){
    return new Promise(async(r)=>{
      
      let width = 0;
      let height = 0;
      for(let info of imgs){
        let img = info.i = await getImg(info.img);
        width = width > img.width ? width : img.width
        height = height > img.height ? height : img.height
      }
      
      let doc = new jsPDF("p","px",[width,height],true)
      doc.deletePage(1)
      for(let info of imgs){
        doc.addPage(width, height)
        doc.setFontSize( 40 )
        doc.setDrawColor( 0 )
        doc.setFillColor( 255, 255, 255 )
        doc.rect( 0, 0, width,  height, 'F' )
        doc.addImage( info.img, "png", 0, 0, info.i.width, info.i.height, undefined, "FAST" )
      }

      doc.setCreationDate(creatationDate)
      doc.setFileId(fileId.toUpperCase())
      
      doc.save(name+".pdf")
      r(doc.output("arraybuffer"))
    })
  }
}