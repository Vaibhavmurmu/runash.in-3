;!function(){try { var e="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof global?global:"undefined"!=typeof window?window:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&((e._debugIds|| (e._debugIds={}))[n]="61ca630c-ec1e-5367-2e3f-1021e3a50bcd")}catch(e){}}();
(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,43498,(e,n,t)=>{"use strict";n.exports=["chrome 111","edge 111","firefox 111","safari 16.4"]},45168,(e,n,t)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r={UNDERSCORE_GLOBAL_ERROR_ROUTE:function(){return s},UNDERSCORE_GLOBAL_ERROR_ROUTE_ENTRY:function(){return u},UNDERSCORE_NOT_FOUND_ROUTE:function(){return i},UNDERSCORE_NOT_FOUND_ROUTE_ENTRY:function(){return a}};for(var o in r)Object.defineProperty(t,o,{enumerable:!0,get:r[o]});let i="/_not-found",a=`${i}/page`,s="/_global-error",u=`${s}/page`},75569,(e,n,t)=>{"use strict";var r,o=e.i(49302);Object.defineProperty(t,"__esModule",{value:!0});var i={APP_CLIENT_INTERNALS:function(){return en},APP_PATHS_MANIFEST:function(){return N},APP_PATH_ROUTES_MANIFEST:function(){return A},AdapterOutputType:function(){return _},BARREL_OPTIMIZATION_PREFIX:function(){return V},BLOCKED_PAGES:function(){return G},BUILD_ID_FILE:function(){return k},BUILD_MANIFEST:function(){return m},CLIENT_PUBLIC_FILES_PATH:function(){return Y},CLIENT_REFERENCE_MANIFEST:function(){return X},CLIENT_STATIC_FILES_PATH:function(){return W},CLIENT_STATIC_FILES_RUNTIME_MAIN:function(){return J},CLIENT_STATIC_FILES_RUNTIME_MAIN_APP:function(){return ee},CLIENT_STATIC_FILES_RUNTIME_POLYFILLS:function(){return eo},CLIENT_STATIC_FILES_RUNTIME_POLYFILLS_SYMBOL:function(){return ei},CLIENT_STATIC_FILES_RUNTIME_REACT_REFRESH:function(){return et},CLIENT_STATIC_FILES_RUNTIME_WEBPACK:function(){return er},COMPILER_INDEXES:function(){return E},COMPILER_NAMES:function(){return c},CONFIG_FILES:function(){return w},DEFAULT_RUNTIME_WEBPACK:function(){return ea},DEFAULT_SANS_SERIF_FONT:function(){return e_},DEFAULT_SERIF_FONT:function(){return eE},DEV_CLIENT_MIDDLEWARE_MANIFEST:function(){return v},DEV_CLIENT_PAGES_MANIFEST:function(){return b},DYNAMIC_CSS_MANIFEST:function(){return Z},EDGE_RUNTIME_WEBPACK:function(){return es},EDGE_UNSUPPORTED_NODE_APIS:function(){return eT},EXPORT_DETAIL:function(){return L},EXPORT_MARKER:function(){return P},FUNCTIONS_CONFIG_MANIFEST:function(){return O},IMAGES_MANIFEST:function(){return F},INTERCEPTION_ROUTE_REWRITE_MANIFEST:function(){return Q},MIDDLEWARE_BUILD_MANIFEST:function(){return $},MIDDLEWARE_MANIFEST:function(){return U},MIDDLEWARE_REACT_LOADABLE_MANIFEST:function(){return q},MODERN_BROWSERSLIST_TARGET:function(){return s.default},NEXT_BUILTIN_DOCUMENT:function(){return K},NEXT_FONT_MANIFEST:function(){return h},PAGES_MANIFEST:function(){return S},PHASE_DEVELOPMENT_SERVER:function(){return p},PHASE_EXPORT:function(){return l},PHASE_INFO:function(){return R},PHASE_PRODUCTION_BUILD:function(){return f},PHASE_PRODUCTION_SERVER:function(){return d},PHASE_TEST:function(){return T},PRERENDER_MANIFEST:function(){return x},REACT_LOADABLE_MANIFEST:function(){return j},ROUTES_MANIFEST:function(){return C},RSC_MODULE_TYPES:function(){return ep},SERVER_DIRECTORY:function(){return B},SERVER_FILES_MANIFEST:function(){return D},SERVER_PROPS_ID:function(){return ec},SERVER_REFERENCE_MANIFEST:function(){return z},STATIC_PROPS_ID:function(){return eu},STATIC_STATUS_PAGES:function(){return el},STRING_LITERAL_DROP_BUNDLE:function(){return H},SUBRESOURCE_INTEGRITY_MANIFEST:function(){return g},SYSTEM_ENTRYPOINTS:function(){return eR},TRACE_OUTPUT_VERSION:function(){return ef},TURBOPACK_CLIENT_BUILD_MANIFEST:function(){return M},TURBOPACK_CLIENT_MIDDLEWARE_MANIFEST:function(){return y},TURBO_TRACE_DEFAULT_MEMORY_LIMIT:function(){return ed},UNDERSCORE_GLOBAL_ERROR_ROUTE:function(){return u.UNDERSCORE_GLOBAL_ERROR_ROUTE},UNDERSCORE_GLOBAL_ERROR_ROUTE_ENTRY:function(){return u.UNDERSCORE_GLOBAL_ERROR_ROUTE_ENTRY},UNDERSCORE_NOT_FOUND_ROUTE:function(){return u.UNDERSCORE_NOT_FOUND_ROUTE},UNDERSCORE_NOT_FOUND_ROUTE_ENTRY:function(){return u.UNDERSCORE_NOT_FOUND_ROUTE_ENTRY},WEBPACK_STATS:function(){return I}};for(var a in i)Object.defineProperty(t,a,{enumerable:!0,get:i[a]});let s=e.r(81258)._(e.r(43498)),u=e.r(45168),c={client:"client",server:"server",edgeServer:"edge-server"},E={[c.client]:0,[c.server]:1,[c.edgeServer]:2};var _=((r={}).PAGES="PAGES",r.PAGES_API="PAGES_API",r.APP_PAGE="APP_PAGE",r.APP_ROUTE="APP_ROUTE",r.PRERENDER="PRERENDER",r.STATIC_FILE="STATIC_FILE",r.MIDDLEWARE="MIDDLEWARE",r);let l="phase-export",f="phase-production-build",d="phase-production-server",p="phase-development-server",T="phase-test",R="phase-info",S="pages-manifest.json",I="webpack-stats.json",N="app-paths-manifest.json",A="app-path-routes-manifest.json",m="build-manifest.json",O="functions-config-manifest.json",g="subresource-integrity-manifest",h="next-font-manifest",P="export-marker.json",L="export-detail.json",x="prerender-manifest.json",C="routes-manifest.json",F="images-manifest.json",D="required-server-files.json",b="_devPagesManifest.json",U="middleware-manifest.json",y="_clientMiddlewareManifest.json",M="client-build-manifest.json",v="_devMiddlewareManifest.json",j="react-loadable-manifest.json",B="server",w=["next.config.js","next.config.mjs","next.config.ts",...o.default?.features?.typescript?["next.config.mts"]:[]],k="BUILD_ID",G=["/_document","/_app","/_error"],Y="public",W="static",H="__NEXT_DROP_CLIENT_FILE__",K="__NEXT_BUILTIN_DOCUMENT__",V="__barrel_optimize__",X="client-reference-manifest",z="server-reference-manifest",$="middleware-build-manifest",q="middleware-react-loadable-manifest",Q="interception-route-rewrite-manifest",Z="dynamic-css-manifest",J="main",ee=`${J}-app`,en="app-pages-internals",et="react-refresh",er="webpack",eo="polyfills",ei=Symbol(eo),ea="webpack-runtime",es="edge-runtime-webpack",eu="__N_SSG",ec="__N_SSP",eE={name:"Times New Roman",xAvgCharWidth:821,azAvgWidth:854.3953488372093,unitsPerEm:2048},e_={name:"Arial",xAvgCharWidth:904,azAvgWidth:934.5116279069767,unitsPerEm:2048},el=["/500"],ef=1,ed=6e3,ep={client:"client",server:"server"},eT=["clearImmediate","setImmediate","BroadcastChannel","ByteLengthQueuingStrategy","CompressionStream","CountQueuingStrategy","DecompressionStream","DomException","MessageChannel","MessageEvent","MessagePort","ReadableByteStreamController","ReadableStreamBYOBRequest","ReadableStreamDefaultController","TransformStreamDefaultController","WritableStreamDefaultController"],eR=new Set([J,et,ee]);("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),n.exports=t.default)},72422,(e,n,t)=>{n.exports=e.r(75569)},21500,(e,n,t)=>{"use strict";function r(){return null}Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"default",{enumerable:!0,get:function(){return r}}),("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),n.exports=t.default)},94726,e=>{"use strict";var n=e.i(66567),t=e.i(6933);function r(e,n,r,o,i){(0,t._INTERNAL_captureLog)({level:e,message:n,attributes:r,severityNumber:i},o)}function o(e,n,{scope:t}={}){r("trace",e,n,t)}function i(e,n,{scope:t}={}){r("debug",e,n,t)}function a(e,n,{scope:t}={}){r("info",e,n,t)}function s(e,n,{scope:t}={}){r("warn",e,n,t)}function u(e,n,{scope:t}={}){r("error",e,n,t)}function c(e,n,{scope:t}={}){r("fatal",e,n,t)}e.s(["debug",()=>i,"error",()=>u,"fatal",()=>c,"info",()=>a,"trace",()=>o,"warn",()=>s],35292),e.i(35292);let E=function(e,...n){let t=new String(String.raw(e,...n));return t.__sentry_template_string__=e.join("\0").replace(/%/g,"%%").replace(/\0/g,"%s"),t.__sentry_template_values__=n,t};e.s(["debug",()=>i,"error",()=>u,"fatal",()=>c,"fmt",()=>E,"info",()=>a,"trace",()=>o,"warn",()=>s],2215);var _=e.i(2215),_=_,l=e.i(5778),f=e.i(31945);async function d(){let e=(0,l.getClient)();if(!e)return"no-client-active";if(!e.getDsn())return"no-dsn-configured";try{await (0,f.suppressTracing)(()=>fetch("https://o447951.ingest.sentry.io/api/4509632503087104/envelope/?sentry_version=7&sentry_key=c1dfb07d783ad5325c245c1fd3725390&sentry_client=sentry.javascript.browser%2F1.33.7",{body:"{}",method:"POST",mode:"cors",credentials:"omit"}))}catch{return"sentry-unreachable"}}var p=e.i(91986),T=e.i(66848),R=e.i(69596),S=e.i(49302),I=e.i(72422),N=e.i(21500),A=e.i(79783);class m extends Error{constructor(e){super(e),this.name="SentryExampleFrontendError"}}function O(){let[e,t]=(0,A.useState)(!1),[r,o]=(0,A.useState)(!0);return(0,A.useEffect)(()=>{_.info("Sentry example page loaded"),async function(){o("sentry-unreachable"!==await d())}()},[]),(0,n.jsxs)("div",{children:[(0,n.jsxs)(N.default,{children:[(0,n.jsx)("title",{children:"sentry-example-page"}),(0,n.jsx)("meta",{name:"description",content:"Test Sentry for your Next.js app!"})]}),(0,n.jsxs)("main",{children:[(0,n.jsx)("div",{className:"flex-spacer"}),(0,n.jsx)("svg",{height:"40",width:"40",fill:"none",xmlns:"http://www.w3.org/2000/svg",role:"img","aria-label":"Sentry logo",children:(0,n.jsx)("path",{d:"M21.85 2.995a3.698 3.698 0 0 1 1.353 1.354l16.303 28.278a3.703 3.703 0 0 1-1.354 5.053 3.694 3.694 0 0 1-1.848.496h-3.828a31.149 31.149 0 0 0 0-3.09h3.815a.61.61 0 0 0 .537-.917L20.523 5.893a.61.61 0 0 0-1.057 0l-3.739 6.494a28.948 28.948 0 0 1 9.63 10.453 28.988 28.988 0 0 1 3.499 13.78v1.542h-9.852v-1.544a19.106 19.106 0 0 0-2.182-8.85 19.08 19.08 0 0 0-6.032-6.829l-1.85 3.208a15.377 15.377 0 0 1 6.382 12.484v1.542H3.696A3.694 3.694 0 0 1 0 34.473c0-.648.17-1.286.494-1.849l2.33-4.074a8.562 8.562 0 0 1 2.689 1.536L3.158 34.17a.611.611 0 0 0 .538.917h8.448a12.481 12.481 0 0 0-6.037-9.09l-1.344-.772 4.908-8.545 1.344.77a22.16 22.16 0 0 1 7.705 7.444 22.193 22.193 0 0 1 3.316 10.193h3.699a25.892 25.892 0 0 0-3.811-12.033 25.856 25.856 0 0 0-9.046-8.796l-1.344-.772 5.269-9.136a3.698 3.698 0 0 1 3.2-1.849c.648 0 1.285.17 1.847.495Z",fill:"currentcolor"})}),(0,n.jsx)("h1",{children:"sentry-example-page"}),(0,n.jsxs)("p",{className:"description",children:["Click the button below, and view the sample error on the Sentry"," ",(0,n.jsx)("a",{target:"_blank",rel:"noopener",href:"https://runash-bf.sentry.io/issues/?project=4510615711186944",children:"Issues Page"}),". For more details about setting up Sentry,"," ",(0,n.jsx)("a",{target:"_blank",rel:"noopener",href:"https://docs.sentry.io/platforms/javascript/guides/nextjs/",children:"read our docs"}),"."]}),(0,n.jsx)("button",{type:"button",onClick:async()=>{var e,n,r;let o,i;throw _.info("User clicked the button, throwing a sample error"),await (e={name:"Example Frontend/Backend Span",op:"test"},(r=n=async()=>{(await fetch("/api/sentry-example-api")).ok||t(!0)},o=S.default.env.NEXT_PHASE===I.PHASE_PRODUCTION_BUILD,(i=!!r&&function(e){if(e.$$typeof!==Symbol.for("react.server.reference"))return!1;let{type:n}=function(e){let n=parseInt(e.slice(0,2),16),t=n>>1&63,r=Array(6);for(let e=0;e<6;e++){let n=t>>5-e&1;r[e]=1===n}return{type:1==(n>>7&1)?"use-cache":"server-action",usedArgs:r,hasRestArgs:1==(1&n)}}(e.$$id);return"use-cache"===n}(r))&&R.DEBUG_BUILD&&p.debug.log("Skipping span creation in Cache Components context"),o||i)?n(new T.SentryNonRecordingSpan({traceId:"00000000000000000000000000000000",spanId:"0000000000000000"})):(0,f.startSpan)(e,n)),new m("This error is raised on the frontend of the example page.")},disabled:!r,children:(0,n.jsx)("span",{children:"Throw Sample Error"})}),e?(0,n.jsx)("p",{className:"success",children:"Error sent to Sentry."}):r?(0,n.jsx)("div",{className:"success_placeholder"}):(0,n.jsx)("div",{className:"connectivity-error",children:(0,n.jsx)("p",{children:"It looks like network requests to Sentry are being blocked, which will prevent errors from being captured. Try disabling your ad-blocker to complete the test."})}),(0,n.jsx)("div",{className:"flex-spacer"})]}),(0,n.jsx)("style",{children:`
        main {
          display: flex;
          min-height: 100vh;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 16px;
          padding: 16px;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif;
        }

        h1 {
          padding: 0px 4px;
          border-radius: 4px;
          background-color: rgba(24, 20, 35, 0.03);
          font-family: monospace;
          font-size: 20px;
          line-height: 1.2;
        }

        p {
          margin: 0;
          font-size: 20px;
        }

        a {
          color: #6341F0;
          text-decoration: underline;
          cursor: pointer;

          @media (prefers-color-scheme: dark) {
            color: #B3A1FF;
          }
        }

        button {
          border-radius: 8px;
          color: white;
          cursor: pointer;
          background-color: #553DB8;
          border: none;
          padding: 0;
          margin-top: 4px;

          & > span {
            display: inline-block;
            padding: 12px 16px;
            border-radius: inherit;
            font-size: 20px;
            font-weight: bold;
            line-height: 1;
            background-color: #7553FF;
            border: 1px solid #553DB8;
            transform: translateY(-4px);
          }

          &:hover > span {
            transform: translateY(-8px);
          }

          &:active > span {
            transform: translateY(0);
          }

          &:disabled {
	            cursor: not-allowed;
	            opacity: 0.6;

	            & > span {
	              transform: translateY(0);
	              border: none
	            }
	          }
        }

        .description {
          text-align: center;
          color: #6E6C75;
          max-width: 500px;
          line-height: 1.5;
          font-size: 20px;

          @media (prefers-color-scheme: dark) {
            color: #A49FB5;
          }
        }

        .flex-spacer {
          flex: 1;
        }

        .success {
          padding: 12px 16px;
          border-radius: 8px;
          font-size: 20px;
          line-height: 1;
          background-color: #00F261;
          border: 1px solid #00BF4D;
          color: #181423;
        }

        .success_placeholder {
          height: 46px;
        }

        .connectivity-error {
          padding: 12px 16px;
          background-color: #E50045;
          border-radius: 8px;
          width: 500px;
          color: #FFFFFF;
          border: 1px solid #A80033;
          text-align: center;
          margin: 0;
        }

        .connectivity-error a {
          color: #FFFFFF;
          text-decoration: underline;
        }
      `})]})}e.s(["default",()=>O],94726)}]);

//# debugId=61ca630c-ec1e-5367-2e3f-1021e3a50bcd
//# sourceMappingURL=400b6ca79caea666.js.map