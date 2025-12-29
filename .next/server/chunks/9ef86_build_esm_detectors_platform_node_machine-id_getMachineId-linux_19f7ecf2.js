;!function(){try { var e="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof global?global:"undefined"!=typeof window?window:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&((e._debugIds|| (e._debugIds={}))[n]="217ad20d-1ef4-7b64-dbb8-82bafaecbe99")}catch(e){}}();
module.exports=[75949,e=>{"use strict";var i=e.i(22734),r=e.i(81582);async function a(){for(let e of["/etc/machine-id","/var/lib/dbus/machine-id"])try{return(await i.promises.readFile(e,{encoding:"utf8"})).trim()}catch(e){r.diag.debug(`error reading machine id: ${e}`)}}e.s(["getMachineId",()=>a])}];

//# debugId=217ad20d-1ef4-7b64-dbb8-82bafaecbe99
//# sourceMappingURL=9ef86_build_esm_detectors_platform_node_machine-id_getMachineId-linux_19f7ecf2.js.map