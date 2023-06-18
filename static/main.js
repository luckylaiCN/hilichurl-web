const WORD_API = "https://eastasia.azure.data.mongodb-api.com/app/hilicurl-data-bxapx/endpoint/words"
var accessToken = null;
var refreshToken = null;
var userId = null;
var deviceId = null;

function anonymousLogin(successCallback) {
    // 尝试从 localStorage 中获取 refresh_token
    refreshToken = localStorage.getItem("hilichurl_refresh_token");

    if (refreshToken) {
        // 如果 refresh_token 存在，则尝试使用它获取新的 access_token
        var sessionUrl = "https://eastasia.azure.realm.mongodb.com/api/client/v2.0/auth/session";
        var sessionHeaders = {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + refreshToken
        };

        $.ajax({
            type: "POST",
            url: sessionUrl,
            headers: sessionHeaders,
            success: function (data) {
                accessToken = data.access_token;
                if (typeof successCallback === "function") {
                    successCallback(data);
                }
            },
            fail: function (error) {
                console.error("使用 refresh_token 获取新的 access_token 失败:", error);
                performAnonymousLogin();
            }
        });

    } else {
        // 如果 refresh_token 不存在，则执行匿名登录
        performAnonymousLogin();
    }
}

function performAnonymousLogin(successCallback) {
    var url = "https://eastasia.azure.realm.mongodb.com/api/client/v2.0/app/hilicurl-data-bxapx/auth/providers/anon-user/login";
    var requestData = {
        "Content-Type": "application/json"
    };

    $.post(url, requestData, function (data) {
        // 处理返回的数据
        console.log(data); // 在控制台输出返回的数据

        // 从返回的数据中提取 access_token、refresh_token 等信息
        accessToken = data.access_token;
        refreshToken = data.refresh_token;
        userId = data.user_id;
        deviceId = data.device_id;

        // 将 refresh_token 存储到 localStorage
        localStorage.setItem("hilichurl_refresh_token", refreshToken);

    }).fail(function (error) {
        // 处理请求失败的情况
        console.error("匿名登录失败:", error);
    }).success(function(data){
        if (typeof successCallback === "function") {
            successCallback(data);
        }
    });
}

function sendApiRequestWord(requestData, successCallback, errorCallback) {
    $.ajax({
        type: "POST",
        url: 'https://eastasia.azure.data.mongodb-api.com/app/hilicurl-data-bxapx/endpoint/words',
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + accessToken);
        },
        contentType: "application/json",
        data: JSON.stringify(requestData),
        success: function (data) {
            if (typeof successCallback === "function") {
                successCallback(data);
            }
        },
        error: function (xhr, status, error) {
            if (typeof errorCallback === "function") {
                errorCallback(error);
            }
        }
    });
}

function sendAPIRequestSentence(data, successCallback, errorCallback) {
    var url = "https://eastasia.azure.data.mongodb-api.com/app/hilicurl-data-bxapx/endpoint/sentences";
    var requestData = JSON.stringify(data);

    $.ajax({
        url: url,
        type: "POST",
        headers: {
            "Authorization": "Bearer " + accessToken,
            "Content-Type": "application/json"
        },
        data: requestData,
        success: function (response) {
            if (typeof successCallback === "function") {
                successCallback(response);
            }
        },
        error: function (error) {
            if (typeof errorCallback === "function") {
                errorCallback(error);
            }
        }
    });
}

