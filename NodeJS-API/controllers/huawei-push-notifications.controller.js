const fetch = require("node-fetch");
const config = require("../config/huawei-config");

async function huaweiSendataMessage(request, response, next) {
  const {
    name,
    chatMessage,
    chatId,
    imageUrl,
    title,
    body,
    path,
    status,
    invoiceLink,
    loggedInRole,
  } = request.body;

  if (
    name == null ||
    chatMessage == null ||
    chatId == null ||
    imageUrl == null ||
    title == null ||
    body == null ||
    path == null ||
    status == null ||
    invoiceLink == null ||
    loggedInRole == null
  ) {
    return response.status(500).send({
      message: "Required field missing",
    });
  }

  const requestUrl = `${config.AuthUrl}?grant_type=client_credentials&client_id=${config.AppId}&client_secret=${config.AppSecret}`;
  try {
    const result = await fetch(requestUrl).then((response) => response.json());
    let accessToken = result["access_token"];
    console.log(`ACCESS_TOKEN=${accessToken}`);

    let data = `{"name": "${name}", "message": "${chatMessage}", "title": "${title}", "body": "${body}", "path": "${path}", "status": "${status}", "invoiceLink": "${invoiceLink}", "loggedInRole": "${loggedInRole}", "imageUrl": "${imageUrl}", "chatId": "${chatId}"}`;
    let postData = JSON.stringify({
      validate_only: false,
      message: {
        data: data,
        token: [config.TargetToken],
        // android: {
        //   notification: {
        //     title: name,
        //     body: chatMessage,
        //     click_action: {
        //       type: 3,
        //     },
        //     style: 3,
        //     inbox_content: [
        //       "1.diverse styles",
        //       "2.finer segments",
        //       "3.automated notification",
        //     ],
        //   },
        // },
      },
    });

    let url = `${config.PushUrl}/${config.AppId}/messages:send?client_id=${config.AppId}&grant_type=client_credentials&client_secret=${config.AppSecret}`;

    await fetch(url, {
      method: "POST",
      body: postData,
      headers: {
        POST: "/oauth2/v2/token   HTTP/1.1",
        host: "oauth-login.cloud.huawei.com",
        "Content-type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        return response.status(200).send(json);
      });
  } catch (err) {
    console.log(err);
    return response.status(400).send("An error occured");
  }
}

module.exports = {
  huaweiSendataMessage,
};
