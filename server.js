require("dotenv").config();
var SpotifyWebApi = require("spotify-web-api-node");
const express = require("express");
const cors = require("cors");
const path = require("path");
var fs = require("fs");
const PORT = process.env.PORT || 5000;

const scopes = [
  "ugc-image-upload",
  "user-read-playback-state",
  "user-modify-playback-state",
  "user-read-currently-playing",
  "streaming",
  "app-remote-control",
  "user-read-email",
  "user-read-private",
  "playlist-read-collaborative",
  "playlist-modify-public",
  "playlist-read-private",
  "playlist-modify-private",
  "user-library-modify",
  "user-library-read",
  "user-top-read",
  "user-read-playback-position",
  "user-read-recently-played",
  "user-follow-read",
  "user-follow-modify",
];

var spotifyApi = new SpotifyWebApi({
  clientId: process.env.clientId,
  clientSecret: process.env.clientSecret,
  redirectUri: process.env.redirectUri,
});

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));
app.use(cors());

// EJS configuration
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");

// authorize
app.get("/", (_, res) => {
  res.redirect(spotifyApi.createAuthorizeURL(scopes));
});

function refresh() {
  console.log("ya");
}

app.get("/callback", (req, res) => {
  const error = req.query.error;
  const code = req.query.code;
  const state = req.query.state;

  if (error) {
    console.error("Callback Error:", error);
    // res.send(`Callback Error: ${error}`);
    res.render("error");
    return;
  }

  spotifyApi
    .authorizationCodeGrant(code)
    .then((data) => {
      const access_token = data.body["access_token"];
      const refresh_token = data.body["refresh_token"];
      const expires_in = data.body["expires_in"];

      spotifyApi.setAccessToken(access_token);
      spotifyApi.setRefreshToken(refresh_token);

      //   console.log("access_token:", access_token);
      //   console.log("refresh_token:", refresh_token);

      console.log(
        `Sucessfully retreived access token. Expires in ${expires_in} s.`
      );

      res.redirect(
        "https://spotify-currently-listening.herokuapp.com/currentsong"
      );
      // res.redirect("http://localhost:5000/currentsong");
      // res.send("Success! You can now close the window.");

      setInterval(async () => {
        try {
          const data = await spotifyApi.refreshAccessToken();
          const access_token = data.body["access_token"];

          console.log("The access token has been refreshed! [in callback]");
          // console.log("access_token:", access_token);
          spotifyApi.setAccessToken(access_token);
        } catch (error) {
          console.log("error in callbackfunction");
        }
      }, 60 * 1000);
    })
    .catch((error) => {
      console.error("Error getting Tokens:", error);
      res.render("error");
    });
});

