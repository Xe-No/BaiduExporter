var showToast;

(function () {
    // 封装的百度的Toast提示消息
    // Type类型有
    // caution       警告  failure       失败  loading      加载 success      成功
    // MODE_CAUTION  警告  MODE_FAILURE  失败  MODE_LOADING 加载 MODE_SUCCESS 成功

    if (typeof require == "undefined") {
        showToast = function (message, type) {
            Utilities.useToast({
                toastMode: disk.ui.Toast[type],
                msg: message,
                sticky: false
            })
        };
    } else if (typeof manifest == "object") {
        // New version
        var Context = require("system-core:context/context.js").instanceForSystem;
        showToast = function (message, type) {
            if (type.startsWith("MODE")) {
                type = type.split("_")[1].toLowerCase();
            }
            Context.ui.tip({
                mode: type,
                msg: message
            });
        };

        window.addEventListener("message", function (event) {
            if (event.source != window)
                return;

            if (event.data.type == "get_selected") {
                window.postMessage({ type: "selected", data: Context.list.getSelected() }, "*");
            }
        });
    } else {
        var Toast = require("common:widget/toast/toast.js");
        showToast = function (message, type) {
            Toast.obtain.useToast({
                toastMode: Toast.obtain[type],
                msg: message,
                sticky: false
            });
        };
    }

    window.addEventListener("message", function (event) {
        if (event.source != window)
            return;

        if (event.data.type == "show_toast") {
            var request = event.data.data;
            showToast(request.message, request.type);

            var button = $("#export_menu");
            if (button.length != 0) {
                try {
                    button.parent()[0].removeChild = function () {
                        console.log("Remove me? Naive!");
                    };
                } catch (e) {
                    console.log("Unable to hook removeChild");
                }
            }
        }
    });

    if (window.yunData)
        window.postMessage({ type: "yunData", data: JSON.stringify(window.yunData) }, "*");
    else if (window.disk.ui.album) {
        var real = window.disk.ui.album.prototype.buildListView;
        window.disk.ui.album.prototype.buildListView = function (list) {
            window.postMessage({ type: "yunData", data: JSON.stringify(list) }, "*");
            real.call(this, list);
        }
    }
    else if (disk.util.ViewShareUtils) {
        window.postMessage({ type: "yunData", data: disk.util.ViewShareUtils.viewShareData }, "*");
    }
})();