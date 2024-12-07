cfg.Portrait, cfg.Light, cfg.MUI;
app.LoadPlugin( "Utils" );

var found = false;
var url = "";
var c;

async function OnStart() {
utils = app.CreateUtils();
b = new Date();
var a = utils.GetObjectFunctionsParameterNames(b);
alert(a);//JSON.stringify(a));
var e = utils.GetObjectFunctionsParameterNames(sendHttpRequest);
alert(e);
    //found = false;
    lay = app.CreateLayout("Linear", "Vertical, Top, FillXY, HCenter");
    txtIp = app.CreateText("IP", 0.8, -1);
    txtIp.SetTextSize( 11);
    lay.AddChild(txtIp);
    txtDN = app.CreateText("Device Name: ", 0.8, -1);
    txtDN.SetTextSize( 11);
    lay.AddChild(txtDN);
    
    app.AddLayout(lay);
    await GetRokuTVIp();
}

async function GetRokuTVIp() {
    ip = app.GetRouterAddress();
    parts = ip.split(".");
    size = parts.length;
    fromNum = parseInt(parts[size - 1]);
    toNum = 256;

    for (c = toNum; c > fromNum; c--) {
        if (found) {
            break;
        }

        url = `http://${parts[0]}.${parts[1]}.${parts[2]}.${c}:8060/query/device-info`;

        try {
            app.ShowPopup(`Checking URL: ${url}`);
            await sendHttpRequest(url);
        } catch (error) {
            app.ShowPopup(`Error at ${url}: ${error}`);
        }
    }
}

function sendHttpRequest(url) {
    return new Promise((resolve, reject) => {
        app.HttpRequest("GET", url, null, null, (error, reply, status) => {
            if (status === 200) {
                found = true;
                txtIp.SetText(url);
               deviceName = reply.slice( reply.indexOf("<friendly-device-name>") + 22, reply.indexOf("</friendly-device-name>") );
               txtDN.SetText( deviceName );
               app.WriteFile( app.GetAppPath()+"/device-info.txt", reply );
                resolve(reply);
            } else {
                reject(error || "Request failed");
            }
        });
    });
}