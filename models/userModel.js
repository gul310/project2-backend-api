const bcrypt = require('bcryptjs');

let users = [
    {
        id: 1,
        username: 'admin',
        email: 'admin@novaai.com',
        password: bcrypt.hashSync('Admin@2026', 10),
        name: 'Admin User',
        phone: '+1234567890',
        role: 'admin',
        isActive: true,
        createdAt: new Date('2024-01-01T10:00:00Z'),
        updatedAt: new Date('2024-01-01T10:00:00Z')
    },
    {
        id: 2,
        username: 'johndoe',
        email: 'john@example.com',
        password: bcrypt.hashSync('John@2026', 10),
        name: 'John Doe',
        phone: '+1987654321',
        role: 'user',
        isActive: true,
        createdAt: new Date('2024-01-02T14:30:00Z'),
        updatedAt: new Date('2024-01-02T14:30:00Z')
    }
];

let nextId = 3;

class UserModel {
    static findAll() {
        return users.map(({ password, ...user }) => user);
    }

    static findById(id) {
        const user = users.find(user => user.id === id);
        if (user) {
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        }
        return null;
    }

    static findByEmail(email) {
        return users.find(user => user.email.toLowerCase() === email.toLowerCase());
    }

    static findByUsername(username) {
        return users.find(user => user.username.toLowerCase() === username.toLowerCase());
    }

    static create(userData) {
        const { password, ...rest } = userData;
        const hashedPassword = bcrypt.hashSync(password, 10);
        
        const newUser = {
            id: nextId++,
            ...rest,
            password: hashedPassword,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        users.push(newUser);
        
        const { password: _, ...userWithoutPassword } = newUser;
        return userWithoutPassword;
    }

    static update(id, updateData) {
        const userIndex = users.findIndex(user => user.id === id);
        if (userIndex === -1) return null;

        const updatedUser = {
            ...users[userIndex],
            ...updateData,
            updatedAt: new Date()
        };
        users[userIndex] = updatedUser;

        const { password, ...userWithoutPassword } = updatedUser;
        return userWithoutPassword;
    }

    static delete(id) {
        const userIndex = users.findIndex(user => user.id === id);
        if (userIndex === -1) return false;
        users.splice(userIndex, 1);
        return true;
    }

    static verifyPassword(password, hashedPassword) {
        return bcrypt.compareSync(password, hashedPassword);
    }
}

module.exports = UserModel;
