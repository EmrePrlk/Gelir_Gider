"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("middleware",{

/***/ "(middleware)/./middleware.ts":
/*!***********************!*\
  !*** ./middleware.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   config: () => (/* binding */ config),\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _auth__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/auth */ \"(middleware)/./auth.ts\");\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/server */ \"(middleware)/./node_modules/next/dist/esm/api/server.js\");\n\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_auth__WEBPACK_IMPORTED_MODULE_0__.auth)((req)=>{\n    const isLoggedIn = !!req.auth;\n    const isAuthPage = req.nextUrl.pathname.startsWith(\"/login\");\n    if (!isLoggedIn && !isAuthPage) {\n        return next_server__WEBPACK_IMPORTED_MODULE_1__.NextResponse.redirect(new URL(\"/login\", req.nextUrl));\n    }\n    if (isLoggedIn && isAuthPage) {\n        return next_server__WEBPACK_IMPORTED_MODULE_1__.NextResponse.redirect(new URL(\"/dashboard\", req.nextUrl));\n    }\n    return next_server__WEBPACK_IMPORTED_MODULE_1__.NextResponse.next();\n}));\nconst config = {\n    matcher: [\n        \"/((?!api|_next/static|_next/image|favicon.ico|demo).*)\"\n    ]\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKG1pZGRsZXdhcmUpLy4vbWlkZGxld2FyZS50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQTZCO0FBQ2E7QUFFMUMsaUVBQWVBLDJDQUFJQSxDQUFDLENBQUNFO0lBQ25CLE1BQU1DLGFBQWEsQ0FBQyxDQUFDRCxJQUFJRixJQUFJO0lBQzdCLE1BQU1JLGFBQWFGLElBQUlHLE9BQU8sQ0FBQ0MsUUFBUSxDQUFDQyxVQUFVLENBQUM7SUFFbkQsSUFBSSxDQUFDSixjQUFjLENBQUNDLFlBQVk7UUFDOUIsT0FBT0gscURBQVlBLENBQUNPLFFBQVEsQ0FBQyxJQUFJQyxJQUFJLFVBQVVQLElBQUlHLE9BQU87SUFDNUQ7SUFFQSxJQUFJRixjQUFjQyxZQUFZO1FBQzVCLE9BQU9ILHFEQUFZQSxDQUFDTyxRQUFRLENBQUMsSUFBSUMsSUFBSSxjQUFjUCxJQUFJRyxPQUFPO0lBQ2hFO0lBRUEsT0FBT0oscURBQVlBLENBQUNTLElBQUk7QUFDMUIsRUFBRTtBQUVLLE1BQU1DLFNBQVM7SUFDcEJDLFNBQVM7UUFBQztLQUF5RDtBQUNyRSxFQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vX05fRS8uL21pZGRsZXdhcmUudHM/NDIyZCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBhdXRoIH0gZnJvbSAnQC9hdXRoJ1xuaW1wb3J0IHsgTmV4dFJlc3BvbnNlIH0gZnJvbSAnbmV4dC9zZXJ2ZXInXG5cbmV4cG9ydCBkZWZhdWx0IGF1dGgoKHJlcSkgPT4ge1xuICBjb25zdCBpc0xvZ2dlZEluID0gISFyZXEuYXV0aFxuICBjb25zdCBpc0F1dGhQYWdlID0gcmVxLm5leHRVcmwucGF0aG5hbWUuc3RhcnRzV2l0aCgnL2xvZ2luJylcblxuICBpZiAoIWlzTG9nZ2VkSW4gJiYgIWlzQXV0aFBhZ2UpIHtcbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLnJlZGlyZWN0KG5ldyBVUkwoJy9sb2dpbicsIHJlcS5uZXh0VXJsKSlcbiAgfVxuXG4gIGlmIChpc0xvZ2dlZEluICYmIGlzQXV0aFBhZ2UpIHtcbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLnJlZGlyZWN0KG5ldyBVUkwoJy9kYXNoYm9hcmQnLCByZXEubmV4dFVybCkpXG4gIH1cblxuICByZXR1cm4gTmV4dFJlc3BvbnNlLm5leHQoKVxufSlcblxuZXhwb3J0IGNvbnN0IGNvbmZpZyA9IHtcbiAgbWF0Y2hlcjogWycvKCg/IWFwaXxfbmV4dC9zdGF0aWN8X25leHQvaW1hZ2V8ZmF2aWNvbi5pY298ZGVtbykuKiknXSxcbn1cbiJdLCJuYW1lcyI6WyJhdXRoIiwiTmV4dFJlc3BvbnNlIiwicmVxIiwiaXNMb2dnZWRJbiIsImlzQXV0aFBhZ2UiLCJuZXh0VXJsIiwicGF0aG5hbWUiLCJzdGFydHNXaXRoIiwicmVkaXJlY3QiLCJVUkwiLCJuZXh0IiwiY29uZmlnIiwibWF0Y2hlciJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(middleware)/./middleware.ts\n");

/***/ })

});