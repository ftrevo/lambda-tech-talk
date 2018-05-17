const mongoose = require('mongoose');

const options = {
    autoIndex: false, // Don't build indexes
    reconnectTries: 1, //Number.MAX_VALUE, // Never stop trying to reconnect
    reconnectInterval: 500, // Reconnect every 500ms
    poolSize: 2, // Maintain up to 10 socket connections
    bufferMaxEntries: 0,// If not connected, return errors immediately rather than waiting for reconnect
    bufferCommands: false
};

module.exports.generateConn = (conn, context) => {
    context.callbackWaitsForEmptyEventLoop = false;

    return new Promise((resolve, reject) => {
        if (conn && conn.db && conn.db.serverConfig && conn.db.serverConfig.isConnected()) {
            console.log('Reutilizando conexão.')
            return resolve(conn);
        }

        mongoose.set('debug', process.env.MONGOOSE_DEBUG == 'true');
        mongoose.set('bufferCommands', false);

        mongoose.connection.on('connected', () => {
            console.log('Conectado ao banco de dados.');
        });

        mongoose.connection.on('error', (errorConnectingToDatabase) => {
            console.error(errorConnectingToDatabase);
            return reject(errorConnectingToDatabase);
        });

        mongoose.connect(process.env.DB_URI, options).then(() => {
            return resolve(mongoose.connection);
        });
    });
}
