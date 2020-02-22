// Copyright 2020 skdltmxn. All rights reserved.

'use strict';

const config = require('../../config');
const MongoClient = require('mongodb').MongoClient;

class DbClient {
    constructor(dbName) {
        this.client = new MongoClient(`mongodb://${config.DB_HOST}:${config.DB_PORT}`, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        this.dbName = dbName;
    }

    async connect() {
        await this.client.connect();
        this.db = this.client.db(this.dbName);
    }

    async disconnect() {
        await this.client.close();
    }

    async find(collectionName, query) {
        if (!this.client.isConnected())
            throw new Error('db is not connected');

        const collection = this.db.collection(collectionName);
        return await collection.find(query).toArray();
    }

    async findOne(collectionName, query) {
        if (!this.client.isConnected())
            throw new Error('db is not connected');

        const collection = this.db.collection(collectionName);
        return await collection.findOne(query);
    }
    
    async insertMany(collectionName, documents) {
        if (!this.client.isConnected())
            throw new Error('db is not connected');

        const collection = this.db.collection(collectionName);
        const result = await collection.insertMany(documents);
        if (result.result.ok !== 1)
            throw new Error('failed to insert documents');
    }
}

module.exports = DbClient;
