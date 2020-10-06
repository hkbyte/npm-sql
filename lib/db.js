"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Knex = exports.createDatabaseClient = void 0;
const knex_1 = __importDefault(require("knex"));
exports.Knex = knex_1.default;
function createDatabaseClient(config) {
    return knex_1.default(config);
}
exports.createDatabaseClient = createDatabaseClient;
