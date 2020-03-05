// Copyright 2020 skdltmxn. All rights reserved.

'use strict';

const config = require('../../config');
const MongoClient = require('mongodb').MongoClient;

const generateConnectionUri = () => {
    const cred = (config.DB_USER && config.DB_PASS)
        ? `${config.DB_USER}:${config.DB_PASS}@`
        : '';
    const server = `${config.DB_HOST}:${config.DB_PORT}`;

    return `mongodb://${cred}${server}`;
}

class DbClient {
    constructor(dbName) {
        this.client = new MongoClient(generateConnectionUri(), {
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

    async findOneAndDelete(collectionName, query, ...options) {
        if (!this.client.isConnected())
            throw new Error('db is not connected');

        const collection = this.db.collection(collectionName);
        const result = await collection.findOneAndDelete(query, ...options);
        return result.value;
    }

    async findOneAndUpdate(collectionName, query, update, ...options) {
        if (!this.client.isConnected())
            throw new Error('db is not connected');

        const collection = this.db.collection(collectionName);
        const result = await collection.findOneAndUpdate(query, update, ...options);
        return result.ok === 1;
    }

    async insertOne(collectionName, document) {
        if (!this.client.isConnected())
            throw new Error('db is not connected');

        const collection = this.db.collection(collectionName);
        const result = await collection.insertOne(document);
        if (result.result.ok !== 1)
            throw new Error('failed to insertOne documents');

        return result.ops[0];
    }

    async insertMany(collectionName, documents) {
        if (!this.client.isConnected())
            throw new Error('db is not connected');

        const collection = this.db.collection(collectionName);
        const result = await collection.insertMany(documents);
        if (result.result.ok !== 1)
            throw new Error('failed to insertMany documents');
    }
}

module.exports = DbClient;
