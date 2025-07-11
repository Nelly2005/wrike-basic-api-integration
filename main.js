"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var dotenv_1 = require("dotenv");
dotenv_1["default"].config();
var fs_1 = require("fs");
var token = process.env.WRIKE_API_TOKEN;
var url = 'https://www.wrike.com/api/v4/tasks?fields=[responsibleIds,parentIds]';
var mappedTasks = [];
function getTasks() {
    return __awaiter(this, void 0, void 0, function () {
        var response, getResult, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, fetch(url, {
                            method: 'GET',
                            headers: {
                                'Authorization': "Bearer ".concat(token)
                            }
                        })];
                case 1:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error("Request failed with status ".concat(response.status));
                    }
                    return [4 /*yield*/, response.json()];
                case 2:
                    getResult = _a.sent();
                    mappedTasks = getResult.data.map(function (value) { return ({
                        id: value.id,
                        name: value.title,
                        assignees: value.responsibleIds,
                        status: value.status,
                        collections: value.parentIds,
                        created_at: value.createdDate,
                        updated_at: value.updatedDate,
                        ticket_url: value.permalink
                    }); });
                    fs_1["default"].writeFile('tasks.json', JSON.stringify(mappedTasks), function (err) {
                        if (err) {
                            console.error('Error writing file:', err);
                        }
                        else {
                            console.log('File written successfully');
                        }
                    });
                    return [3 /*break*/, 4];
                case 3:
                    e_1 = _a.sent();
                    console.error('Fetch error:', e_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
getTasks();
// fetch(url,
//     {
//         method: 'GET',
//         headers: {
//             'Authorization': `Bearer ${token}`
//         }
//     })
//     .then(response  => response.json())
//     .then((result:{kind: "tasks", data : task[]}):void=>{
//         mappedTasks = result.data.map((value:task):mappedTask =>
//              ({
//                 id: value.id,
//                 name: value.title,
//                 assignees: value.responsibleIds,
//                 status: value.status,
//                 collections: value.parentIds,
//                 created_at: value.createdDate,
//                 updated_at: value.updatedDate,
//                 ticket_url: value.permalink
//             })
//         );
//        fs.writeFile('tasks.json', JSON.stringify(mappedTasks, null, 2), (err: NodeJS.ErrnoException | null) => {
//            if (err) {console.log("omg error:",err);}
//            else {
//                console.log('great great!!');
//            }
//        })
//     })
//     .catch(err=>{
//         console.log(err);
//     });
