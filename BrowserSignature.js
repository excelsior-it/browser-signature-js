(function (window) {
    class BrowserSignatureJS {
        constructor() {
            this._signature = null;
        }

        async init() {
            this.data = {};
            this.generateBase();
            await this.generateFromFeatures();
            this.generateFromScreen();
            this.generateSignature();
        }

        generateSignature() {
            let d = JSON.stringify(this.data) || '';
            d = d.replace(/({|}|\"|:|;|,|\(|\)| )/gi, '');
            this._signature = window.btoa(d);
        }

        generateBase() {
            const { data } = this;
            const { navigator } = window;
            data.appCodeName = navigator.appCodeName || 'none';
            data.appName = navigator.appName || 'none';
            data.appVersion = navigator.appVersion || 'none';
            data.cookieEnabled = navigator.cookieEnabled || false;
            data.language = navigator.language || 'none';
            data.languages = (navigator.languages || []).join(';');
            data.platform = navigator.platform || 'none';
            data.product = navigator.product || 'none';
            data.productSub = navigator.productSub || 'none';
            data.userAgent = navigator.userAgent || 'none';
            data.vendor = navigator.vendor || 'none';
            data.doNotTrack = navigator.doNotTrack || 'none';
        }

        generateFromScreen() {
            const { screen } = window;
            this.data.screen = {
                width: screen.width,
                height: screen.height,
                colorDepth: screen.colorDepth,
                pixelDepth: screen.pixelDepth
            };
        }

        generateFromCanvas() {
            var canvas = document.createElement('canvas');
            try {
                var gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
                if (gl) {
                    var debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
                    this.data.Canvas = {
                        vendor: gl.getParameter(gl.VENDOR) || '-',
                        version: gl.getParameter(gl.VERSION) || '-',
                        vendor: gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL),
                        renderer: gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
                    };
                }
            } catch (e) {
                this.data.Canvas = {
                    vendor: '-',
                    version: '-',
                    vendor: '-',
                    renderer: '-'
                };   
            }
        }

        async generateFromFeatures() {
            const { data } = this;
            const { navigator } = window;
            const {
                connection, bluetooth, clipboard,
                credentials, geolocation, hid,
                keyboard, locks, mediaCapabilities,
                permissions, plugins, presentation,
                hardwareConcurrency
            } = window.navigator;
            // navigator.connection
            (() => {
                if (!connection) {
                    data.connection = false;
                    return;
                }
                const { effectiveType, rtt, downlink, saveData } = connection;
                data.connection = {
                    effectiveType, rtt, downlink, saveData
                };
            })();
            // navigator.connection
            await (async () => {
                if (!bluetooth) {
                    data.bluetooth = false;
                    return;    
                }
                data.bluetooth = {
                    hasBluetooth: await navigator.bluetooth.getAvailability()
                };
            })();
            // navigator.clipboard
            (() => {
                data.clipboard = typeof clipboard;
            })();
            // navigator.credentials
            (() => {
                if (!credentials) {
                    data.credentials = false;
                    return;    
                }
                data.credentials = true;
            })();
            // navigator.credentials
            (() => {
                if (!geolocation) {
                    data.geolocation = false;
                    return;    
                }
                data.geolocation = true;
            })();
            // navigator.hid
            (() => {
                if (!hid) {
                    data.hid = false;
                    return;    
                }
                data.hid = {
                    onconnect: hid.onconnect,
                    ondisconnect: hid.ondisconnect
                };
            })();
            // navigator.keyboard
            await (async () => {
                if (!keyboard) {
                    data.keyboard = false;
                    return;    
                }
                data.keyboard = {
                  size: (await navigator.keyboard.getLayoutMap()).size
                };
            })();
            // navigator.locks
            await (async () => {
                data.locks = (locks ? true : false);
            })();
            // navigator.mediaCapabilities
            (async () => {
                if (!mediaCapabilities) {
                    data.mediaCapabilities = false;
                    return;    
                }
                data.mediaCapabilities = {
                    decodingInfo: mediaCapabilities.decodingInfo ? true : false
                };
            })();
            // navigator.permissions
            (async () => {
                if (!permissions) {
                    data.permissions = false;
                    return;
                }
                data.permissions = true;
            })();
            // navigator.plugins
            (async () => {
                if (!plugins) {
                    data.plugins = false;
                    return;
                }
                data.plugins = [];
                let i = -1;
                while (++i < plugins.length) {
                    const item = plugins.item(i);
                    const x = {
                        description: item.description,
                        name: item.name,
                        length: item.length,
                        filename: item.filename,
                        plugins: []
                    };
                    let j = -1;
                    while (++j < item.length) {
                        const y = item[j];
                        x.plugins.push({
                            description: y.description,
                            enabledPlugin: (y.enabledPlugin || []).length || 0,
                            suffixes: y.suffixes,
                            type: y.type
                        });
                    }
                    data.plugins.push(x);
                }
            })();
            // navigator.presentation
            (async () => {
                if (!presentation) {
                    data.presentation = false;
                    return;
                }
                data.presentation = {
                    defaultRequest: (presentation.defaultRequest ? true : false),
                    receiver: (presentation.receiver ? true : false)
                };
            })();
            // navigator.permissions
            (async () => {
                data.hardwareConcurrency = hardwareConcurrency || 0;
            })();
        }

        getSignature() {
            return this._signature;
        }
    }

    window.BrowserSignatureJS = BrowserSignatureJS;
})(window);