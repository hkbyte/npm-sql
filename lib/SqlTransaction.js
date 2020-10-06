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
Object.defineProperty(exports, "__esModule", { value: true });
class SqlTransaction {
    constructor(dbClient, trx = undefined) {
        this.db = dbClient;
        this.trx = trx || undefined;
        this.trxFlag = false;
    }
    /**
     * Start Transaction
     */
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.trxFlag && !this.trx) {
                const trxProvider = this.db.transactionProvider();
                this.trx = yield trxProvider();
                this.trxFlag = true;
            }
        });
    }
    /**
     * Commit Transaction
     */
    commit() {
        if (this.trxFlag && this.trx) {
            this.trx.commit();
            this.trxFlag = false;
        }
    }
    /**
     * Rollback Transaction
     */
    rollback() {
        if (this.trxFlag && this.trx) {
            this.trx.rollback();
            this.trxFlag = false;
        }
    }
    /**
     * Knex Query Parameter
     */
    knex(tableName = undefined, transacting = true) {
        const knexObject = tableName
            ? this.db(tableName)
            : this.db.queryBuilder();
        if (this.trx && transacting) {
            return knexObject.transacting(this.trx);
        }
        return knexObject;
    }
    /**
     * Execute Raw SQL Queries
     */
    query(rawQuery, bindings, transacting = true) {
        const knexObject = this.db.raw(rawQuery, bindings);
        if (this.trx && transacting) {
            return knexObject.transacting(this.trx);
        }
        return knexObject;
    }
}
exports.default = SqlTransaction;
