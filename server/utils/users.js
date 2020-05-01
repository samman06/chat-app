class Users {
    constructor() {
        this.users = [];
    }

    addUser(user) {
        this.users.push(user);
        return user;
    }

    removeUser(userId) {
        let user = this.getUser(userId);
        if (user)
            this.users = this.users.filter(({id}) => id !== userId);
        return user;
    };

    getUser(userId) {
        return this.users.filter(({id}) => id === userId)[0]
    }

    getUserList(userRoom) {
        let users = this.users.filter(({room}) => room === userRoom);
        return users.map((user) => user.name);
    }
}

const user = new Users();
module.exports = user;
