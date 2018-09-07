const https = require('http');
const URL = require('url');
const queryString=require('querystring')




// cb must be function
// this is the example for supporting both promise and callback
/**
* @param {String} url Must be string for making a request
* @param {String} method by default it is get method can be any http verb
* @param {Object<json||formdata>} body the body for the request
* @param {Object} headers optional headers
* @param {Function} cb Function which is invoked when response is there
*@return {Promise<Object>}
*/


ajax = (url,options={},cb) => {
    options={method:'get', body:null,...options}
    const {method,body,headers}=options;
    let bodyTobeSent=""
    let contentType='application/json'

  if (body&&'json' in body) {
      bodyTobeSent=JSON.parse(body.json);
      contentType='application/json'
  }
  if(body&&'formdata' in body){
    bodyTobeSent=queryString.stringify(body.formdata);
    contentType='application/x-www-form-urlencoded'
  }

    let responseData="";
    return new Promise((resolve, reject) => {
        const parsedUrl = URL.parse(url, true);
        const options = {...parsedUrl,
            method,
            headers:{...headers,'user-agent':'liblessserver','content-type':contentType,'content-length':Buffer.byteLength(bodyTobeSent)},

        }
        const req = https.request(options,(res)=>{
            res.on('data',(data)=>{
                responseData=responseData+data;
            })
            res.on('end',(data)=>{
              if(cb&&typeof(cb)==='function'){
                cb(null,responseData)
              }
              else{
                resolve(responseData);
              }
            })
        });
        req.write(bodyTobeSent);
        req.on('error', (err) => {
            if(cb&&typeof(cb)==='function'){
              cb(err, null);
            }
            else{
              reject(err);
            }
        })

    });
}

/*******************************************************************************
                                    EXAMPLE USES CASE
******************************************************************************/
if(module==require.main){
  ajax('http://localhost:4443/user',{method:'post',body:{formdata:{
  	"firstName":"Anshul",
  	"lastName":"Goel",
  	"phone":"9910326642",
  	"password":"8285578793",
  	"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7Im1vYmlsZSI6Ijk5MTAzMjY2NDIifSwidGltZSI6MTUzMzY0Mjk4NDgyNn0=.URl0Or9K6k9uGC1Gd8IgI1ZVshQx5ffif3zrfSezSgQ=",
  	"statusCode":[200,404,502],
  	"timeOut":"5",
  	"url":"zalonin.com",
  	"protocol":"https",
  	"method":"get"
  }}},(er,data)=>{
    console.log(er,data);
  })
}
