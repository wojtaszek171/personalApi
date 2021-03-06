const db = require('src/_helpers/db');

module.exports = {
    getAll,
    getSocket,
    getByKey,
    set,
    update,
    delete: _delete
};

async function getAll() {
    return await db.Sockets.findAll();
}


async function getByKey(key) {
    const socket = await db.Sockets.findOne({ where: { key } });
    if (!socket) throw 'Socket not found';
    return socket;
}

async function set(params) {
    if (await db.Sockets.findOne({ where: { key: params.key } })) {
        update(params.key, params);
    } else {
        await db.Sockets.create(params);
    }
}

async function update(key, params) {
    const socket = await getByKey(key);

    // copy params to socket and save
    Object.assign(socket, params);
    await socket.save();
}

async function _delete(key) {
    const socket = await getByKey(key);
    if (!socket) throw 'Socket not found';
    await socket.destroy();
}

// helper functions

async function getSocket(key) {
    const socket = await db.Sockets.findByPk(key);
    if (!socket) throw 'Socket not found';
    return socket;
}
