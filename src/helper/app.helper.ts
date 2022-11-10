


export  const   calculateDistance =(x1:number, y1:number, x2:number, y2:number)=>{
    return Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2));
}


export const drawBox = (ctx: any, prediction: any) => {
    const x = prediction.box.xMin;
    const y = prediction.box.yMin;
    const width = prediction.box.width;
    const height = prediction.box.height;
    ctx.beginPath();
    ctx.rect(x, y, width, height);
    ctx.strokeStyle = "red";
    ctx.stroke();
  };


 export const DataURIToBlob=(dataURI: string|null|undefined)=> {
    const splitDataURI = dataURI!.split(',')
    const byteString = splitDataURI[0].indexOf('base64') >= 0 ? atob(splitDataURI[1]) : decodeURI(splitDataURI[1])
    const mimeString = splitDataURI[0].split(':')[1].split(';')[0]

    const ia = new Uint8Array(byteString.length)
    for (let i = 0; i < byteString.length; i++)
        ia[i] = byteString.charCodeAt(i)

    return new Blob([ia],{type:"jpeg"});
  }


  export  function dataURLtoFile(dataurl:any, filename:any) {
 
    var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), 
        n = bstr.length, 
        u8arr = new Uint8Array(n);
        
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    
    return new File([u8arr], filename, {type:'image/jpeg'});
}
