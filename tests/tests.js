(async () => {
    var bs = new BrowserSignatureJS();
    await bs.init();
    console.log(bs.getSignature());
})();