app.get("/currentsong", (_, res) => {
  setInterval(async () => {
    try {
      const data = await spotifyApi.refreshAccessToken();
      const access_token = data.body["access_token"];

      console.log("The access token has been refreshed! [in currentsong]");
      // console.log("access_token:", access_token);
      spotifyApi.setAccessToken(access_token);
    } catch (error) {
      console.log("error in /currentsong");
    }
  }, 60 * 1000);
  let datasvg = `<svg width="400" style="height:auto;" viewBox="0 0 400 102" fill="none"
  xmlns="http://www.w3.org/2000/svg">
  <style id="__jsx-1267595980">[class*=ant-]::-ms-clear,[class^=ant-]::-ms-clear{display:none;}[class*=ant-],[class*=ant-] *,[class*=ant-]:after,[class*=ant-]:before,[class^=ant-],[class^=ant-] *,[class^=ant-]:after,[class^=ant-]:before{-webkit-box-sizing:border-box;box-sizing:border-box;}body,html{width:100%;height:100%;}*,:after,:before{-webkit-box-sizing:border-box;box-sizing:border-box;}html{font-family:sans-serif;line-height:1.15;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;-ms-overflow-style:scrollbar;-webkit-tap-highlight-color:rgba(0,0,0,0);}@-ms-viewport{{width:device-width;}}body{margin:0;color:hsla(0,0%,100%,.85);font-size:14px;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;font-variant:tabular-nums;line-height:1.5715;background-color:#000;-webkit-font-feature-settings:"tnum";font-feature-settings:"tnum";}h4{margin-top:0;margin-bottom:.5em;color:hsla(0,0%,100%,.85);font-weight:500;}ul{margin-top:0;margin-bottom:1em;}a{color:#177ddc;-webkit-text-decoration:none;text-decoration:none;background-color:transparent;outline:none;cursor:pointer;-webkit-transition:color .3s;-webkit-transition:color .3s;transition:color .3s;-webkit-text-decoration-skip:objects;}a:hover{color:#165996;}a:active{color:#388ed3;}a:active,a:focus,a:hover{-webkit-text-decoration:none;text-decoration:none;outline:0;}img{vertical-align:middle;border-style:none;}svg:not(:root){overflow:hidden;}a{-ms-touch-action:manipulation;touch-action:manipulation;}::-webkit-file-upload-button{font:inherit;-webkit-appearance:button;}::-moz-selection{color:#fff;background:#177ddc;}::selection{color:#fff;background:#177ddc;}html{--antd-wave-shadow-color:#177ddc;--scroll-bar:0;}.ant-avatar{-webkit-box-sizing:border-box;box-sizing:border-box;margin:0;padding:0;color:hsla(0,0%,100%,.85);font-size:14px;font-variant:tabular-nums;line-height:1.5715;list-style:none;-webkit-font-feature-settings:"tnum";font-feature-settings:"tnum";position:relative;display:inline-block;overflow:hidden;color:#fff;white-space:nowrap;text-align:center;vertical-align:middle;background:hsla(0,0%,100%,.3);width:32px;height:32px;line-height:32px;border-radius:50%;}.ant-avatar-image{background:transparent;}.ant-avatar-square{border-radius:2px;}.ant-avatar>img{display:block;width:100%;height:100%;-o-object-fit:cover;object-fit:cover;}.ant-cascader-picker-label:hover+.ant-cascader-input:not(.ant-cascader-picker-disabled .ant-cascader-picker-label:hover+.ant-cascader-input){border-color:#165996;border-right-width:1px!important;}.ant-comment-content-author-name>:hover{color:hsla(0,0%,100%,.45);}_:-ms-fullscreen .ant-picker-range-wrapper .ant-picker-month-panel .ant-picker-cell,_:-ms-fullscreen .ant-picker-range-wrapper .ant-picker-year-panel .ant-picker-cell{padding:21px 0;}.ant-image{position:relative;display:inline-block;}.ant-image-img{display:block;width:100%;height:auto;}.ant-list{-webkit-box-sizing:border-box;box-sizing:border-box;margin:0;padding:0;color:hsla(0,0%,100%,.85);font-size:14px;font-variant:tabular-nums;line-height:1.5715;list-style:none;-webkit-font-feature-settings:"tnum";font-feature-settings:"tnum";position:relative;}.ant-list *{outline:none;}.ant-list-items{margin:0;padding:0;list-style:none;}.ant-list-item{-webkit-box-align:center;-ms-flex-align:center;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:justify;-ms-flex-pack:justify;-webkit-box-pack:justify;-webkit-justify-content:space-between;-ms-flex-pack:justify;justify-content:space-between;padding:12px 0;color:hsla(0,0%,100%,.85);}.ant-list-item,.ant-list-item-meta{display:-webkit-box;display:-ms-flexbox;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;}.ant-list-item-meta{-webkit-box-flex:1;-ms-flex:1;-webkit-flex:1;-ms-flex:1;flex:1;-webkit-box-align:start;-ms-flex-align:start;-webkit-align-items:flex-start;-webkit-box-align:flex-start;-ms-flex-align:flex-start;align-items:flex-start;max-width:100%;}.ant-list-item-meta-avatar{margin-right:16px;}.ant-list-item-meta-content{-webkit-box-flex:1;-ms-flex:1 0;-webkit-flex:1 0;-ms-flex:1 0;flex:1 0;width:0;color:hsla(0,0%,100%,.85);}.ant-list-item-meta-title{margin-bottom:4px;color:hsla(0,0%,100%,.85);font-size:14px;line-height:1.5715;}.ant-list-item-meta-title>a{color:hsla(0,0%,100%,.85);-webkit-transition:all .3s;-webkit-transition:all .3s;transition:all .3s;}.ant-list-item-meta-title>a:hover{color:#177ddc;}.ant-list-item-meta-description{color:hsla(0,0%,100%,.45);font-size:14px;line-height:1.5715;}.ant-list-header{background:transparent;}.ant-list-header{padding-top:12px;padding-bottom:12px;}.ant-list-split .ant-list-item{border-bottom:1px solid #303030;}.ant-list-split .ant-list-item:last-child{border-bottom:none;}.ant-list-split .ant-list-header{border-bottom:1px solid #303030;}.ant-list-sm .ant-list-item{padding:8px 16px;}.ant-list-bordered{border:1px solid #434343;border-radius:2px;}.ant-list-bordered .ant-list-header,.ant-list-bordered .ant-list-item{padding-right:24px;padding-left:24px;}.ant-list-bordered.ant-list-sm .ant-list-header,.ant-list-bordered.ant-list-sm .ant-list-item{padding:8px 16px;}@media screen and (max-width:576px){.ant-list-item{-ms-flex-wrap:wrap;-webkit-flex-wrap:wrap;-ms-flex-wrap:wrap;flex-wrap:wrap;}}@supports (-moz-appearance:meterbar){}.ant-space{display:-webkit-inline-box;display:-ms-inline-flexbox;display:-webkit-inline-box;display:-webkit-inline-flex;display:-ms-inline-flexbox;display:inline-flex;}.ant-space-align-center{-webkit-box-align:center;-ms-flex-align:center;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;}.ant-spin-nested-loading{position:relative;}.ant-spin-container{position:relative;-webkit-transition:opacity .3s;-webkit-transition:opacity .3s;transition:opacity .3s;}.ant-spin-container:after{position:absolute;top:0;right:0;bottom:0;left:0;z-index:10;display:none\9;width:100%;height:100%;background:#141414;opacity:0;-webkit-transition:all .3s;-webkit-transition:all .3s;transition:all .3s;content:"";pointer-events:none;}.ant-select-tree-focused:not(:hover):not(.ant-select-tree-active-focused){background:#111b26;}.ant-tree-focused:not(:hover):not(.ant-tree-active-focused){background:#111b26;}.ant-typography{color:hsla(0,0%,100%,.85);overflow-wrap:break-word;}.ant-typography.ant-typography-secondary{color:hsla(0,0%,100%,.45);}</style>
  <style id="__jsx-3161645521">svg{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,'Noto Sans',sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol','Noto Color Emoji';color:white;}.spotify-title{vertical-align:middle;font-size:16px;}.spotify-icon{margin-right:10px;}.spotify-icon>img{padding-bottom:0px;}a.a-spotify:hover{color:#1db954 !important;}.ellipsis-overflow{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}.ant-list-bordered{border:initial;}.ant-list{font-size:0.8rem;}.ant-list-item-meta-avatar{-webkit-align-self:center;-ms-flex-item-align:center;align-self:center;}.ant-list-item-meta-title{font-size:0.8rem;margin-bottom:0px !important;}.ant-list-item-meta-description{font-size:0.8rem;}.track-item{padding:8px 12px !important;}.timestamp{font-size:0.7rem;margin-left:5px;}</style>

  <g>
      <rect data-testid="card-bg" x="0" y="0" rx="10" height="100%" stroke="#212121" width="300" fill="#212121" stroke-opacity="1"></rect>
      <foreignObject x="0" y="0" width="300" height="100">
          <div xmlns="http://www.w3.org/1999/xhtml" style="color:white">
              <div class="ant-list ant-list-sm ant-list-split ant-list-bordered">
                  <div class="ant-list-header">
                      <div style="display:flex">
                          <div class="ant-space ant-space-horizontal ant-space-align-center">
                              <div class="ant-space-item" style="margin-right:8px">
      
                                      <div class="ant-image" style="width:100px">
                                          <img class="ant-image-img spotify-icon" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBoZWlnaHQ9IjE2OHB4IiB3aWR0aD0iNTU5cHgiIHZlcnNpb249IjEuMSIgdmlld0JveD0iMCAwIDU1OSAxNjgiPgogPHBhdGggZmlsbD0iIzFFRDc2MCIgZD0ibTgzLjk5NiAwLjI3N2MtNDYuMjQ5IDAtODMuNzQzIDM3LjQ5My04My43NDMgODMuNzQyIDAgNDYuMjUxIDM3LjQ5NCA4My43NDEgODMuNzQzIDgzLjc0MSA0Ni4yNTQgMCA4My43NDQtMzcuNDkgODMuNzQ0LTgzLjc0MSAwLTQ2LjI0Ni0zNy40OS04My43MzgtODMuNzQ1LTgzLjczOGwwLjAwMS0wLjAwNHptMzguNDA0IDEyMC43OGMtMS41IDIuNDYtNC43MiAzLjI0LTcuMTggMS43My0xOS42NjItMTIuMDEtNDQuNDE0LTE0LjczLTczLjU2NC04LjA3LTIuODA5IDAuNjQtNS42MDktMS4xMi02LjI0OS0zLjkzLTAuNjQzLTIuODEgMS4xMS01LjYxIDMuOTI2LTYuMjUgMzEuOS03LjI4OCA1OS4yNjMtNC4xNSA4MS4zMzcgOS4zNCAyLjQ2IDEuNTEgMy4yNCA0LjcyIDEuNzMgNy4xOHptMTAuMjUtMjIuODAyYy0xLjg5IDMuMDcyLTUuOTEgNC4wNDItOC45OCAyLjE1Mi0yMi41MS0xMy44MzYtNTYuODIzLTE3Ljg0My04My40NDgtOS43NjEtMy40NTMgMS4wNDMtNy4xLTAuOTAzLTguMTQ4LTQuMzUtMS4wNC0zLjQ1MyAwLjkwNy03LjA5MyA0LjM1NC04LjE0MyAzMC40MTMtOS4yMjggNjguMjIyLTQuNzU4IDk0LjA3MiAxMS4xMjcgMy4wNyAxLjg5IDQuMDQgNS45MSAyLjE1IDguOTc2di0wLjAwMXptMC44OC0yMy43NDRjLTI2Ljk5LTE2LjAzMS03MS41Mi0xNy41MDUtOTcuMjg5LTkuNjg0LTQuMTM4IDEuMjU1LTguNTE0LTEuMDgxLTkuNzY4LTUuMjE5LTEuMjU0LTQuMTQgMS4wOC04LjUxMyA1LjIyMS05Ljc3MSAyOS41ODEtOC45OCA3OC43NTYtNy4yNDUgMTA5LjgzIDExLjIwMiAzLjczIDIuMjA5IDQuOTUgNy4wMTYgMi43NCAxMC43MzMtMi4yIDMuNzIyLTcuMDIgNC45NDktMTAuNzMgMi43Mzl6bTk0LjU2IDMuMDcyYy0xNC40Ni0zLjQ0OC0xNy4wMy01Ljg2OC0xNy4wMy0xMC45NTMgMC00LjgwNCA0LjUyLTguMDM3IDExLjI1LTguMDM3IDYuNTIgMCAxMi45OCAyLjQ1NSAxOS43NiA3LjUwOSAwLjIgMC4xNTMgMC40NiAwLjIxNCAwLjcxIDAuMTc0IDAuMjYtMC4wMzggMC40OC0wLjE3NyAwLjYzLTAuMzg2bDcuMDYtOS45NTJjMC4yOS0wLjQxIDAuMjEtMC45NzUtMC4xOC0xLjI4OC04LjA3LTYuNDczLTE3LjE1LTkuNjItMjcuNzctOS42Mi0xNS42MSAwLTI2LjUyIDkuMzY5LTI2LjUyIDIyLjc3NCAwIDE0LjM3NSA5LjQxIDE5LjQ2NSAyNS42NyAyMy4zOTQgMTMuODMgMy4xODcgMTYuMTcgNS44NTcgMTYuMTcgMTAuNjI5IDAgNS4yOS00LjcyIDguNTgtMTIuMzIgOC41OC04LjQ0IDAtMTUuMzMtMi44NS0yMy4wMy05LjUxLTAuMTktMC4xNy0wLjQ1LTAuMjQtMC42OS0wLjIzLTAuMjYgMC4wMi0wLjQ5IDAuMTQtMC42NSAwLjMzbC03LjkyIDkuNDJjLTAuMzMgMC40LTAuMjkgMC45OCAwLjA5IDEuMzIgOC45NiA4IDE5Ljk4IDEyLjIyIDMxLjg4IDEyLjIyIDE2LjgyIDAgMjcuNjktOS4xOSAyNy42OS0yMy40MiAwLjAzLTEyLjAwNy03LjE2LTE4LjY1Ny0yNC43Ny0yMi45NDFsLTAuMDMtMC4wMTN6bTYyLjg2LTE0LjI2Yy03LjI5IDAtMTMuMjcgMi44NzItMTguMjEgOC43NTd2LTYuNjI0YzAtMC41MjMtMC40Mi0wLjk0OS0wLjk0LTAuOTQ5aC0xMi45NWMtMC41MiAwLTAuOTQgMC40MjYtMC45NCAwLjk0OXY3My42MDFjMCAwLjUyIDAuNDIgMC45NSAwLjk0IDAuOTVoMTIuOTVjMC41MiAwIDAuOTQtMC40MyAwLjk0LTAuOTV2LTIzLjIzYzQuOTQgNS41MyAxMC45MiA4LjI0IDE4LjIxIDguMjQgMTMuNTUgMCAyNy4yNy0xMC40MyAyNy4yNy0zMC4zNjkgMC4wMi0xOS45NDMtMTMuNy0zMC4zNzYtMjcuMjYtMzAuMzc2bC0wLjAxIDAuMDAxem0xMi4yMSAzMC4zNzVjMCAxMC4xNDktNi4yNSAxNy4yMzktMTUuMjEgMTcuMjM5LTguODUgMC0xNS41My03LjQxLTE1LjUzLTE3LjIzOSAwLTkuODMgNi42OC0xNy4yMzggMTUuNTMtMTcuMjM4IDguODEtMC4wMDEgMTUuMjEgNy4yNDcgMTUuMjEgMTcuMjM3djAuMDAxem01MC4yMS0zMC4zNzVjLTE3LjQ1IDAtMzEuMTIgMTMuNDM2LTMxLjEyIDMwLjU5MiAwIDE2Ljk3MiAxMy41OCAzMC4yNjIgMzAuOTEgMzAuMjYyIDE3LjUxIDAgMzEuMjItMTMuMzkgMzEuMjItMzAuNDc5IDAtMTcuMDMxLTEzLjYyLTMwLjM3My0zMS4wMS0zMC4zNzN2LTAuMDAyem0wIDQ3LjcxNGMtOS4yOCAwLTE2LjI4LTcuNDYtMTYuMjgtMTcuMzQ0IDAtOS45MjkgNi43Ni0xNy4xMzQgMTYuMDctMTcuMTM0IDkuMzQgMCAxNi4zOCA3LjQ1NyAxNi4zOCAxNy4zNTEgMCA5LjkyNy02LjggMTcuMTI3LTE2LjE3IDE3LjEyN3ptNjguMjctNDYuNTNoLTE0LjI1di0xNC41NjZjMC0wLjUyMi0wLjQyLTAuOTQ4LTAuOTQtMC45NDhoLTEyLjk1Yy0wLjUyIDAtMC45NSAwLjQyNi0wLjk1IDAuOTQ4djE0LjU2NmgtNi4yMmMtMC41MiAwLTAuOTQgMC40MjYtMC45NCAwLjk0OXYxMS4xMjdjMCAwLjUyMiAwLjQyIDAuOTQ5IDAuOTQgMC45NDloNi4yMnYyOC43OTVjMCAxMS42MyA1Ljc5IDE3LjUzIDE3LjIyIDE3LjUzIDQuNjQgMCA4LjQ5LTAuOTYgMTIuMTItMy4wMiAwLjMtMC4xNiAwLjQ4LTAuNDggMC40OC0wLjgydi0xMC42YzAtMC4zMi0wLjE3LTAuNjMtMC40NS0wLjgtMC4yOC0wLjE4LTAuNjMtMC4xOS0wLjkyLTAuMDQtMi40OSAxLjI1LTQuOSAxLjgzLTcuNiAxLjgzLTQuMTUgMC02LjAxLTEuODktNi4wMS02LjExdi0yNi43NmgxNC4yNWMwLjUyIDAgMC45NC0wLjQyNiAwLjk0LTAuOTQ5di0xMS4xMjZjMC4wMi0wLjUyMy0wLjQtMC45NDktMC45My0wLjk0OWwtMC4wMS0wLjAwNnptNDkuNjQgMC4wNTd2LTEuNzg5YzAtNS4yNjMgMi4wMi03LjYxIDYuNTQtNy42MSAyLjcgMCA0Ljg3IDAuNTM2IDcuMyAxLjM0NiAwLjMgMC4wOTQgMC42MSAwLjA0NyAwLjg1LTAuMTMyIDAuMjUtMC4xNzkgMC4zOS0wLjQ2NiAwLjM5LTAuNzd2LTEwLjkxYzAtMC40MTctMC4yNi0wLjc4Ni0wLjY3LTAuOTA5LTIuNTYtMC43NjMtNS44NC0xLjU0Ni0xMC43Ni0xLjU0Ni0xMS45NSAwLTE4LjI4IDYuNzM0LTE4LjI4IDE5LjQ2N3YyLjc0aC02LjIyYy0wLjUyIDAtMC45NSAwLjQyNi0wLjk1IDAuOTQ4djExLjE4NGMwIDAuNTIyIDAuNDMgMC45NDkgMC45NSAwLjk0OWg2LjIydjQ0LjQwNWMwIDAuNTMgMC40MyAwLjk1IDAuOTUgMC45NWgxMi45NGMwLjUzIDAgMC45NS0wLjQyIDAuOTUtMC45NXYtNDQuNDAyaDEyLjA5bDE4LjUyIDQ0LjQwMmMtMi4xIDQuNjYtNC4xNyA1LjU5LTYuOTkgNS41OS0yLjI4IDAtNC42OS0wLjY4LTcuMTQtMi4wMy0wLjIzLTAuMTItMC41MS0wLjE0LTAuNzUtMC4wNy0wLjI1IDAuMDktMC40NiAwLjI3LTAuNTYgMC41MWwtNC4zOSA5LjYzYy0wLjIxIDAuNDYtMC4wMyAwLjk5IDAuNDEgMS4yMyA0LjU4IDIuNDggOC43MSAzLjU0IDEzLjgyIDMuNTQgOS41NiAwIDE0Ljg1LTQuNDYgMTkuNS0xNi40NGwyMi40Ni01OC4wMzdjMC4xMi0wLjI5MiAwLjA4LTAuNjIyLTAuMS0wLjg4MS0wLjE3LTAuMjU3LTAuNDYtMC40MTItMC43Ny0wLjQxMmgtMTMuNDhjLTAuNDEgMC0wLjc3IDAuMjU3LTAuOSAwLjYzNmwtMTMuODEgMzkuNDM0LTE1LjEyLTM5LjQ2Yy0wLjE0LTAuMzY3LTAuNDktMC42MS0wLjg4LTAuNjFoLTIyLjEydi0wLjAwM3ptLTI4Ljc4LTAuMDU3aC0xMi45NWMtMC41MiAwLTAuOTUgMC40MjYtMC45NSAwLjk0OXY1Ni40ODFjMCAwLjUzIDAuNDMgMC45NSAwLjk1IDAuOTVoMTIuOTVjMC41MiAwIDAuOTUtMC40MiAwLjk1LTAuOTV2LTU2LjQ3N2MwLTAuNTIzLTAuNDItMC45NDktMC45NS0wLjk0OXYtMC4wMDR6bS02LjQtMjUuNzE5Yy01LjEzIDAtOS4yOSA0LjE1Mi05LjI5IDkuMjgxIDAgNS4xMzIgNC4xNiA5LjI4OSA5LjI5IDkuMjg5czkuMjgtNC4xNTcgOS4yOC05LjI4OWMwLTUuMTI4LTQuMTYtOS4yODEtOS4yOC05LjI4MXptMTEzLjQyIDQzLjg4Yy01LjEyIDAtOS4xMS00LjExNS05LjExLTkuMTEyczQuMDQtOS4xNTkgOS4xNi05LjE1OSA5LjExIDQuMTE0IDkuMTEgOS4xMDdjMCA0Ljk5Ny00LjA0IDkuMTY0LTkuMTYgOS4xNjR6bTAuMDUtMTcuMzY1Yy00LjY3IDAtOC4yIDMuNzEtOC4yIDguMjUzIDAgNC41NDEgMy41MSA4LjIwMSA4LjE1IDguMjAxIDQuNjcgMCA4LjItMy43MDcgOC4yLTguMjUzIDAtNC41NDEtMy41MS04LjIwMS04LjE1LTguMjAxem0yLjAyIDkuMTM4bDIuNTggMy42MDhoLTIuMThsLTIuMzItMy4zMWgtMS45OXYzLjMxaC0xLjgydi05LjU2NGg0LjI2YzIuMjMgMCAzLjY5IDEuMTM3IDMuNjkgMy4wNTEgMC4wMSAxLjU2OC0wLjkgMi41MjYtMi4yMSAyLjkwNWgtMC4wMXptLTEuNTQtNC4zMTVoLTIuMzd2My4wMjVoMi4zN2MxLjE4IDAgMS44OS0wLjU3OSAxLjg5LTEuNTE0IDAtMC45ODQtMC43MS0xLjUxMS0xLjg5LTEuNTExeiIvPgo8L3N2Zz4K"/>
                                      </div>
                          
                              </div>
                              <div class="ant-space-item">
                                  <span class="ant-typography spotify-title">currently playing</span>
                              </div>
                          </div>
                      </div>
                  </div>
                  <div class="ant-spin-nested-loading">
                      <div class="ant-spin-container">
                          <ul class="ant-list-items">
                              <li class="ant-list-item track-item">
                                  <div class="ant-list-item-meta">
                          
                                      <div class="ant-list-item-meta-content">
                                          <h4 class="ant-list-item-meta-title">
                                              <a class="ellipsis-overflow a-spotify" target="_blank" rel="noopener noreferrer"  title="Currently nothing is playing">Currently nothing is playing....</a>
                                          </h4>
                                          
                                    </div>
                                  </div>
                              </li>
                          </ul>
                      </div>
                  </div>
              </div>
          </div>
      </foreignObject>
  </g>
</svg>`;
  spotifyApi.getMyCurrentPlayingTrack().then(
    function (data) {
      if (data.statusCode == 200 && data.body.currently_playing_type != "ad") {
        const { is_playing, item } = data.body;
        let { name, preview_url } = item;

        name = name.split('"').join("");

        const url = item.external_urls.spotify;
        console.log({ is_playing, url, name, preview_url });
        fs.writeFile(
          "./public/music.svg",
          `<svg width="400" style="height:auto;" viewBox="0 0 400 102" fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <style id="__jsx-1267595980">[class*=ant-]::-ms-clear,[class^=ant-]::-ms-clear{display:none;}[class*=ant-],[class*=ant-] *,[class*=ant-]:after,[class*=ant-]:before,[class^=ant-],[class^=ant-] *,[class^=ant-]:after,[class^=ant-]:before{-webkit-box-sizing:border-box;box-sizing:border-box;}body,html{width:100%;height:100%;}*,:after,:before{-webkit-box-sizing:border-box;box-sizing:border-box;}html{font-family:sans-serif;line-height:1.15;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;-ms-overflow-style:scrollbar;-webkit-tap-highlight-color:rgba(0,0,0,0);}@-ms-viewport{{width:device-width;}}body{margin:0;color:hsla(0,0%,100%,.85);font-size:14px;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;font-variant:tabular-nums;line-height:1.5715;background-color:#000;-webkit-font-feature-settings:"tnum";font-feature-settings:"tnum";}h4{margin-top:0;margin-bottom:.5em;color:hsla(0,0%,100%,.85);font-weight:500;}ul{margin-top:0;margin-bottom:1em;}a{color:#177ddc;-webkit-text-decoration:none;text-decoration:none;background-color:transparent;outline:none;cursor:pointer;-webkit-transition:color .3s;-webkit-transition:color .3s;transition:color .3s;-webkit-text-decoration-skip:objects;}a:hover{color:#165996;}a:active{color:#388ed3;}a:active,a:focus,a:hover{-webkit-text-decoration:none;text-decoration:none;outline:0;}img{vertical-align:middle;border-style:none;}svg:not(:root){overflow:hidden;}a{-ms-touch-action:manipulation;touch-action:manipulation;}::-webkit-file-upload-button{font:inherit;-webkit-appearance:button;}::-moz-selection{color:#fff;background:#177ddc;}::selection{color:#fff;background:#177ddc;}html{--antd-wave-shadow-color:#177ddc;--scroll-bar:0;}.ant-avatar{-webkit-box-sizing:border-box;box-sizing:border-box;margin:0;padding:0;color:hsla(0,0%,100%,.85);font-size:14px;font-variant:tabular-nums;line-height:1.5715;list-style:none;-webkit-font-feature-settings:"tnum";font-feature-settings:"tnum";position:relative;display:inline-block;overflow:hidden;color:#fff;white-space:nowrap;text-align:center;vertical-align:middle;background:hsla(0,0%,100%,.3);width:32px;height:32px;line-height:32px;border-radius:50%;}.ant-avatar-image{background:transparent;}.ant-avatar-square{border-radius:2px;}.ant-avatar>img{display:block;width:100%;height:100%;-o-object-fit:cover;object-fit:cover;}.ant-cascader-picker-label:hover+.ant-cascader-input:not(.ant-cascader-picker-disabled .ant-cascader-picker-label:hover+.ant-cascader-input){border-color:#165996;border-right-width:1px!important;}.ant-comment-content-author-name>:hover{color:hsla(0,0%,100%,.45);}_:-ms-fullscreen .ant-picker-range-wrapper .ant-picker-month-panel .ant-picker-cell,_:-ms-fullscreen .ant-picker-range-wrapper .ant-picker-year-panel .ant-picker-cell{padding:21px 0;}.ant-image{position:relative;display:inline-block;}.ant-image-img{display:block;width:100%;height:auto;}.ant-list{-webkit-box-sizing:border-box;box-sizing:border-box;margin:0;padding:0;color:hsla(0,0%,100%,.85);font-size:14px;font-variant:tabular-nums;line-height:1.5715;list-style:none;-webkit-font-feature-settings:"tnum";font-feature-settings:"tnum";position:relative;}.ant-list *{outline:none;}.ant-list-items{margin:0;padding:0;list-style:none;}.ant-list-item{-webkit-box-align:center;-ms-flex-align:center;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:justify;-ms-flex-pack:justify;-webkit-box-pack:justify;-webkit-justify-content:space-between;-ms-flex-pack:justify;justify-content:space-between;padding:12px 0;color:hsla(0,0%,100%,.85);}.ant-list-item,.ant-list-item-meta{display:-webkit-box;display:-ms-flexbox;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;}.ant-list-item-meta{-webkit-box-flex:1;-ms-flex:1;-webkit-flex:1;-ms-flex:1;flex:1;-webkit-box-align:start;-ms-flex-align:start;-webkit-align-items:flex-start;-webkit-box-align:flex-start;-ms-flex-align:flex-start;align-items:flex-start;max-width:100%;}.ant-list-item-meta-avatar{margin-right:16px;}.ant-list-item-meta-content{-webkit-box-flex:1;-ms-flex:1 0;-webkit-flex:1 0;-ms-flex:1 0;flex:1 0;width:0;color:hsla(0,0%,100%,.85);}.ant-list-item-meta-title{margin-bottom:4px;color:hsla(0,0%,100%,.85);font-size:14px;line-height:1.5715;}.ant-list-item-meta-title>a{color:hsla(0,0%,100%,.85);-webkit-transition:all .3s;-webkit-transition:all .3s;transition:all .3s;}.ant-list-item-meta-title>a:hover{color:#177ddc;}.ant-list-item-meta-description{color:hsla(0,0%,100%,.45);font-size:14px;line-height:1.5715;}.ant-list-header{background:transparent;}.ant-list-header{padding-top:12px;padding-bottom:12px;}.ant-list-split .ant-list-item{border-bottom:1px solid #303030;}.ant-list-split .ant-list-item:last-child{border-bottom:none;}.ant-list-split .ant-list-header{border-bottom:1px solid #303030;}.ant-list-sm .ant-list-item{padding:8px 16px;}.ant-list-bordered{border:1px solid #434343;border-radius:2px;}.ant-list-bordered .ant-list-header,.ant-list-bordered .ant-list-item{padding-right:24px;padding-left:24px;}.ant-list-bordered.ant-list-sm .ant-list-header,.ant-list-bordered.ant-list-sm .ant-list-item{padding:8px 16px;}@media screen and (max-width:576px){.ant-list-item{-ms-flex-wrap:wrap;-webkit-flex-wrap:wrap;-ms-flex-wrap:wrap;flex-wrap:wrap;}}@supports (-moz-appearance:meterbar){}.ant-space{display:-webkit-inline-box;display:-ms-inline-flexbox;display:-webkit-inline-box;display:-webkit-inline-flex;display:-ms-inline-flexbox;display:inline-flex;}.ant-space-align-center{-webkit-box-align:center;-ms-flex-align:center;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;}.ant-spin-nested-loading{position:relative;}.ant-spin-container{position:relative;-webkit-transition:opacity .3s;-webkit-transition:opacity .3s;transition:opacity .3s;}.ant-spin-container:after{position:absolute;top:0;right:0;bottom:0;left:0;z-index:10;display:none9;width:100%;height:100%;background:#141414;opacity:0;-webkit-transition:all .3s;-webkit-transition:all .3s;transition:all .3s;content:"";pointer-events:none;}.ant-select-tree-focused:not(:hover):not(.ant-select-tree-active-focused){background:#111b26;}.ant-tree-focused:not(:hover):not(.ant-tree-active-focused){background:#111b26;}.ant-typography{color:hsla(0,0%,100%,.85);overflow-wrap:break-word;}.ant-typography.ant-typography-secondary{color:hsla(0,0%,100%,.45);}</style>
          <style id="__jsx-3161645521">svg{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,'Noto Sans',sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol','Noto Color Emoji';color:white;}.spotify-title{vertical-align:middle;font-size:16px;}.spotify-icon{margin-right:10px;}.spotify-icon>img{padding-bottom:0px;}a.a-spotify:hover{color:#1db954 !important;}.ellipsis-overflow{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}.ant-list-bordered{border:initial;}.ant-list{font-size:0.8rem;}.ant-list-item-meta-avatar{-webkit-align-self:center;-ms-flex-item-align:center;align-self:center;}.ant-list-item-meta-title{font-size:0.8rem;margin-bottom:0px !important;}.ant-list-item-meta-description{font-size:0.8rem;}.track-item{padding:8px 12px !important;}.timestamp{font-size:0.7rem;margin-left:5px;}</style>
        
          <g>
              <rect data-testid="card-bg" x="0" y="0" rx="10" height="100%" stroke="#212121" width="300" fill="#212121" stroke-opacity="1"></rect>
              <foreignObject x="0" y="0" width="300" height="100">
                  <div xmlns="http://www.w3.org/1999/xhtml" style="color:white">
                      <div class="ant-list ant-list-sm ant-list-split ant-list-bordered">
                          <div class="ant-list-header">
                              <div style="display:flex">
                                  <div class="ant-space ant-space-horizontal ant-space-align-center">
                                      <div class="ant-space-item" style="margin-right:8px">
              
                                              <div class="ant-image" style="width:100px">
                                                  <img class="ant-image-img spotify-icon" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBoZWlnaHQ9IjE2OHB4IiB3aWR0aD0iNTU5cHgiIHZlcnNpb249IjEuMSIgdmlld0JveD0iMCAwIDU1OSAxNjgiPgogPHBhdGggZmlsbD0iIzFFRDc2MCIgZD0ibTgzLjk5NiAwLjI3N2MtNDYuMjQ5IDAtODMuNzQzIDM3LjQ5My04My43NDMgODMuNzQyIDAgNDYuMjUxIDM3LjQ5NCA4My43NDEgODMuNzQzIDgzLjc0MSA0Ni4yNTQgMCA4My43NDQtMzcuNDkgODMuNzQ0LTgzLjc0MSAwLTQ2LjI0Ni0zNy40OS04My43MzgtODMuNzQ1LTgzLjczOGwwLjAwMS0wLjAwNHptMzguNDA0IDEyMC43OGMtMS41IDIuNDYtNC43MiAzLjI0LTcuMTggMS43My0xOS42NjItMTIuMDEtNDQuNDE0LTE0LjczLTczLjU2NC04LjA3LTIuODA5IDAuNjQtNS42MDktMS4xMi02LjI0OS0zLjkzLTAuNjQzLTIuODEgMS4xMS01LjYxIDMuOTI2LTYuMjUgMzEuOS03LjI4OCA1OS4yNjMtNC4xNSA4MS4zMzcgOS4zNCAyLjQ2IDEuNTEgMy4yNCA0LjcyIDEuNzMgNy4xOHptMTAuMjUtMjIuODAyYy0xLjg5IDMuMDcyLTUuOTEgNC4wNDItOC45OCAyLjE1Mi0yMi41MS0xMy44MzYtNTYuODIzLTE3Ljg0My04My40NDgtOS43NjEtMy40NTMgMS4wNDMtNy4xLTAuOTAzLTguMTQ4LTQuMzUtMS4wNC0zLjQ1MyAwLjkwNy03LjA5MyA0LjM1NC04LjE0MyAzMC40MTMtOS4yMjggNjguMjIyLTQuNzU4IDk0LjA3MiAxMS4xMjcgMy4wNyAxLjg5IDQuMDQgNS45MSAyLjE1IDguOTc2di0wLjAwMXptMC44OC0yMy43NDRjLTI2Ljk5LTE2LjAzMS03MS41Mi0xNy41MDUtOTcuMjg5LTkuNjg0LTQuMTM4IDEuMjU1LTguNTE0LTEuMDgxLTkuNzY4LTUuMjE5LTEuMjU0LTQuMTQgMS4wOC04LjUxMyA1LjIyMS05Ljc3MSAyOS41ODEtOC45OCA3OC43NTYtNy4yNDUgMTA5LjgzIDExLjIwMiAzLjczIDIuMjA5IDQuOTUgNy4wMTYgMi43NCAxMC43MzMtMi4yIDMuNzIyLTcuMDIgNC45NDktMTAuNzMgMi43Mzl6bTk0LjU2IDMuMDcyYy0xNC40Ni0zLjQ0OC0xNy4wMy01Ljg2OC0xNy4wMy0xMC45NTMgMC00LjgwNCA0LjUyLTguMDM3IDExLjI1LTguMDM3IDYuNTIgMCAxMi45OCAyLjQ1NSAxOS43NiA3LjUwOSAwLjIgMC4xNTMgMC40NiAwLjIxNCAwLjcxIDAuMTc0IDAuMjYtMC4wMzggMC40OC0wLjE3NyAwLjYzLTAuMzg2bDcuMDYtOS45NTJjMC4yOS0wLjQxIDAuMjEtMC45NzUtMC4xOC0xLjI4OC04LjA3LTYuNDczLTE3LjE1LTkuNjItMjcuNzctOS42Mi0xNS42MSAwLTI2LjUyIDkuMzY5LTI2LjUyIDIyLjc3NCAwIDE0LjM3NSA5LjQxIDE5LjQ2NSAyNS42NyAyMy4zOTQgMTMuODMgMy4xODcgMTYuMTcgNS44NTcgMTYuMTcgMTAuNjI5IDAgNS4yOS00LjcyIDguNTgtMTIuMzIgOC41OC04LjQ0IDAtMTUuMzMtMi44NS0yMy4wMy05LjUxLTAuMTktMC4xNy0wLjQ1LTAuMjQtMC42OS0wLjIzLTAuMjYgMC4wMi0wLjQ5IDAuMTQtMC42NSAwLjMzbC03LjkyIDkuNDJjLTAuMzMgMC40LTAuMjkgMC45OCAwLjA5IDEuMzIgOC45NiA4IDE5Ljk4IDEyLjIyIDMxLjg4IDEyLjIyIDE2LjgyIDAgMjcuNjktOS4xOSAyNy42OS0yMy40MiAwLjAzLTEyLjAwNy03LjE2LTE4LjY1Ny0yNC43Ny0yMi45NDFsLTAuMDMtMC4wMTN6bTYyLjg2LTE0LjI2Yy03LjI5IDAtMTMuMjcgMi44NzItMTguMjEgOC43NTd2LTYuNjI0YzAtMC41MjMtMC40Mi0wLjk0OS0wLjk0LTAuOTQ5aC0xMi45NWMtMC41MiAwLTAuOTQgMC40MjYtMC45NCAwLjk0OXY3My42MDFjMCAwLjUyIDAuNDIgMC45NSAwLjk0IDAuOTVoMTIuOTVjMC41MiAwIDAuOTQtMC40MyAwLjk0LTAuOTV2LTIzLjIzYzQuOTQgNS41MyAxMC45MiA4LjI0IDE4LjIxIDguMjQgMTMuNTUgMCAyNy4yNy0xMC40MyAyNy4yNy0zMC4zNjkgMC4wMi0xOS45NDMtMTMuNy0zMC4zNzYtMjcuMjYtMzAuMzc2bC0wLjAxIDAuMDAxem0xMi4yMSAzMC4zNzVjMCAxMC4xNDktNi4yNSAxNy4yMzktMTUuMjEgMTcuMjM5LTguODUgMC0xNS41My03LjQxLTE1LjUzLTE3LjIzOSAwLTkuODMgNi42OC0xNy4yMzggMTUuNTMtMTcuMjM4IDguODEtMC4wMDEgMTUuMjEgNy4yNDcgMTUuMjEgMTcuMjM3djAuMDAxem01MC4yMS0zMC4zNzVjLTE3LjQ1IDAtMzEuMTIgMTMuNDM2LTMxLjEyIDMwLjU5MiAwIDE2Ljk3MiAxMy41OCAzMC4yNjIgMzAuOTEgMzAuMjYyIDE3LjUxIDAgMzEuMjItMTMuMzkgMzEuMjItMzAuNDc5IDAtMTcuMDMxLTEzLjYyLTMwLjM3My0zMS4wMS0zMC4zNzN2LTAuMDAyem0wIDQ3LjcxNGMtOS4yOCAwLTE2LjI4LTcuNDYtMTYuMjgtMTcuMzQ0IDAtOS45MjkgNi43Ni0xNy4xMzQgMTYuMDctMTcuMTM0IDkuMzQgMCAxNi4zOCA3LjQ1NyAxNi4zOCAxNy4zNTEgMCA5LjkyNy02LjggMTcuMTI3LTE2LjE3IDE3LjEyN3ptNjguMjctNDYuNTNoLTE0LjI1di0xNC41NjZjMC0wLjUyMi0wLjQyLTAuOTQ4LTAuOTQtMC45NDhoLTEyLjk1Yy0wLjUyIDAtMC45NSAwLjQyNi0wLjk1IDAuOTQ4djE0LjU2NmgtNi4yMmMtMC41MiAwLTAuOTQgMC40MjYtMC45NCAwLjk0OXYxMS4xMjdjMCAwLjUyMiAwLjQyIDAuOTQ5IDAuOTQgMC45NDloNi4yMnYyOC43OTVjMCAxMS42MyA1Ljc5IDE3LjUzIDE3LjIyIDE3LjUzIDQuNjQgMCA4LjQ5LTAuOTYgMTIuMTItMy4wMiAwLjMtMC4xNiAwLjQ4LTAuNDggMC40OC0wLjgydi0xMC42YzAtMC4zMi0wLjE3LTAuNjMtMC40NS0wLjgtMC4yOC0wLjE4LTAuNjMtMC4xOS0wLjkyLTAuMDQtMi40OSAxLjI1LTQuOSAxLjgzLTcuNiAxLjgzLTQuMTUgMC02LjAxLTEuODktNi4wMS02LjExdi0yNi43NmgxNC4yNWMwLjUyIDAgMC45NC0wLjQyNiAwLjk0LTAuOTQ5di0xMS4xMjZjMC4wMi0wLjUyMy0wLjQtMC45NDktMC45My0wLjk0OWwtMC4wMS0wLjAwNnptNDkuNjQgMC4wNTd2LTEuNzg5YzAtNS4yNjMgMi4wMi03LjYxIDYuNTQtNy42MSAyLjcgMCA0Ljg3IDAuNTM2IDcuMyAxLjM0NiAwLjMgMC4wOTQgMC42MSAwLjA0NyAwLjg1LTAuMTMyIDAuMjUtMC4xNzkgMC4zOS0wLjQ2NiAwLjM5LTAuNzd2LTEwLjkxYzAtMC40MTctMC4yNi0wLjc4Ni0wLjY3LTAuOTA5LTIuNTYtMC43NjMtNS44NC0xLjU0Ni0xMC43Ni0xLjU0Ni0xMS45NSAwLTE4LjI4IDYuNzM0LTE4LjI4IDE5LjQ2N3YyLjc0aC02LjIyYy0wLjUyIDAtMC45NSAwLjQyNi0wLjk1IDAuOTQ4djExLjE4NGMwIDAuNTIyIDAuNDMgMC45NDkgMC45NSAwLjk0OWg2LjIydjQ0LjQwNWMwIDAuNTMgMC40MyAwLjk1IDAuOTUgMC45NWgxMi45NGMwLjUzIDAgMC45NS0wLjQyIDAuOTUtMC45NXYtNDQuNDAyaDEyLjA5bDE4LjUyIDQ0LjQwMmMtMi4xIDQuNjYtNC4xNyA1LjU5LTYuOTkgNS41OS0yLjI4IDAtNC42OS0wLjY4LTcuMTQtMi4wMy0wLjIzLTAuMTItMC41MS0wLjE0LTAuNzUtMC4wNy0wLjI1IDAuMDktMC40NiAwLjI3LTAuNTYgMC41MWwtNC4zOSA5LjYzYy0wLjIxIDAuNDYtMC4wMyAwLjk5IDAuNDEgMS4yMyA0LjU4IDIuNDggOC43MSAzLjU0IDEzLjgyIDMuNTQgOS41NiAwIDE0Ljg1LTQuNDYgMTkuNS0xNi40NGwyMi40Ni01OC4wMzdjMC4xMi0wLjI5MiAwLjA4LTAuNjIyLTAuMS0wLjg4MS0wLjE3LTAuMjU3LTAuNDYtMC40MTItMC43Ny0wLjQxMmgtMTMuNDhjLTAuNDEgMC0wLjc3IDAuMjU3LTAuOSAwLjYzNmwtMTMuODEgMzkuNDM0LTE1LjEyLTM5LjQ2Yy0wLjE0LTAuMzY3LTAuNDktMC42MS0wLjg4LTAuNjFoLTIyLjEydi0wLjAwM3ptLTI4Ljc4LTAuMDU3aC0xMi45NWMtMC41MiAwLTAuOTUgMC40MjYtMC45NSAwLjk0OXY1Ni40ODFjMCAwLjUzIDAuNDMgMC45NSAwLjk1IDAuOTVoMTIuOTVjMC41MiAwIDAuOTUtMC40MiAwLjk1LTAuOTV2LTU2LjQ3N2MwLTAuNTIzLTAuNDItMC45NDktMC45NS0wLjk0OXYtMC4wMDR6bS02LjQtMjUuNzE5Yy01LjEzIDAtOS4yOSA0LjE1Mi05LjI5IDkuMjgxIDAgNS4xMzIgNC4xNiA5LjI4OSA5LjI5IDkuMjg5czkuMjgtNC4xNTcgOS4yOC05LjI4OWMwLTUuMTI4LTQuMTYtOS4yODEtOS4yOC05LjI4MXptMTEzLjQyIDQzLjg4Yy01LjEyIDAtOS4xMS00LjExNS05LjExLTkuMTEyczQuMDQtOS4xNTkgOS4xNi05LjE1OSA5LjExIDQuMTE0IDkuMTEgOS4xMDdjMCA0Ljk5Ny00LjA0IDkuMTY0LTkuMTYgOS4xNjR6bTAuMDUtMTcuMzY1Yy00LjY3IDAtOC4yIDMuNzEtOC4yIDguMjUzIDAgNC41NDEgMy41MSA4LjIwMSA4LjE1IDguMjAxIDQuNjcgMCA4LjItMy43MDcgOC4yLTguMjUzIDAtNC41NDEtMy41MS04LjIwMS04LjE1LTguMjAxem0yLjAyIDkuMTM4bDIuNTggMy42MDhoLTIuMThsLTIuMzItMy4zMWgtMS45OXYzLjMxaC0xLjgydi05LjU2NGg0LjI2YzIuMjMgMCAzLjY5IDEuMTM3IDMuNjkgMy4wNTEgMC4wMSAxLjU2OC0wLjkgMi41MjYtMi4yMSAyLjkwNWgtMC4wMXptLTEuNTQtNC4zMTVoLTIuMzd2My4wMjVoMi4zN2MxLjE4IDAgMS44OS0wLjU3OSAxLjg5LTEuNTE0IDAtMC45ODQtMC43MS0xLjUxMS0xLjg5LTEuNTExeiIvPgo8L3N2Zz4K"/>
                                              </div>
                                  
                                      </div>
                                      <div class="ant-space-item">
                                          <span class="ant-typography spotify-title">currently playing</span>
                                      </div>
                                  </div>
                              </div>
                          </div>
                          <div class="ant-spin-nested-loading">
                              <div class="ant-spin-container">
                                  <ul class="ant-list-items">
                                      <li class="ant-list-item track-item">
                                          <div class="ant-list-item-meta">
                                  
                                              <div class="ant-list-item-meta-content">
                                                  <h4 class="ant-list-item-meta-title">
                                                      <a href="${url}"  class="ellipsis-overflow a-spotify" target="_blank" rel="noopener noreferrer"  title="${name}">${name}</a>
                                                  </h4>
                                                  
                                            </div>
                                          </div>
                                      </li>
                                  </ul>
                              </div>
                          </div>
                      </div>
                  </div>
              </foreignObject>
          </g>
        </svg>`,
          function (err) {
            if (err) {
              console.log("Something went wrong!", err);
              res.render("error");
            } else {
              console.log("saved");
              res.render("index", { url, preview_url });
            }
          }
        );
      } else {
        console.log("not playing");
        fs.writeFile("./public/music.svg", datasvg, function (err) {
          if (err) {
            console.log("Something went wrong!", err);
            res.render("error");
          } else {
            console.log("saved empty");
            let url = false;
            res.render("index", { url });
          }
        });
      }
    },
    function (err) {
      console.log("Something went wrong!", err);
      // res.render("error");
      res.redirect(spotifyApi.createAuthorizeURL(scopes));
    }
  );
});

app.get("/getimage", (_, res) => {
  setInterval(async () => {
    try {
      const data = await spotifyApi.refreshAccessToken();
      const access_token = data.body["access_token"];

      console.log("The access token has been refreshed! [in getimage]");
      // console.log("access_token:", access_token);
      spotifyApi.setAccessToken(access_token);
    } catch (error) {
      console.log("error in /getimage");
    }
  }, 60 * 1000);
  spotifyApi.getMyCurrentPlayingTrack().then(
    function (data) {
      if (data.statusCode == 200 && data.body.currently_playing_type != "ad") {
        const { is_playing, item } = data.body;
        let { name, preview_url } = item;

        name = name.split('"').join("");

        const url = item.external_urls.spotify;
        console.log({ is_playing, url, name, preview_url });
        fs.writeFile(
          "./public/music.svg",
          `<svg width="400" style="height:auto;" viewBox="0 0 400 102" fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <style id="__jsx-1267595980">[class*=ant-]::-ms-clear,[class^=ant-]::-ms-clear{display:none;}[class*=ant-],[class*=ant-] *,[class*=ant-]:after,[class*=ant-]:before,[class^=ant-],[class^=ant-] *,[class^=ant-]:after,[class^=ant-]:before{-webkit-box-sizing:border-box;box-sizing:border-box;}body,html{width:100%;height:100%;}*,:after,:before{-webkit-box-sizing:border-box;box-sizing:border-box;}html{font-family:sans-serif;line-height:1.15;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;-ms-overflow-style:scrollbar;-webkit-tap-highlight-color:rgba(0,0,0,0);}@-ms-viewport{{width:device-width;}}body{margin:0;color:hsla(0,0%,100%,.85);font-size:14px;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;font-variant:tabular-nums;line-height:1.5715;background-color:#000;-webkit-font-feature-settings:"tnum";font-feature-settings:"tnum";}h4{margin-top:0;margin-bottom:.5em;color:hsla(0,0%,100%,.85);font-weight:500;}ul{margin-top:0;margin-bottom:1em;}a{color:#177ddc;-webkit-text-decoration:none;text-decoration:none;background-color:transparent;outline:none;cursor:pointer;-webkit-transition:color .3s;-webkit-transition:color .3s;transition:color .3s;-webkit-text-decoration-skip:objects;}a:hover{color:#165996;}a:active{color:#388ed3;}a:active,a:focus,a:hover{-webkit-text-decoration:none;text-decoration:none;outline:0;}img{vertical-align:middle;border-style:none;}svg:not(:root){overflow:hidden;}a{-ms-touch-action:manipulation;touch-action:manipulation;}::-webkit-file-upload-button{font:inherit;-webkit-appearance:button;}::-moz-selection{color:#fff;background:#177ddc;}::selection{color:#fff;background:#177ddc;}html{--antd-wave-shadow-color:#177ddc;--scroll-bar:0;}.ant-avatar{-webkit-box-sizing:border-box;box-sizing:border-box;margin:0;padding:0;color:hsla(0,0%,100%,.85);font-size:14px;font-variant:tabular-nums;line-height:1.5715;list-style:none;-webkit-font-feature-settings:"tnum";font-feature-settings:"tnum";position:relative;display:inline-block;overflow:hidden;color:#fff;white-space:nowrap;text-align:center;vertical-align:middle;background:hsla(0,0%,100%,.3);width:32px;height:32px;line-height:32px;border-radius:50%;}.ant-avatar-image{background:transparent;}.ant-avatar-square{border-radius:2px;}.ant-avatar>img{display:block;width:100%;height:100%;-o-object-fit:cover;object-fit:cover;}.ant-cascader-picker-label:hover+.ant-cascader-input:not(.ant-cascader-picker-disabled .ant-cascader-picker-label:hover+.ant-cascader-input){border-color:#165996;border-right-width:1px!important;}.ant-comment-content-author-name>:hover{color:hsla(0,0%,100%,.45);}_:-ms-fullscreen .ant-picker-range-wrapper .ant-picker-month-panel .ant-picker-cell,_:-ms-fullscreen .ant-picker-range-wrapper .ant-picker-year-panel .ant-picker-cell{padding:21px 0;}.ant-image{position:relative;display:inline-block;}.ant-image-img{display:block;width:100%;height:auto;}.ant-list{-webkit-box-sizing:border-box;box-sizing:border-box;margin:0;padding:0;color:hsla(0,0%,100%,.85);font-size:14px;font-variant:tabular-nums;line-height:1.5715;list-style:none;-webkit-font-feature-settings:"tnum";font-feature-settings:"tnum";position:relative;}.ant-list *{outline:none;}.ant-list-items{margin:0;padding:0;list-style:none;}.ant-list-item{-webkit-box-align:center;-ms-flex-align:center;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:justify;-ms-flex-pack:justify;-webkit-box-pack:justify;-webkit-justify-content:space-between;-ms-flex-pack:justify;justify-content:space-between;padding:12px 0;color:hsla(0,0%,100%,.85);}.ant-list-item,.ant-list-item-meta{display:-webkit-box;display:-ms-flexbox;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;}.ant-list-item-meta{-webkit-box-flex:1;-ms-flex:1;-webkit-flex:1;-ms-flex:1;flex:1;-webkit-box-align:start;-ms-flex-align:start;-webkit-align-items:flex-start;-webkit-box-align:flex-start;-ms-flex-align:flex-start;align-items:flex-start;max-width:100%;}.ant-list-item-meta-avatar{margin-right:16px;}.ant-list-item-meta-content{-webkit-box-flex:1;-ms-flex:1 0;-webkit-flex:1 0;-ms-flex:1 0;flex:1 0;width:0;color:hsla(0,0%,100%,.85);}.ant-list-item-meta-title{margin-bottom:4px;color:hsla(0,0%,100%,.85);font-size:14px;line-height:1.5715;}.ant-list-item-meta-title>a{color:hsla(0,0%,100%,.85);-webkit-transition:all .3s;-webkit-transition:all .3s;transition:all .3s;}.ant-list-item-meta-title>a:hover{color:#177ddc;}.ant-list-item-meta-description{color:hsla(0,0%,100%,.45);font-size:14px;line-height:1.5715;}.ant-list-header{background:transparent;}.ant-list-header{padding-top:12px;padding-bottom:12px;}.ant-list-split .ant-list-item{border-bottom:1px solid #303030;}.ant-list-split .ant-list-item:last-child{border-bottom:none;}.ant-list-split .ant-list-header{border-bottom:1px solid #303030;}.ant-list-sm .ant-list-item{padding:8px 16px;}.ant-list-bordered{border:1px solid #434343;border-radius:2px;}.ant-list-bordered .ant-list-header,.ant-list-bordered .ant-list-item{padding-right:24px;padding-left:24px;}.ant-list-bordered.ant-list-sm .ant-list-header,.ant-list-bordered.ant-list-sm .ant-list-item{padding:8px 16px;}@media screen and (max-width:576px){.ant-list-item{-ms-flex-wrap:wrap;-webkit-flex-wrap:wrap;-ms-flex-wrap:wrap;flex-wrap:wrap;}}@supports (-moz-appearance:meterbar){}.ant-space{display:-webkit-inline-box;display:-ms-inline-flexbox;display:-webkit-inline-box;display:-webkit-inline-flex;display:-ms-inline-flexbox;display:inline-flex;}.ant-space-align-center{-webkit-box-align:center;-ms-flex-align:center;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;}.ant-spin-nested-loading{position:relative;}.ant-spin-container{position:relative;-webkit-transition:opacity .3s;-webkit-transition:opacity .3s;transition:opacity .3s;}.ant-spin-container:after{position:absolute;top:0;right:0;bottom:0;left:0;z-index:10;display:none9;width:100%;height:100%;background:#141414;opacity:0;-webkit-transition:all .3s;-webkit-transition:all .3s;transition:all .3s;content:"";pointer-events:none;}.ant-select-tree-focused:not(:hover):not(.ant-select-tree-active-focused){background:#111b26;}.ant-tree-focused:not(:hover):not(.ant-tree-active-focused){background:#111b26;}.ant-typography{color:hsla(0,0%,100%,.85);overflow-wrap:break-word;}.ant-typography.ant-typography-secondary{color:hsla(0,0%,100%,.45);}</style>
          <style id="__jsx-3161645521">svg{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,'Noto Sans',sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol','Noto Color Emoji';color:white;}.spotify-title{vertical-align:middle;font-size:16px;}.spotify-icon{margin-right:10px;}.spotify-icon>img{padding-bottom:0px;}a.a-spotify:hover{color:#1db954 !important;}.ellipsis-overflow{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}.ant-list-bordered{border:initial;}.ant-list{font-size:0.8rem;}.ant-list-item-meta-avatar{-webkit-align-self:center;-ms-flex-item-align:center;align-self:center;}.ant-list-item-meta-title{font-size:0.8rem;margin-bottom:0px !important;}.ant-list-item-meta-description{font-size:0.8rem;}.track-item{padding:8px 12px !important;}.timestamp{font-size:0.7rem;margin-left:5px;}</style>
        
          <g>
              <rect data-testid="card-bg" x="0" y="0" rx="10" height="100%" stroke="#212121" width="300" fill="#212121" stroke-opacity="1"></rect>
              <foreignObject x="0" y="0" width="300" height="100">
                  <div xmlns="http://www.w3.org/1999/xhtml" style="color:white">
                      <div class="ant-list ant-list-sm ant-list-split ant-list-bordered">
                          <div class="ant-list-header">
                              <div style="display:flex">
                                  <div class="ant-space ant-space-horizontal ant-space-align-center">
                                      <div class="ant-space-item" style="margin-right:8px">
              
                                              <div class="ant-image" style="width:100px">
                                                  <img class="ant-image-img spotify-icon" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBoZWlnaHQ9IjE2OHB4IiB3aWR0aD0iNTU5cHgiIHZlcnNpb249IjEuMSIgdmlld0JveD0iMCAwIDU1OSAxNjgiPgogPHBhdGggZmlsbD0iIzFFRDc2MCIgZD0ibTgzLjk5NiAwLjI3N2MtNDYuMjQ5IDAtODMuNzQzIDM3LjQ5My04My43NDMgODMuNzQyIDAgNDYuMjUxIDM3LjQ5NCA4My43NDEgODMuNzQzIDgzLjc0MSA0Ni4yNTQgMCA4My43NDQtMzcuNDkgODMuNzQ0LTgzLjc0MSAwLTQ2LjI0Ni0zNy40OS04My43MzgtODMuNzQ1LTgzLjczOGwwLjAwMS0wLjAwNHptMzguNDA0IDEyMC43OGMtMS41IDIuNDYtNC43MiAzLjI0LTcuMTggMS43My0xOS42NjItMTIuMDEtNDQuNDE0LTE0LjczLTczLjU2NC04LjA3LTIuODA5IDAuNjQtNS42MDktMS4xMi02LjI0OS0zLjkzLTAuNjQzLTIuODEgMS4xMS01LjYxIDMuOTI2LTYuMjUgMzEuOS03LjI4OCA1OS4yNjMtNC4xNSA4MS4zMzcgOS4zNCAyLjQ2IDEuNTEgMy4yNCA0LjcyIDEuNzMgNy4xOHptMTAuMjUtMjIuODAyYy0xLjg5IDMuMDcyLTUuOTEgNC4wNDItOC45OCAyLjE1Mi0yMi41MS0xMy44MzYtNTYuODIzLTE3Ljg0My04My40NDgtOS43NjEtMy40NTMgMS4wNDMtNy4xLTAuOTAzLTguMTQ4LTQuMzUtMS4wNC0zLjQ1MyAwLjkwNy03LjA5MyA0LjM1NC04LjE0MyAzMC40MTMtOS4yMjggNjguMjIyLTQuNzU4IDk0LjA3MiAxMS4xMjcgMy4wNyAxLjg5IDQuMDQgNS45MSAyLjE1IDguOTc2di0wLjAwMXptMC44OC0yMy43NDRjLTI2Ljk5LTE2LjAzMS03MS41Mi0xNy41MDUtOTcuMjg5LTkuNjg0LTQuMTM4IDEuMjU1LTguNTE0LTEuMDgxLTkuNzY4LTUuMjE5LTEuMjU0LTQuMTQgMS4wOC04LjUxMyA1LjIyMS05Ljc3MSAyOS41ODEtOC45OCA3OC43NTYtNy4yNDUgMTA5LjgzIDExLjIwMiAzLjczIDIuMjA5IDQuOTUgNy4wMTYgMi43NCAxMC43MzMtMi4yIDMuNzIyLTcuMDIgNC45NDktMTAuNzMgMi43Mzl6bTk0LjU2IDMuMDcyYy0xNC40Ni0zLjQ0OC0xNy4wMy01Ljg2OC0xNy4wMy0xMC45NTMgMC00LjgwNCA0LjUyLTguMDM3IDExLjI1LTguMDM3IDYuNTIgMCAxMi45OCAyLjQ1NSAxOS43NiA3LjUwOSAwLjIgMC4xNTMgMC40NiAwLjIxNCAwLjcxIDAuMTc0IDAuMjYtMC4wMzggMC40OC0wLjE3NyAwLjYzLTAuMzg2bDcuMDYtOS45NTJjMC4yOS0wLjQxIDAuMjEtMC45NzUtMC4xOC0xLjI4OC04LjA3LTYuNDczLTE3LjE1LTkuNjItMjcuNzctOS42Mi0xNS42MSAwLTI2LjUyIDkuMzY5LTI2LjUyIDIyLjc3NCAwIDE0LjM3NSA5LjQxIDE5LjQ2NSAyNS42NyAyMy4zOTQgMTMuODMgMy4xODcgMTYuMTcgNS44NTcgMTYuMTcgMTAuNjI5IDAgNS4yOS00LjcyIDguNTgtMTIuMzIgOC41OC04LjQ0IDAtMTUuMzMtMi44NS0yMy4wMy05LjUxLTAuMTktMC4xNy0wLjQ1LTAuMjQtMC42OS0wLjIzLTAuMjYgMC4wMi0wLjQ5IDAuMTQtMC42NSAwLjMzbC03LjkyIDkuNDJjLTAuMzMgMC40LTAuMjkgMC45OCAwLjA5IDEuMzIgOC45NiA4IDE5Ljk4IDEyLjIyIDMxLjg4IDEyLjIyIDE2LjgyIDAgMjcuNjktOS4xOSAyNy42OS0yMy40MiAwLjAzLTEyLjAwNy03LjE2LTE4LjY1Ny0yNC43Ny0yMi45NDFsLTAuMDMtMC4wMTN6bTYyLjg2LTE0LjI2Yy03LjI5IDAtMTMuMjcgMi44NzItMTguMjEgOC43NTd2LTYuNjI0YzAtMC41MjMtMC40Mi0wLjk0OS0wLjk0LTAuOTQ5aC0xMi45NWMtMC41MiAwLTAuOTQgMC40MjYtMC45NCAwLjk0OXY3My42MDFjMCAwLjUyIDAuNDIgMC45NSAwLjk0IDAuOTVoMTIuOTVjMC41MiAwIDAuOTQtMC40MyAwLjk0LTAuOTV2LTIzLjIzYzQuOTQgNS41MyAxMC45MiA4LjI0IDE4LjIxIDguMjQgMTMuNTUgMCAyNy4yNy0xMC40MyAyNy4yNy0zMC4zNjkgMC4wMi0xOS45NDMtMTMuNy0zMC4zNzYtMjcuMjYtMzAuMzc2bC0wLjAxIDAuMDAxem0xMi4yMSAzMC4zNzVjMCAxMC4xNDktNi4yNSAxNy4yMzktMTUuMjEgMTcuMjM5LTguODUgMC0xNS41My03LjQxLTE1LjUzLTE3LjIzOSAwLTkuODMgNi42OC0xNy4yMzggMTUuNTMtMTcuMjM4IDguODEtMC4wMDEgMTUuMjEgNy4yNDcgMTUuMjEgMTcuMjM3djAuMDAxem01MC4yMS0zMC4zNzVjLTE3LjQ1IDAtMzEuMTIgMTMuNDM2LTMxLjEyIDMwLjU5MiAwIDE2Ljk3MiAxMy41OCAzMC4yNjIgMzAuOTEgMzAuMjYyIDE3LjUxIDAgMzEuMjItMTMuMzkgMzEuMjItMzAuNDc5IDAtMTcuMDMxLTEzLjYyLTMwLjM3My0zMS4wMS0zMC4zNzN2LTAuMDAyem0wIDQ3LjcxNGMtOS4yOCAwLTE2LjI4LTcuNDYtMTYuMjgtMTcuMzQ0IDAtOS45MjkgNi43Ni0xNy4xMzQgMTYuMDctMTcuMTM0IDkuMzQgMCAxNi4zOCA3LjQ1NyAxNi4zOCAxNy4zNTEgMCA5LjkyNy02LjggMTcuMTI3LTE2LjE3IDE3LjEyN3ptNjguMjctNDYuNTNoLTE0LjI1di0xNC41NjZjMC0wLjUyMi0wLjQyLTAuOTQ4LTAuOTQtMC45NDhoLTEyLjk1Yy0wLjUyIDAtMC45NSAwLjQyNi0wLjk1IDAuOTQ4djE0LjU2NmgtNi4yMmMtMC41MiAwLTAuOTQgMC40MjYtMC45NCAwLjk0OXYxMS4xMjdjMCAwLjUyMiAwLjQyIDAuOTQ5IDAuOTQgMC45NDloNi4yMnYyOC43OTVjMCAxMS42MyA1Ljc5IDE3LjUzIDE3LjIyIDE3LjUzIDQuNjQgMCA4LjQ5LTAuOTYgMTIuMTItMy4wMiAwLjMtMC4xNiAwLjQ4LTAuNDggMC40OC0wLjgydi0xMC42YzAtMC4zMi0wLjE3LTAuNjMtMC40NS0wLjgtMC4yOC0wLjE4LTAuNjMtMC4xOS0wLjkyLTAuMDQtMi40OSAxLjI1LTQuOSAxLjgzLTcuNiAxLjgzLTQuMTUgMC02LjAxLTEuODktNi4wMS02LjExdi0yNi43NmgxNC4yNWMwLjUyIDAgMC45NC0wLjQyNiAwLjk0LTAuOTQ5di0xMS4xMjZjMC4wMi0wLjUyMy0wLjQtMC45NDktMC45My0wLjk0OWwtMC4wMS0wLjAwNnptNDkuNjQgMC4wNTd2LTEuNzg5YzAtNS4yNjMgMi4wMi03LjYxIDYuNTQtNy42MSAyLjcgMCA0Ljg3IDAuNTM2IDcuMyAxLjM0NiAwLjMgMC4wOTQgMC42MSAwLjA0NyAwLjg1LTAuMTMyIDAuMjUtMC4xNzkgMC4zOS0wLjQ2NiAwLjM5LTAuNzd2LTEwLjkxYzAtMC40MTctMC4yNi0wLjc4Ni0wLjY3LTAuOTA5LTIuNTYtMC43NjMtNS44NC0xLjU0Ni0xMC43Ni0xLjU0Ni0xMS45NSAwLTE4LjI4IDYuNzM0LTE4LjI4IDE5LjQ2N3YyLjc0aC02LjIyYy0wLjUyIDAtMC45NSAwLjQyNi0wLjk1IDAuOTQ4djExLjE4NGMwIDAuNTIyIDAuNDMgMC45NDkgMC45NSAwLjk0OWg2LjIydjQ0LjQwNWMwIDAuNTMgMC40MyAwLjk1IDAuOTUgMC45NWgxMi45NGMwLjUzIDAgMC45NS0wLjQyIDAuOTUtMC45NXYtNDQuNDAyaDEyLjA5bDE4LjUyIDQ0LjQwMmMtMi4xIDQuNjYtNC4xNyA1LjU5LTYuOTkgNS41OS0yLjI4IDAtNC42OS0wLjY4LTcuMTQtMi4wMy0wLjIzLTAuMTItMC41MS0wLjE0LTAuNzUtMC4wNy0wLjI1IDAuMDktMC40NiAwLjI3LTAuNTYgMC41MWwtNC4zOSA5LjYzYy0wLjIxIDAuNDYtMC4wMyAwLjk5IDAuNDEgMS4yMyA0LjU4IDIuNDggOC43MSAzLjU0IDEzLjgyIDMuNTQgOS41NiAwIDE0Ljg1LTQuNDYgMTkuNS0xNi40NGwyMi40Ni01OC4wMzdjMC4xMi0wLjI5MiAwLjA4LTAuNjIyLTAuMS0wLjg4MS0wLjE3LTAuMjU3LTAuNDYtMC40MTItMC43Ny0wLjQxMmgtMTMuNDhjLTAuNDEgMC0wLjc3IDAuMjU3LTAuOSAwLjYzNmwtMTMuODEgMzkuNDM0LTE1LjEyLTM5LjQ2Yy0wLjE0LTAuMzY3LTAuNDktMC42MS0wLjg4LTAuNjFoLTIyLjEydi0wLjAwM3ptLTI4Ljc4LTAuMDU3aC0xMi45NWMtMC41MiAwLTAuOTUgMC40MjYtMC45NSAwLjk0OXY1Ni40ODFjMCAwLjUzIDAuNDMgMC45NSAwLjk1IDAuOTVoMTIuOTVjMC41MiAwIDAuOTUtMC40MiAwLjk1LTAuOTV2LTU2LjQ3N2MwLTAuNTIzLTAuNDItMC45NDktMC45NS0wLjk0OXYtMC4wMDR6bS02LjQtMjUuNzE5Yy01LjEzIDAtOS4yOSA0LjE1Mi05LjI5IDkuMjgxIDAgNS4xMzIgNC4xNiA5LjI4OSA5LjI5IDkuMjg5czkuMjgtNC4xNTcgOS4yOC05LjI4OWMwLTUuMTI4LTQuMTYtOS4yODEtOS4yOC05LjI4MXptMTEzLjQyIDQzLjg4Yy01LjEyIDAtOS4xMS00LjExNS05LjExLTkuMTEyczQuMDQtOS4xNTkgOS4xNi05LjE1OSA5LjExIDQuMTE0IDkuMTEgOS4xMDdjMCA0Ljk5Ny00LjA0IDkuMTY0LTkuMTYgOS4xNjR6bTAuMDUtMTcuMzY1Yy00LjY3IDAtOC4yIDMuNzEtOC4yIDguMjUzIDAgNC41NDEgMy41MSA4LjIwMSA4LjE1IDguMjAxIDQuNjcgMCA4LjItMy43MDcgOC4yLTguMjUzIDAtNC41NDEtMy41MS04LjIwMS04LjE1LTguMjAxem0yLjAyIDkuMTM4bDIuNTggMy42MDhoLTIuMThsLTIuMzItMy4zMWgtMS45OXYzLjMxaC0xLjgydi05LjU2NGg0LjI2YzIuMjMgMCAzLjY5IDEuMTM3IDMuNjkgMy4wNTEgMC4wMSAxLjU2OC0wLjkgMi41MjYtMi4yMSAyLjkwNWgtMC4wMXptLTEuNTQtNC4zMTVoLTIuMzd2My4wMjVoMi4zN2MxLjE4IDAgMS44OS0wLjU3OSAxLjg5LTEuNTE0IDAtMC45ODQtMC43MS0xLjUxMS0xLjg5LTEuNTExeiIvPgo8L3N2Zz4K"/>
                                              </div>
                                  
                                      </div>
                                      <div class="ant-space-item">
                                          <span class="ant-typography spotify-title">currently playing</span>
                                      </div>
                                  </div>
                              </div>
                          </div>
                          <div class="ant-spin-nested-loading">
                              <div class="ant-spin-container">
                                  <ul class="ant-list-items">
                                      <li class="ant-list-item track-item">
                                          <div class="ant-list-item-meta">
                                  
                                              <div class="ant-list-item-meta-content">
                                                  <h4 class="ant-list-item-meta-title">
                                                      <a href="${url}" class="ellipsis-overflow a-spotify" target="_blank" rel="noopener noreferrer"  title="${name}">${name}</a>
                                                  </h4>
                                                  
                                            </div>
                                          </div>
                                      </li>
                                  </ul>
                              </div>
                          </div>
                      </div>
                  </div>
              </foreignObject>
          </g>
        </svg>`,
          function (err) {
            if (err) {
              console.log("Something went wrong!", err);
              res.sendFile(__dirname + "/public/nomusic.svg");
            } else {
              console.log("saved");
              res.sendFile(__dirname + "/public/music.svg");
            }
          }
        );
      } else {
        console.log("not playing");
        res.sendFile(__dirname + "/public/nomusic.svg");
      }
    },
    function (err) {
      console.log("Something went wrong!", err);
      res.sendFile(__dirname + "/public/nomusic.svg");
      // res.redirect(spotifyApi.createAuthorizeURL(scopes));
    }
  );
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
